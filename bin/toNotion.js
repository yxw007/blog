import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import { uploadMdToNotion } from "../script/uploadMdToNotion.js";
import { log } from "../script/utils.js";

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
		await uploadMdToNotion(articlePath);
	});
