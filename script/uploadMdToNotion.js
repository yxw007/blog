import fs from "fs";
import path from "path";
import { markdownToBlocks } from "@tryfabric/martian";

import { log } from "./utils.js";
const { NOTION_API_KEY, NOTION_PAGE_ID } = process.env;

import { Client } from "@notionhq/client";
const notion = new Client({ auth: NOTION_API_KEY });

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

module.exports = { uploadMdToNotion: run };
