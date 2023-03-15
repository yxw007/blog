import fs from "node:fs";
import path from "node:path";
import parseFrontmatter from "gray-matter";
import { articleRelatePath } from "./config/paths";

const excludedFiles = ["index.md", "tags.md", "archives.md", "about.md"];

export default {
	watch: [`${articleRelatePath}/**/*.md`],
	load(watchedFiles) {
		// 排除不必要文件
		const articleFiles = watchedFiles.filter((file) => {
			const filename = path.basename(file);
			return !excludedFiles.includes(filename);
		});
		// 解析文章 Frontmatter
		return articleFiles.map((articleFile) => {
			const articleContent = fs.readFileSync(articleFile, "utf-8");
			const { data } = parseFrontmatter(articleContent);
			return {
				...data,
				path: articleFile
					.substring(articleFile.lastIndexOf(`/${articleRelatePath}`) + 6)
					.replace(/\.md$/, ""),
			};
		});
	},
};
