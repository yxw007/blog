const { glob } = require("fast-glob");
const path = require("path");
const fs = require("fs");
const { log, isObject, isString } = require("./utils");
const sharp = require("sharp");
const axios = require("axios");
const mime = require("mime");
const dayjs = require("dayjs");

const draftDir = path
	.normalize(path.resolve(__dirname, "../studio/draft"))
	.replace(/\\/g, "/");
const articleDir = path
	.normalize(path.resolve(__dirname, "../studio/article"))
	.replace(/\\/g, "/");

/**
 * @param {string} dir
 */
async function findDraft(dir) {
	let pattern = `${dir}/*.md`;
	log.info(pattern);
	let mdPaths = await glob(pattern, {
		dot: true,
		onlyFiles: true,
		objectMode: true,
	});
	if (mdPaths.length == 0) {
		throw new Error(`${dir} not found any md file !`);
	}

	let mdPath = mdPaths[0].path;
	return mdPath;
}

function pickImg(mdPath) {
	let relateImgs = {};
	let regex = /(\.\/(.*\/)*.+\.(png|jpg|jpeg|svg|gif))/gim;
	let content = fs.readFileSync(mdPath, { encoding: "utf8" });

	let match = null;
	while ((match = regex.exec(content)) != null) {
		if (match.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		let resPath = match[0];
		if (!relateImgs[resPath]) {
			relateImgs[resPath] = "";
		}
	}

	return { content, relateImgs };
}

async function compressImg(relateImgs) {
	let set = new Set();
	for (const key of Object.keys(relateImgs)) {
		let rawVal = key;
		let extension = path.extname(rawVal).slice(1);
		let filePath = path.resolve(path.join(draftDir, rawVal));
		if (set.has(filePath)) {
			continue;
		}

		set.add(filePath);
		let buff = fs.readFileSync(filePath);
		let sharpInstance = sharp(buff)[extension]({ quality: 80 });
		try {
			let res = await sharpInstance.toFile(filePath);
			if (res != null) {
				log.info("compress success ! res path:", filePath);
			}
		} catch (error) {
			log.error("compress fail ! res path:", filePath);
		}
	}

	return { relateImgs };
}

/**
 * @param {*} relatePath
 */
async function uploadAImg(relatePath) {
	let filePath = path.resolve(draftDir, relatePath);
	let {
		GITHUB_OWNER,
		GITHUB_REPO,
		GITHUB_DIR,
		GITHUB_BRANCH,
		GITHUB_TOKEN,
		GITHUB_CDN_PREFIX,
		GITHUB_COMMIT_AUTHOR,
		GITHUB_COMMIT_EMAIL,
	} = process.env;
	let fileName = Date.now();
	let extension = path.extname(filePath);
	let githubPath = `${GITHUB_DIR}/${fileName}${extension}`;
	let content = fs.readFileSync(filePath);
	let contentBase64 = content.toString("base64");

	let commitData = JSON.stringify({
		message: "commit image",
		committer: {
			name: GITHUB_COMMIT_AUTHOR,
			email: GITHUB_COMMIT_EMAIL,
		},
		content: contentBase64,
	});

	const contentType = mime.getType(filePath);
	const config = {
		method: "put",
		url: `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubPath}`,
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			"Content-Type": contentType,
			"X-GitHub-Api-Version": "2022-11-28",
			Accept: "application/vnd.github+json",
		},
		data: commitData,
	};

	try {
		const res = await axios(config);
		if (res.status == 201) {
			return `${GITHUB_CDN_PREFIX}/${GITHUB_OWNER}/${GITHUB_REPO}@${GITHUB_BRANCH}/${githubPath}`;
		}
	} catch (error) {
		log.error("upload a image fail !", error);
	}
	return null;
}

async function uploadImg({ relateImgs }) {
	let caches = new Map();
	for (const key of Object.keys(relateImgs)) {
		let url = caches.get(key);
		if (!url) {
			url = await uploadAImg(key);
			relateImgs[key] = url;
			caches.set(key, url);
		}
	}
	return relateImgs;
}

/**
 * @param {MarkdownIt} mdIt
 * @param {*} tokens
 */
function generateArticle(content, relateImgs, articlePath) {
	let regex = /(\.\/(.*\/)*.+\.(png|jpg|jpeg|svg|gif))/gim;
	content = content.replace(regex, (val) => {
		if (relateImgs[val]) {
			return relateImgs[val];
		} else {
			return val;
		}
	});

	fs.writeFileSync(articlePath, content, { encoding: "utf8" });
}

async function run() {
	try {
		const draftMdPath = await findDraft(draftDir);
		const articlePath = path.join(articleDir, "/", path.basename(draftMdPath));
		const { content, relateImgs } = pickImg(draftMdPath);
		const handles = [];
		//1.压缩图片
		handles.push(compressImg);
		//2.上传图片
		handles.push(uploadImg);
		await handles.reduce(async (pre, cur) => {
			return Promise.resolve(pre).then(cur);
		}, relateImgs);
		//3.生产文章
		generateArticle(content, relateImgs, articlePath);
		log.info("draft to article success !");
	} catch (error) {
		log.error("draft to article fail: ", error);
	}
}

run();
