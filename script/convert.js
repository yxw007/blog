import fg from "fast-glob";
import path from "path";
import fs from "fs";

const { sync } = fg;
const { resolve } = path;

sync("docs/article/**/*.md", { onlyFiles: true, objectMode: true }).forEach(
	({ path }) => {
		let absolutePath = resolve(__dirname, path);
		console.log(absolutePath);
		let content = fs.readFileSync(absolutePath, { encoding: "utf8" });

		content = content.replace(
			/> 以上：如发现有问题，欢迎留言指出，我及时更正(\n>)*/g,
			""
		);
		fs.writeFileSync(absolutePath, content);
		console.log("process handle file complete");
	}
);
