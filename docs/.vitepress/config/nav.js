import { articleName } from "./paths";
const ignores = ["about", "archives", "tags", "/"];
const navs = [
	{ text: "首页", link: "/" },
	{
		text: "计算机基础",
		activeMatch: "01-basic",
		items: [
			{
				text: "计算机网络",
				link: "01-各种概念",
				activeMatch: "01-network",
			},
		],
	},
	{
		text: "前端基础",
		activeMatch: "02-frontend-basic",
		items: [
			{
				text: "Javascript",
				link: "JS_Base_01",
				activeMatch: "01-js",
			},
			{
				text: "Typescript",
				link: "TypeScript01",
				activeMatch: "02-ts",
			},
		],
	},
	{
		text: "框架原理",
		activeMatch: "03-framework",
		items: [
			{
				text: "Vue",
				link: "index",
				activeMatch: "01-vue",
			},
			{
				text: "React",
				link: "index",
				activeMatch: "02-react",
			},
			{
				text: "Rollup",
				link: "index",
				activeMatch: "20-build-rollup",
			},
			{
				text: "Vite",
				link: "index",
				activeMatch: "20-build-vite",
			},
			{
				text: "Webpack",
				link: "WebPack 01：原理雏形思考",
				activeMatch: "20-build-webpack",
			},
		],
	},
	{
		text: "实践经验",
		activeMatch: "04-practic",
		items: [
			{
				text: "Library",
				link: "Web04.md",
				activeMatch: "Library",
			},
			{
				text: "Uniapp",
				link: "UniApp01",
				activeMatch: "Uniapp",
			},
		],
	},
	{
		text: "性能优化",
		activeMatch: "05-optimize",
		items: [
			{
				text: "Optimization",
				link: "Web03",
				activeMatch: "Optimization",
			},
		],
	},
	{
		text: "其他",
		activeMatch: "06-misc",
		items: [
			{
				text: "Tools Share",
				link: "Normal01",
				activeMatch: "Tools Share",
			},
			{
				text: "tragedy",
				link: "初始化不统一控制好，引发的血案",
				activeMatch: "tragedy",
			},
		],
	},
	/* {
		text: "标签",
		link: "tags",
		activeMatch: "tags",
	}, */
	{
		text: "归档",
		link: "archives",
	},
	{ text: "关于", link: "about" },
];

/**
 * 每个节点自动插入前缀
 * @param {*} navs
 * @param {*} start 开始节点
 * @param {*} parent 父级路径
 */
function autoInsertPre(navs, start, parent) {
	for (let i = start; i < navs.length; i++) {
		let nav = navs[i];
		if (ignores.includes(nav.link)) {
			nav.link = `/${nav.link}`;
			nav.activeMatch = `${nav.link}/`;
			continue;
		}
		if (nav.activeMatch) {
			nav.activeMatch = `${parent}${nav.activeMatch}/`;
		}
		if (nav.link) {
			nav.link = `${nav.activeMatch}${nav.link}`;
		}
		if (nav.items) {
			autoInsertPre(nav.items, 0, nav.activeMatch);
		}
	}
}

autoInsertPre(navs, 1, `/${articleName}/`);

export default navs;
