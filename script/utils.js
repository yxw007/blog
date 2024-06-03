const chalk = require("chalk");
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

module.exports = {
	log,
	isObject,
	isString,
};
