const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");

const sourcePath = path.resolve(
	__dirname,
	"../studio/draft/这是一篇才是博文.md"
);
const content = fs.readFileSync(sourcePath, { encoding: "utf-8" });

const mdIt = new MarkdownIt();
const blocks = mdIt.parse(content);

const targetPath = path.resolve(__dirname, "../dist/MdBlocks.json");
fs.writeFileSync(targetPath, JSON.stringify(blocks, null, 2), {
	encoding: "utf8",
});
