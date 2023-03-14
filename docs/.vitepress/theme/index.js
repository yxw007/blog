import DefaultTheme from "vitepress/theme";

export default {
	...DefaultTheme,
	// Layout: MyLayout,
	enhanceApp(ctx) {
		DefaultTheme.enhanceApp(ctx);
	},
};
