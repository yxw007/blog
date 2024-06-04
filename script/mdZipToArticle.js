const { glob } = require("fast-glob");
const path = require("path");
const fs = require("fs-extra");
const compressing = require("compressing");
const { getDraftDir, log } = require("./utils");
const { toArticle } = require("./draftToArticle");

const draftDir = getDraftDir();

/**
 * rename file name
 *
 * xxxxx 976406fcf7a24778b31ce00c5d1cd6c8.md => xxxxx.md
 *
 * xxxxx 976406fcf7a24778b31ce00c5d1cd6c8_CDN.md => xxxxx_CDN.md
 *
 * @param {string} filePath
 */
function renameFileName(filePath) {
	let fileName = path.basename(filePath);
	let newName = fileName;
	let m = /(\s\w{32})(_CDN)?(.md)/g.exec(fileName);
	if (m != null && m.length > 1) {
		newName = newName.replace(m[1], "");
	}
	return filePath.replace(fileName, newName);
}

async function run() {
	try {
		const res = await glob(`${draftDir}/*.zip`);
		if (res.length == 0) {
			log.warn("not found any zip file in draftDir:", draftDir);
			return;
		}
		await compressing.zip.decompress(res[0], draftDir);
		const { articleCDNPath, articlePath } = await toArticle();
		fs.moveSync(articleCDNPath, renameFileName(articleCDNPath), {
			overwrite: true,
		});
		fs.moveSync(articlePath, renameFileName(articlePath), { overwrite: true });
		fs.emptyDirSync(draftDir);
		log.info("mdzip to article success !");
	} catch (error) {
		log.error("mdzip to article failed ! ", error);
	}
}

run();
