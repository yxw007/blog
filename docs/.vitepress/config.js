import { defineConfig } from "vitepress";
import themeConfig from "./config/themeConfig";
import viteConfig from "../vite.config";

// https://vitepress.vuejs.org/reference/site-config
export default defineConfig({
	title: "Potter's Blog",
	description: "个人技术知识库",
	lastUpdated: true,
	themeConfig,
	ignoreDeadLinks: true,
	vite: viteConfig,
});
