export default [
	{ text: "首页", link: "/" },
	{
		text: "计算机基础",
		activeMatch: "/01-basic/",
		items: [
			{
				text: "计算机网络",
				link: "/01-basic/01-network/01-各种概念",
				activeMatch: "/01-basic/network/",
			},
		],
	},
	{
		text: "前端基础",
		activeMatch: "/02-frontend-basic/",
		items: [
			{
				text: "Javascript",
				link: "/02-frontend-basic/01-js/JS_Base_01",
				activeMatch: "/02-frontend-basic/01-js/",
			},
			{
				text: "Typescript",
				link: "/02-frontend-basic/02-ts/TypeScript01",
				activeMatch: "/02-frontend/01-basic/02-ts/",
			},
		],
	},
	{
		text: "框架原理",
		activeMatch: "/03-framework/",
		items: [
			{
				text: "Vue",
				link: "/03-framework/01-vue/index",
				activeMatch: "/03-framework/01-vue/",
			},
			{
				text: "React",
				link: "/03-framework/02-react/index",
				activeMatch: "/03-framework/02-react/",
			},
			{
				text: "Rollup",
				link: "/03-framework/20-build-rollup/index",
				activeMatch: "/03-framework/20-build-rollup/",
			},
			{
				text: "Vite",
				link: "/03-framework/20-build-vite/index",
				activeMatch: "/03-framework/20-build-vite/",
			},
			{
				text: "Webpack",
				link: "/03-framework/20-build-webpack/WebPack 01：原理雏形思考",
				activeMatch: "/03-framework/20-build-webpack/",
			},
		],
	},
	{
		text: "实践经验",
		activeMatch: "/04-practic/",
		items: [
			{
				text: "Library",
				link: "/04-practic/Library/Web04.md",
				activeMatch: "/04-practic/Library/",
			},
			{
				text: "Uniapp",
				link: "/04-practic/Uniapp/UniApp01",
				activeMatch: "/04-practic/Uniapp/",
			},
		],
	},
	{
		text: "性能优化",
		activeMatch: "/05-optimize/",
		items: [
			{
				text: "Optimization",
				link: "/05-optimize/Optimization/Web03",
				activeMatch: "/05-optimize/Optimization/",
			},
		],
	},
	{
		text: "其他",
		activeMatch: "/06-misc/",
		items: [
			{
				text: "Tools Share",
				link: "/06-misc/Tools Share/Normal01",
				activeMatch: "/06-misc/Tools Share/",
			},
			{
				text: "tragedy",
				link: "/06-misc/tragedy/初始化不统一控制好，引发的血案",
				activeMatch: "/06-misc/tragedy/",
			},
		],
	},
	{ text: "关于", link: "/about" },
];
