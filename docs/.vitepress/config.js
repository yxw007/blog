import { defineConfig } from "vitepress";
import themeConfig from "./config/themeConfig";

// https://vitepress.vuejs.org/reference/site-config
export default defineConfig({
	title: "Potter's Blog",
	description: "个人技术知识库",
	srcDir: "../src",
	lastUpdated: true,
	themeConfig,
});
