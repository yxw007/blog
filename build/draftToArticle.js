const { glob } = require("fast-glob");
const path = require("path");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
const { log, isObject } = require("./utils");

const draftDir = path
	.normalize(path.resolve(__dirname, "../studio/draft"))
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
	return mdIt.parse(content);
}

function pickImg(tokens) {
	let relateImgTokens = {};
	let regex = /\S.+?\.png/gi;
	function dfs(item) {
		if (Array.isArray(item)) {
			for (const it of item) {
				dfs(it);
			}
		} else if (isObject(item)) {
			for (const key of Object.keys(item)) {
				dfs(item[key]);
			}
		} else {
			if (regex.test(item) && !/^https?/i.test(item)) {
				relateImgTokens[item] = item;
			}
		}
	}

	dfs(tokens);

	return { tokens, relateImgTokens };
}

function compressImg({ tokens, relateImgTokens }) {
	//TODO: 修改到此处?
	console.log(relateImgTokens);
	return { tokens, relateImgTokens };
}

function uploadImg({ tokens, relateImgTokens }) {
	return tokens;
}

function generateArticle() {}

async function run() {
	try {
		const draftMdPath = await findDraft(draftDir);
		const mdTokens = parseMd(draftMdPath);
		const handles = [];
		//1.提取图片资源
		handles.push(pickImg);
		//2.压缩图片
		handles.push(compressImg);
		//3.上传图片
		handles.push(uploadImg);
		const resTokens = await handles.reduce(async (pre, cur) => {
			return Promise.resolve(pre).then(cur);
		}, mdTokens);
		//4.生产文章
		generateArticle(resTokens);
		log.info("draft to article success !");
	} catch (error) {
		log.error("draft to article fail: ", error);
	}
}

run();
