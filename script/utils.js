const chalk = require("chalk");
const path = require("path");
const log = {
	info(...args) {
		console.error(chalk.green.bold("[INFO]:", ...args));
	},
	warn(...args) {
		console.error(chalk.yellow.bold("[WARN]:", ...args));
	},
	error(...args) {
		console.error(chalk.red.bold("[ERROR]:", ...args));
	},
};

function getType(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
}

function isObject(obj) {
	return getType(obj) === "Object";
}

function isString(obj) {
	return getType(obj) === "String";
}

function fileNameWithOutExtension(filePath) {
	let filename = path.basename(filePath);
	let extension = path.extname(filePath);
	return filename.slice(0, filename.indexOf(extension));
}

module.exports = {
	log,
	isObject,
	isString,
	fileNameWithOutExtension,
};