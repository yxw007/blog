const { exec } = require("child_process");
const path = require("path");
const { fileNameWithOutExtension, log } = require("./utils");
const fs = require("fs-extra");
const {
	ArticleProcessor,
	PublisherManager,
	NotionPublisherPlugin,
} = require("@pup007/artipub");

function copyArticleToTargetDir(
	articlePath,
	articleTargetDir,
	articleFileName
) {
	return new Promise((resolve) => {
		let articleTargetPath = path.join(articleTargetDir, articleFileName);
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

/**
 * @param {string} articleTargetDir
 */
async function run(articleTargetDir) {
	const draftMdPath = await findDraft(draftDir);

	let processor = new ArticleProcessor();

	let filename = fileNameWithOutExtension(draftMdPath);
	await copyArticleToTargetDir(articleCDNPath, articleTargetDir, filename);

	await commitCode(filename);
}

module.exports = {
	publish: run,
};
