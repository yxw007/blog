const { exec } = require("child_process");
const path = require("path");
const {
	fileNameWithOutExtension,
	log,
	getDraftDir,
	getArticleDir,
	renameFileName,
} = require("./utils");
const fs = require("fs-extra");
const { glob } = require("fast-glob");

const {
	ArticleProcessor,
	PublisherManager,
	NotionPublisherPlugin,
} = require("@pup007/artipub");

const { NOTION_API_KEY, NOTION_PAGE_ID } = process.env;
let {
	GITHUB_OWNER,
	GITHUB_REPO,
	GITHUB_DIR,
	GITHUB_BRANCH,
	GITHUB_TOKEN,
	GITHUB_COMMIT_AUTHOR,
	GITHUB_COMMIT_EMAIL,
} = process.env;

function copyArticleToTargetDir(
	articlePath,
	articleTargetDir,
	articleFileName
) {
	return new Promise((resolve) => {
		let articleTargetPath = path.join(
			articleTargetDir,
			`${articleFileName}.md`
		);
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

async function writeContentToArticle(articleTargetDir, filename, content) {
	let articleCDNPath = path.join(articleTargetDir, `${filename}_CDN.md`);
	let articlePath = path.join(articleTargetDir, `${filename}.md`);
	await fs.writeFile(articlePath, content, { encoding: "utf8" });

	//说明：将文章中的图片链接替换为cdn链接
	content = content.replace(
		/https:\/\/(raw.githubusercontent.com)\/(.*?)\/(.*?)\/(.*?)(.png|.jpg|jpeg|svg|jif)/gim,
		(match, ...groups) => {
			const [, p2, p3, p4, p5] = groups;
			return `https://cdn.jsdelivr.net/gh/${p2}/${p3}@${p4}${p5}`;
		}
	);
	await fs.writeFile(articleCDNPath, content, { encoding: "utf8" });

	return { articleCDNPath, articlePath };
}

/**
 * @param {string} articleTargetDir
 */
async function run(articleTargetDir) {
	const draftMdPath = await findDraft(getDraftDir());

	let processor = new ArticleProcessor({
		uploadImgOption: {
			owner: GITHUB_OWNER,
			repo: GITHUB_REPO,
			dir: GITHUB_DIR,
			branch: GITHUB_BRANCH,
			token: GITHUB_TOKEN,
			commit_author: GITHUB_COMMIT_AUTHOR,
			commit_email: GITHUB_COMMIT_EMAIL,
		},
	});

	processor.processMarkdown(draftMdPath).then(async ({ filePath, content }) => {
		let filename = fileNameWithOutExtension(renameFileName(draftMdPath));
		let { articlePath, articleCDNPath } = await writeContentToArticle(
			getArticleDir(),
			filename,
			content
		);

		let publisher = new PublisherManager();
		publisher.addPlugin(
			NotionPublisherPlugin({
				api_key: NOTION_API_KEY,
				page_id: NOTION_PAGE_ID,
			})
		);
		let res = await publisher.publish(articlePath, content);
		console.log("publish res:", res);

		await copyArticleToTargetDir(articleCDNPath, articleTargetDir, filename);

		await commitCode(filename);
	});
}

module.exports = {
	publish: run,
};
