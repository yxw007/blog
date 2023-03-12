import nav from "./nav";
import sidebar from "./sidebar";

export default {
	nav,
	sidebar,
	socialLinks: [{ icon: "github", link: "https://github.com/yxw007/blog" }],
	outline: {
		level: "deep",
		// label: "目录",
	},
	editLink: {
		pattern: "https://github.com/yxw007/blog/edit/master/docs/:path",
		text: "Edit this page on GitHub",
	},
	footer: {
		message: "Released under the MIT License.",
		copyright: "Copyright © 2019-present Potter",
	},
};
