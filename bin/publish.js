const fs = require("fs");
const inquirer = require("inquirer");
const { publish } = require("../script/publish");
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
				if (!fs.existsSync(val)) {
					return "article directory is not exist !";
				}
				return true;
			},
		},
	])
	.then(async (answer) => {
		let { articleTargetDir } = answer;
		await publish(articleTargetDir);
	});
