const { glob } = require("fast-glob");
const path = require("path");
const fs = require("fs-extra");
const { log } = require("./utils");
const sharp = require("sharp");
const axios = require("axios");
const mime = require("mime");

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
	let regex = /(?<=\()([^https?].{1,}\.(png|jpg|jpeg|svg|gif))(?=\))/gim;
	let content = fs.readFileSync(mdPath, { encoding: "utf8" });

	let match = null;
	while ((match = regex.exec(content)) != null) {
		if (match.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		let resPath = match[0];
		if (!relateImgs[resPath]) {
			relateImgs[resPath] = {};
		}
	}

	return { content, relateImgs };
}

async function compressImg(relateImgs) {
	let set = new Set();
	for (const key of Object.keys(relateImgs)) {
		let rawVal = decodeURIComponent(key);
		let extension = path.extname(rawVal).slice(1);
		let filePath = path.resolve(path.join(draftDir, rawVal));
		if (set.has(filePath)) {
			continue;
		}

		set.add(filePath);
		let buff = fs.readFileSync(filePath);
		let sharpInstance = sharp(buff)[extension]({ quality: 80 });
		try {
			await sharpInstance.toFile(filePath);
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

	const res = {
		success: false,
		url: null,
		cdn: null,
	};

	try {
		const response = await axios(config);
		if (response.status == 201) {
			res.success = true;
			res.cdn = `${GITHUB_CDN_PREFIX}/${GITHUB_OWNER}/${GITHUB_REPO}@${GITHUB_BRANCH}/${githubPath}`;
			res.url = response.data.content.download_url;
		}
	} catch (error) {
		log.error("upload a image fail !", error);
	}

	return res;
}

async function uploadImg({ relateImgs }) {
	let caches = new Map();
	for (const key of Object.keys(relateImgs)) {
		let res = caches.get(key);
		if (!res || !res.success) {
			res = await uploadAImg(decodeURIComponent(key));
			relateImgs[key] = res;
			caches.set(key, res);
		}
	}
	return relateImgs;
}

/**
 * @param {MarkdownIt} mdIt
 * @param {*} tokens
 */
function generateArticle(content, relateImgs, articleDir, filename) {
	let regex = /(?<=\()([^https?].{1,}\.(png|jpg|jpeg|svg|gif))(?=\))/gim;
	let useCDNContent = content.replace(regex, (val) => {
		if (relateImgs[val]) {
			return relateImgs[val].cdn;
		} else {
			return val;
		}
	});
	let sourceContent = content.replace(regex, (val) => {
		if (relateImgs[val]) {
			return relateImgs[val].url;
		} else {
			return val;
		}
	});

	fs.ensureDir(articleDir);

	const articleCDNPath = path.join(articleDir, "/", `${filename}_CDN.md`);
	fs.writeFileSync(articleCDNPath, useCDNContent, { encoding: "utf8" });

	const articlePath = path.join(articleDir, "/", `${filename}.md`);
	fs.writeFileSync(articlePath, sourceContent, { encoding: "utf8" });

	return { articleCDNPath, articlePath };
}

async function run() {
	try {
		const draftMdPath = await findDraft(draftDir);
		const filenameWithExtension = path.basename(draftMdPath);
		const filename = filenameWithExtension.slice(
			0,
			filenameWithExtension.lastIndexOf(".")
		);
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
		const res = generateArticle(content, relateImgs, articleDir, filename);
		log.info("draft to article success !");
		return res;
	} catch (error) {
		log.error("draft to article fail: ", error);
	}
}

module.exports = { toArticle: run };
