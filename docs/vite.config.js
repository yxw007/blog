import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import collectDatePlugin from "./.vitepress/plugins/collect-data-plugin.mjs";

export default defineConfig({
	plugins: [
		//! 自动导入组件插件：避免手动import组件和components定义组件
		//相关文档：https://github.com/antfu/unplugin-vue-components
		Components({
			dirs: [".vitepress/theme/components"],
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
			resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })],
		}),
		collectDatePlugin(),
	],
	ssr: { noExternal: ['@arco-design/web-vue'] },
	resolve: {},
});
