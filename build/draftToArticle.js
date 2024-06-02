const { glob } = require("fast-glob");
const path = require("path");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
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

function parseMd(mdPath) {
	let mdIt = new MarkdownIt();
	let content = fs.readFileSync(mdPath, { encoding: "utf8" });
	return { mdIt, tokens: mdIt.parse(content) };
}

function pickImg(tokens) {
	let relateImgTokens = {};
	let regex = /(\.\/(.*\/)*.+\.(png|jpg|jpeg|svg|gif))/gim;
	function dfs(parent, key) {
		let item = parent[key];
		if (Array.isArray(item)) {
			for (let i = 0; i < item.length; i++) {
				dfs(item, i);
			}
		} else if (isObject(item)) {
			for (const key of Object.keys(item)) {
				dfs(item, key);
			}
		} else if (isString(item)) {
			regex.lastIndex = 0;
			let match = regex.exec(item);
			if (match != null) {
				let resPath = match[0];
				if (!relateImgTokens[resPath]) {
					relateImgTokens[resPath] = [];
				}
				relateImgTokens[resPath].push({
					obj: parent,
					objKey: key,
					rawVal: resPath,
					newVal: "",
				});
			}
		}
	}

	dfs({ data: tokens }, "data");

	return { tokens, relateImgTokens };
}

async function compressImg({ tokens, relateImgTokens }) {
	let set = new Set();
	for (const key of Object.keys(relateImgTokens)) {
		let arr = relateImgTokens[key];
		for (const item of arr) {
			let rawVal = item.rawVal;
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
	}

	return { tokens, relateImgTokens };
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

async function uploadImg({ tokens, relateImgTokens }) {
	let caches = new Map();
	for (const key of Object.keys(relateImgTokens)) {
		let arr = relateImgTokens[key];
		for (const item of arr) {
			let url = caches.get(item.rawVal);
			if (!url) {
				url = await uploadAImg(item.rawVal);
				caches.set(item.rawVal, url);
			}
			item.newVal = url;
			item.obj[item.objKey] = item.newVal;
		}
	}
	return tokens;
}

/**
 * @param {MarkdownIt} mdIt
 * @param {*} tokens
 */
function generateArticle(mdIt, tokens, articlePath) {
	// const content = mdIt.renderer.renderInlineAsText(tokens, mdIt.options);

	const content = mdIt.toString();
	let markdown = "";
	for (const token of tokens) {
		if (token.type === "heading_open") {
			markdown += "#".repeat(parseInt(token.tag.substr(1))) + " ";
		} else if (token.type === "inline") {
			markdown += token.content;
		} else if (token.type === "paragraph_open") {
			markdown += "\n\n";
		}
		// 添加更多的条件来处理不同类型的 tokens
	}

	fs.writeFileSync(articlePath, markdown.trim(), { encoding: "utf8" });
}

async function run() {
	try {
		const draftMdPath = await findDraft(draftDir);
		const articlePath = path.join(articleDir, "/", path.basename(draftMdPath));
		const { mdIt, tokens } = parseMd(draftMdPath);
		const handles = [];
		//1.提取图片资源
		handles.push(pickImg);
		//2.压缩图片
		handles.push(compressImg);
		//3.上传图片
		handles.push(uploadImg);
		const resTokens = await handles.reduce(async (pre, cur) => {
			return Promise.resolve(pre).then(cur);
		}, tokens);
		//4.生产文章
		generateArticle(mdIt, resTokens, articlePath);
		log.info("draft to article success !");
	} catch (error) {
		log.error("draft to article fail: ", error);
	}
}

run();
