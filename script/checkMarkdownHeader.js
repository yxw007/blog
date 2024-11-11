import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import { fileURLToPath } from "url";

const { sync } = fg;
const { resolve } = path;
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export async function checkAllMarkdownHeaders() {
	const filesWithoutHeaders = [];

	sync("docs/article/**/*.md", { onlyFiles: true, objectMode: true, cwd: resolve(__dirname, "../") }).forEach(({ path }) => {
		let absolutePath = resolve(__dirname, "../", path);
		if (!checkMarkdownHeader(absolutePath)) {
			filesWithoutHeaders.push(absolutePath);
		}
	});

	if (filesWithoutHeaders.length > 0) {
		console.log('Markdown Header: 检测不通过，存在以下文件没有定义 Markdown Header');
		filesWithoutHeaders.forEach((file) => console.log(file));
		return false;
	} else {
		console.log('Markdown Header: 检测通过，所有文件都定义了 Markdown Header。');
		return true;
	}
};

export function checkMarkdownHeader(absolutePath) {
	let content = fs.readFileSync(absolutePath, { encoding: "utf8" }).trim();
	let regex = /^---([\s\S]*)(title:.*)([\s\S])*(date:.*)[\s\S]*(---)/;
	return regex.test(content);
}
