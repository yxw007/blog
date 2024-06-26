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

function getDraftDir() {
	return normalizePath(path.resolve(__dirname, "../studio/draft"));
}

function getArticleDir() {
	return normalizePath(path.resolve(__dirname, "../studio/article"));
}

/**
 * rename file name
 *
 * xxxxx 976406fcf7a24778b31ce00c5d1cd6c8.md => xxxxx.md
 *
 * xxxxx 976406fcf7a24778b31ce00c5d1cd6c8_CDN.md => xxxxx_CDN.md
 *
 * @param {string} filePath
 */
function renameFileName(filePath) {
	let fileName = path.basename(filePath);
	let newName = fileName;
	let m = /(\s\w{32})(_CDN)?(.md)/g.exec(fileName);
	if (m != null && m.length > 1) {
		newName = newName.replace(m[1], "");
	}
	return filePath.replace(fileName, newName);
}

/**
 * @param {string} path
 */
function normalizePath(path) {
	return path.replace(/\\/g, "/");
}

module.exports = {
	log,
	isObject,
	isString,
	fileNameWithOutExtension,
	normalizePath,
	getDraftDir,
	getArticleDir,
	renameFileName,
};
