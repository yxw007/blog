import glob from "fast-glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function collectDatePlugin() {
	async function generateCollectDate() {
		return new Promise(async (resolve) => {
			const articleData = await Promise.all(
				glob
					.sync("docs/article/**/*.md", {
						onlyFiles: true,
						objectMode: true,
						ignore: [
							"./docs/**/index.md",
							"./docs/**/archives.md",
							"./docs/**/tags.md",
							"./docs/**/about.md",
						],
					})
					.map(async (article) => {
						const file = matter.read(`${article.path}`);
						const { data, path } = file;
						return {
							...data,
							path: path.replace(/\.md$/, "").replace("./docs/", ""),
						};
					})
			);

			const output = path.resolve(__dirname, "../dist/article-data.json");
			const outputDir = path.dirname(output);
			if (!existsSync(outputDir)) {
				await fs.mkdir(outputDir);
			}

			await fs.writeFile(
				path.resolve(__dirname, "../dist/article-data.json"),
				JSON.stringify(articleData),
				"utf-8"
			);
			resolve();
		});
	}

	return {
		name: "CollectDatePlugin",
		async buildStart(inputOption) {
			if (process.argv.includes("dev")) {
				await generateCollectDate();
			}
		},
		async generateBundle() {
			await generateCollectDate();
		},
	};
}

export default collectDatePlugin;
