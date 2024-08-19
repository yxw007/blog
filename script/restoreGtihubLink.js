import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const args = process.argv.slice(2);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articleDir = path.resolve(__dirname, "../studio/article");

function run() {
	if (args.length === 0) {
		console.error("Please provide the res file path");
		return;
	}

	const filePath = path.resolve(__dirname, args[0]);
	if (!fs.existsSync(filePath)) {
		console.error(`File not found: ${filePath}`);
		return;
	}

	const fileName = path.basename(filePath);
	let content = fs.readFileSync(filePath, "utf-8");

	const reg = /https:\/\/cdn.jsdelivr.net\/gh\/yxw007\/BlogPicBed@master\/img\/(.*)(?=\))/gm
	const prefix = "https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/"
	content = content.replace(reg, (p1, p2) => {
		const newLink = `${prefix}${p2}`;
		return newLink;
	})

	const targetPath = `${articleDir}/${fileName}`;
	fs.writeFileSync(targetPath, content, { encoding: "utf-8" });
}

run();
