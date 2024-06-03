const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const { uploadMdToNotion } = require("../script/uploadMdToNotion");
const { log } = require("../script/utils");

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
