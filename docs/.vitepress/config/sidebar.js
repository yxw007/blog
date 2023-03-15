import { sync } from "fast-glob";
import * as matter from "gray-matter";
import { articleName, articleRelatePath } from "./paths";

let sidebar = generateSideBar();

function generateSideBar() {
	let res = {};
	sync(`${articleRelatePath}/*`, {
		onlyDirectories: true,
		objectMode: true,
	}).forEach(({ name }) => {
		res[`/${articleName}/${name}/`] = getItems(name);
	});
	return res;
}

/**
 * 根据 某小课/序号-分组/序号-xxx.md 的目录格式, 获取侧边栏分组及分组下标题
 * courses/mybatis/01-MyBatis基础/01-xxx.md
 * @param path 扫描基础路径
 * @returns {[]}
 */
function getItems(path) {
	// 侧边栏分组数组
	let groups = [];
	let total = 0;
	// 当分组内文章数量少于 2 篇或文章总数显示超过 20 篇时，自动折叠分组
	const groupCollapsedSize = 2;
	const titleCollapsedSize = 20;

	// 1.获取所有分组目录
	sync(`${articleRelatePath}/${path}/*`, {
		onlyDirectories: true,
		objectMode: true,
	}).forEach(({ name }) => {
		let items = [];
		let groupName = name;
		// 2.获取分组下的所有文章
		sync(`${articleRelatePath}/${path}/${groupName}/*`, {
			onlyFiles: true,
			objectMode: true,
		}).forEach((article) => {
			const articleFile = matter.read(`${article.path}`);
			const { data } = articleFile;
			// 向前追加标题
			items.push({
				text: data.title,
				link: `${articleName}/${path}/${groupName}/${article.name.replace(
					".md",
					""
				)}`,
			});
			total += 1;
		});

		// 3.向前追加到分组
		// 当分组内文章数量少于 A 篇或文章总数显示超过 B 篇时，自动折叠分组
		groups.push({
			text: `${groupName.substring(groupName.indexOf("-") + 1)} (${
				items.length
			}篇)`,
			items: items,
			collapsed:
				items.length < groupCollapsedSize || total > titleCollapsedSize,
		});
	});

	return groups;
}

/**
 * 添加序号
 * @param groups 分组数据
 */
function addOrderNumber(groups) {
	for (let i = 0; i < groups.length; i++) {
		for (let j = 0; j < groups[i].items.length; j++) {
			const items = groups[i].items;
			items[j].text = `[${j + 1}] ${items[j].text}`;
		}
	}
}

export default sidebar;
