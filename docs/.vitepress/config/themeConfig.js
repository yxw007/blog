import nav from "./nav";
import sidebar from "./sidebar";

export default {
	siteTitle: "Potter's Blog",
	nav,
	sidebar,
	socialLinks: [{ icon: "github", link: "https://github.com/yxw007" }],
	outline: {
		level: "deep",
	},
	editLink: {
		pattern: "https://github.com/yxw007/blog/edit/master/docs/:path",
		text: "Edit this page on GitHub",
	},
	footer: {
		message: "Released under the MIT License.",
		copyright: "Copyright © 2019-present Potter",
	},
	articleMetadataConfig: {
		author: "Potter",
		authorLink: "/about",
		showViewCount: false,
	},
	commentConfig: {
		type: "gitalk",
		showComment: true,
	},
	algolia: {
		appId: "ZNQHVASLM4",
		apiKey: process.env.ALGOLIA_API_KEY,
		indexName: "yanxuewen",
	},
};
