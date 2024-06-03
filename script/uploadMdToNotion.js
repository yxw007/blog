const fs = require("fs");
const path = require("path");
const { markdownToBlocks } = require("@tryfabric/martian");
const inquirer = require("inquirer");
const { log } = require("./utils");
const { NOTION_API_KEY, NOTION_PAGE_ID } = process.env;

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: NOTION_API_KEY });

inquirer
	.prompt([
		{
			name: "articlePath",
			type: "input",
			message: "please input article path",
			validate(val) {
				if (!val) {
					return "article path is invalid !";
				}
				let articlePath = path.normalize(val);
				if (!fs.existsSync(articlePath)) {
					return "article path not exist !";
				}
				return true;
			},
		},
	])
	.then(async (answer) => {
		let { articlePath } = answer;
		log.info(articlePath);
		await run(articlePath);
	});

/**
 * parseArticle
 * @param {*} articlePath
 * @returns
 */
function parseArticle(articlePath) {
	const articleName = path.basename(articlePath);
	const content = fs.readFileSync(articlePath, {
		encoding: "utf-8",
	});

	let notionBlocks = markdownToBlocks(content);
	let findStartIdx = 0;
	while (findStartIdx < notionBlocks.length) {
		let block = notionBlocks[findStartIdx];
		if (block.type === "heading_1") {
			break;
		}
		findStartIdx++;
	}
	notionBlocks = notionBlocks.slice(findStartIdx + 1);
	return { articleName, notionBlocks };
}

/**
 * upload
 * @param {string} articlePath
 */
async function upload(articlePath) {
	const { articleName, notionBlocks } = parseArticle(articlePath);
	await notion.pages.create({
		parent: {
			type: "page_id",
			page_id: NOTION_PAGE_ID,
		},
		properties: {
			title: [
				{
					text: {
						content: articleName,
					},
				},
			],
		},
		children: notionBlocks,
	});
}

/**
 * run
 * @param {string} articlePath
 */
async function run(articlePath) {
	try {
		await upload(articlePath);
		log.info("Upload to notion success !");
	} catch (error) {
		log.error("Upload fail," + error.message);
	}
}
