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
				link: "TypeScript 入门 - 01：创建一个在Chrome上运行的TypeScript Demo",
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
				link: "vue3.x-响应式核心原理",
				activeMatch: "01-vue",
			},
			{
				text: "VueRouter",
				link: "VueRouter-核心原理",
				activeMatch: "02-vueRouter",
			},
			{
				text: "Pinia",
				link: "Pinia-核心原理",
				activeMatch: "03-pinia",
			},
			{
				text: "React",
				link: "1.更新队列(构建+处理)",
				activeMatch: "20-react",
			},
			{
				text: "Rollup",
				link: "01-Rollup插件开发",
				activeMatch: "31-build-rollup",
			},
			{
				text: "Vite",
				link: "index",
				activeMatch: "32-build-vite",
			},
			{
				text: "Webpack",
				link: "WebPack 01：原理雏形思考",
				activeMatch: "32-build-webpack",
			},
		],
	},
	{
		text: "实践经验",
		activeMatch: "04-practic",
		items: [
			{
				text: "Vue",
				link: "解决vue项目打包后，开发环境页面正常显示，打包后页面却无法显示问题，排查全过程",
				activeMatch: "Vue",
			},
			{
				text: "Vue SSR",
				link: "01-vue-ssr-基本实现",
				activeMatch: "Vue-ssr",
			},
			{
				text: "Vite",
				link: "Dev环境用vite替换webpack获得极致开发体验",
				activeMatch: "Vite",
			},
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
			{
				text: "Electron",
				link: "Electron 入门实战 01：主进程与渲染进程通信",
				activeMatch: "Electron",
			},
			{
				text: "vscode",
				link: "实现一个将JSON转markdown table的vscode插件",
				activeMatch: "vscode",
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
			{
				text: "C#",
				link: "如何获取类中字段、属性、函数等的相关注释",
				activeMatch: "csharp",
			},
			{
				text: "web",
				link: "解决XMLHttpRequest 发送formData，后端java要么不到数据，要么拿到数据乱码",
				activeMatch: "web",
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
