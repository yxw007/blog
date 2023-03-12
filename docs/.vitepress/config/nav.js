export default [
	{ text: "首页", link: "/" },
	{
		text: "计算机基础",
		items: [
			{
				text: "计算机网络",
				link: "/01-basic/index",
				activeMatch: "/01-basic/network/",
			},
		],
		activeMatch: "/01-basic/",
	},
	{
		text: "前端",
		items: [
			{ text: "基础", link: "" },
			{ text: "框架原理" },
			{ text: "性能优化" },
		],
		activeMatch: "/02-frontend/",
	},
	{ text: "关于", link: "/about" },
];
