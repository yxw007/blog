import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import { fileURLToPath } from "url";

const { sync } = fg;
const { resolve } = path;
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const checkMarkdownHeaders = async () => {
	const filesWithoutHeaders = [];

	sync("docs/article/**/*.md", { onlyFiles: true, objectMode: true, cwd: resolve(__dirname, "../") }).forEach(({ path }) => {
		let absolutePath = resolve(__dirname, "../", path);
		let content = fs.readFileSync(absolutePath, { encoding: "utf8" });

		const hasHeader = content.startsWith('---') && content.includes('---', 3) && content.includes('date:');
		if (!hasHeader) {
			filesWithoutHeaders.push(absolutePath);
		}
	});

	if (filesWithoutHeaders.length > 0) {
		console.log('以下文件没有定义 Markdown Header:');
		filesWithoutHeaders.forEach((file) => console.log(file));
	} else {
		console.log('所有文件都定义了 Markdown Header。');
	}
};

checkMarkdownHeaders();
