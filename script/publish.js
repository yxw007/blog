import { exec } from "child_process";
import path from "path";
import { fileNameWithOutExtension, log, getDraftDir, getArticleDir, renameFileName } from "./utils.js";
import fs from "fs-extra";
import fg from "fast-glob";
import { ArticleProcessor, PublisherManager, NotionPublisherPlugin } from "@pup007/artipub";

const { glob } = fg;

const { NOTION_API_KEY, NOTION_PAGE_ID } = process.env;
let { GITHUB_OWNER, GITHUB_REPO, GITHUB_DIR, GITHUB_BRANCH, GITHUB_TOKEN, GITHUB_COMMIT_AUTHOR, GITHUB_COMMIT_EMAIL } = process.env;

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

function BlogPublisherPlugin({ targetDir }) {
	return async function (articleTitle, visit, toMarkdown) {
		let regex = /https:\/\/(raw.githubusercontent.com)\/(.*?)\/(.*?)\/(.*?)(.png|.jpg|jpeg|svg|jif)/im;
		visit("image", (node) => {
			if (node.url && regex.test(node.url)) {
				regex.lastIndex = 0;
				let match = regex.exec(node.url);
				let [, , p3, p4, p5, p6] = match;
				let cdnUrl = `https://cdn.jsdelivr.net/gh/${p3}/${p4}@${p5}${p6}`;
				node.url = cdnUrl;
			}
		});
		let { content } = toMarkdown();
		let targetPath = path.join(targetDir, `${articleTitle}.md`);
		await fs.writeFile(targetPath, content, { encoding: "utf8" });
		return {
			success: true,
			info: `Published [${articleTitle}] to Blog successfully!`,
		};
	};
}

function NativePlatformPublisherPlugin({ targetDir }) {
	return async function (articleTitle, visit, toMarkdown) {
		visit("heading", (_node, _index, parent) => {
			let node = _node;
			if (parent && node.depth === 1) {
				parent.children.splice(0, (_index ?? 0) + 1);
				return true;
			}
		});
		let { content } = toMarkdown();
		let targetPath = path.join(targetDir, `${articleTitle}.md`);
		await fs.writeFile(targetPath, content, { encoding: "utf8" });
		return {
			success: true,
			info: `Published [${articleTitle}] to NativePlatform successfully!`,
		};
	};
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

	processor.processMarkdown(draftMdPath).then(async ({ content }) => {
		let filename = fileNameWithOutExtension(renameFileName(draftMdPath));

		let publisher = new PublisherManager(content);
		publisher.addPlugin(
			NotionPublisherPlugin({
				api_key: NOTION_API_KEY,
				page_id: NOTION_PAGE_ID,
			})
		);
		publisher.addPlugin(
			BlogPublisherPlugin({
				targetDir: articleTargetDir,
			})
		);
		publisher.addPlugin(
			NativePlatformPublisherPlugin({
				targetDir: getArticleDir(),
			})
		);

		let res = await publisher.publish();
		console.log("publish res:", res);
		await commitCode(filename);
	});
}

export { run as publish };
