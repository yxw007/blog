import DefaultTheme from "vitepress/theme";
import Layout from "./layout/Layout.vue";

export default {
	...DefaultTheme,
	Layout,
	enhanceApp(ctx) {
		DefaultTheme.enhanceApp(ctx);
	},
};
