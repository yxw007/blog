const { exec } = require("child_process");
const path = require("path");
const { uploadMdToNotion } = require("./uploadMdToNotion");
const { fileNameWithOutExtension, log } = require("./utils");
const { toArticle } = require("./draftToArticle");
const fs = require("fs-extra");

function copyArticleToTargetDir(articlePath, articleTargetDir) {
	return new Promise((resolve) => {
		let filename = path.basename(articlePath);
		let articleTargetPath = path.join(articleTargetDir, filename);
		fs.ensureDir(articleTargetDir);
		let inStream = fs.createReadStream(articlePath, { encoding: "utf8" });
		let outStream = fs.createWriteStream(articleTargetPath, {
			encoding: "utf8",
		});
		inStream.pipe(outStream);
		outStream.on("finish", () => {
			resolve();
		});
	});
}

function commitCode(message) {
	const command = `git add . && git config --global core.autocrlf true && git commit -m "add: ${message}"`;
	exec(command, (error, stdout, stderr) => {
		if (error) {
			log.error("publish failed :", error.message);
			return;
		}
		if (stderr) {
			log.error("publish failed :", stderr);
			return;
		}

		exec("git pull && git push", (error) => {
			if (error) {
				log.error("publish git push failed :", error.message);
				return;
			}
			log.info("publish success !");
		});
	});
}

/**
 * @param {string} articleTargetDir
 */
async function run(articleTargetDir) {
	let { articleCDNPath, articlePath } = await toArticle();
	let filename = fileNameWithOutExtension(articlePath);
	await copyArticleToTargetDir(articlePath, articleTargetDir, filename);
	await uploadMdToNotion(articleCDNPath);
	await commitCode(filename);
}

module.exports = {
	publish: run,
};
