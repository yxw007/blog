import fs from "fs";
import inquirer from "inquirer";
import { publish } from "../script/publish.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function normalizePath(path) {
	return path.replace(/\\/g, "/");
}

inquirer
	.prompt([
		{
			name: "articleTargetDir",
			type: "input",
			message: "please input article target directory",
			validate(val) {
				if (!val) {
					return "article directory is invalid !";
				}
				val = normalizePath(val);
				if (!fs.existsSync(path.resolve(path.join(__dirname, `../${val}`)))) {
					return "article directory is not exist !";
				}
				return true;
			},
		},
	])
	.then(async (answer) => {
		let { articleTargetDir } = answer;
		await publish(normalizePath(path.resolve(__dirname, `../${articleTargetDir}`)));
	});
