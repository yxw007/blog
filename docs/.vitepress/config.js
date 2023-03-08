import { defineConfig } from "vitepress";

// https://vitepress.vuejs.org/reference/site-config
export default defineConfig({
	title: "Potter's Blog",
	description: "A VitePress Site",
	srcDir: "../src",
	themeConfig: {
		// https://vitepress.vuejs.org/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Examples", link: "/markdown-examples" },
		],

		sidebar: [
			{
				text: "Examples",
				items: [
					{ text: "Markdown Examples", link: "/markdown-examples" },
					{ text: "Runtime API Examples", link: "/api-examples" },
				],
			},
		],

		socialLinks: [
			{ icon: "github", link: "https://github.com/vuejs/vitepress" },
		],
	},
});
