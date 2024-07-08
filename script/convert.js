import fg from "fast-glob";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { sync } = fg;
const { resolve } = path;

sync("docs/article/**/*.md", { onlyFiles: true, objectMode: true }).forEach(({ path }) => {
	let absolutePath = resolve(__dirname, "../" + path);
	console.log(absolutePath);
	let content = fs.readFileSync(absolutePath, { encoding: "utf8" });

	content = content.replace(/^(#.*)[\s\S]*?---([\s\S]*?)([\.-]{3})$/gm, (m, ...args) => {
		let [g1, g2, g3] = args;
		let res = `---\n${g2.trim()}\n---\n\n${g1}\n`;

		return res;
	});

	fs.writeFileSync(absolutePath, content);
	console.log("process handle file complete");
});
