import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import collectDatePlugin from "./.vitepress/plugins/collect-data-plugin.mjs";

export default defineConfig({
	plugins: [
		Components({
			dirs: [".vitepress/theme/components"],
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
			resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })],
		}),
		collectDatePlugin(),
	],
	ssr: { noExternal: ["@arco-design/web-vue"] },
	resolve: {},
});
