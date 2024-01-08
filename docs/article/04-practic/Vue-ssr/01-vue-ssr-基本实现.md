---
title: vue-ssr 1.基本实现
author: Potter
date: 2022-11-02 11:26
tags: 
- vue-ssr
- ssr
categories: 
- vue-ssr

---

# vue-ssr 1.基本实现

## 流程图

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/202303191811167.png)

## 安装环境

```bash
# 开发打包：webpack 相关
yarn add webpack webpack-cli  webpack-dev-server -D
# 开发打包：js 、 vue 相关
yarn add @babel/core @babel/preset-env  babel-loader  vue-loader vue-template-compiler -D
# 开发打包：样式相关
yarn add css-loader vue-style-loader -D
# 开发打包：
yarn add html-webpack-plugin -D
# 运行环境库：
yarn add vue vue-server-renderer -D
```

## 搭建client打包和运行环境

- App.vue
    
    ```bash
    <template>
    	<div>
    		<button @click="++counter">click me</button>
    		<div>counter: {{ counter }}</div>
    	</div>
    </template>
    
    <script>
    export default {
    	name: "App",
    	data() {
    		return { counter: 1 };
    	},
    };
    </script>
    
    <style lang="scss" scoped></style>
    ```
    

> 由于要进行同构渲染，也就是客户端和服务端一起打包的项目，打包后自动生成客户端与服务端相关文件，所以需要把client和server打包入口进行分开，app.js 作为统一入口
> 
- app.js
    
    ```bash
    import Vue from "vue";
    import App from "./App.vue"
    
    export default function () {
    	//! 说明：由于每个请求都需要创建一个全新的vue,不然的话会导致多个浏览器访问相同的地址，vue的实例会导致内部数据冲突，所以此处导出一个工厂函数
    	const app = new Vue({
    		render(h) {
    			return h(App);
    		}
    	});
    
    	return { app };
    }
    ```
    
- client-entry.js
    
    ```jsx
    import createApp from "./app";
    
    const { app } = createApp();
    //! 说明：利用app.$mount("#app")激活客户端的事件响应，如果是直接使用new Vue({el:"#app",...}) 会导致客户端事件全部都是，原因：服务端是无事件的，渲染出来的只是html字符串
    app.$mount("#app"); 
    ```
    
- package.json：配置打包命令
    
    ```jsx
    ...
    "scripts": {
    		"client:dev": "webpack serve --config ./script/webpack.client.js",
    		"client:build": "webpack --config ./script/webpack.client.js",
    		"server:build": "webpack --config ./script/webpack.server.js",
    		"server:dev": "node ./server.js"
    },
    ...
    ```
    
- webpack.base.js：让前后端打包的公共配置防止base配置文件中
    
    ```jsx
    const path = require("path");
    const { VueLoaderPlugin } = require("vue-loader");
    
    const resolve = (p) => path.resolve(__dirname, p);
    
    let config = exports = module.exports;
    
    config = {
    	mode: "development",
    	entry: resolve("../src/client.js"),
    	resolve: {
    		extensions: [".js", ".json", ".vue"]
    	},
    	module: {
    		rules: [
    			{
    				test: /\.vue$/,
    				use: { loader: 'vue-loader' }
    			},
    			{
    				test: /\*.js/,
    				use: {
    					loader: 'babel-loader',
    					options: {
    						presets: ["@bable/preset-env"]
    					}
    				}
    			},
    			{
    				test: /\.css/,
    				use: [
    					"vue-style-loader",
    					{
    						loader: "css-loader",
    						options: {
    							esModule: false
    						}
    					}
    				]
    			}
    		]
    	},
    	plugins: [
    		new VueLoaderPlugin(),
    	]
    }
    
    config.resolve = resolve;
    module.exports = config;
    ```
    
- index.html
    
    ```jsx
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="app"></div>
    </body>
    </html>
    ```
    
- webpack.client.js
    
    ```jsx
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const { merge } = require("webpack-merge");
    const { resolve, ...base } = require("./webpack.base");
    
    module.exports = merge(base, {
    	mode: "development",
    	entry: resolve("../src/client-entry.js"),
    	output: {
    		filename: "client.bundle.js",
    		path: resolve("../dist")
    	},
    	plugins: [
    		new HtmlWebpackPlugin({
    			filename: "index.html",
    			template: resolve("../public/index.html")
    		}),
    	]
    })
    ```
    
- 运行测试：yarn client:dev
    
	![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/202303191812395.png)
    

> 至此client 环境已搭好

## 搭建Server打包和运行环境

- server-entry.js
    
    ```bash
    import createApp from "./app";
    
    export default function (context) {
    	return new Promise((resolve, reject) => {
    		const { app } = createApp();
    		resolve(app);
    	});
    }
    ```
    
- index.ssr.html
    
    ```bash
    <!DOCTYPE html>
    <html lang="en">
    	<head>
    		<meta charset="UTF-8" />
    		<title>SSR</title>
    		<style></style>
    	</head>
    
    	<body>
    		<!--vue-ssr-outlet-->
    		<!-- ejs 模板: 避免修改client的打包文件，改成利用HtmlWebpackPlugin的ejs模板参数来配置，对应client的路径配置 -->
    		<script src="<%=htmlWebpackPlugin.options.client%>"></script>
    	</body>
    </html>
    ```
    
- webpack.server.js
    
    ```jsx
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const { merge } = require("webpack-merge");
    const { resolve, ...base } = require("./webpack.base");
    
    module.exports = merge(base, {
    	mode: "development",
    	target: "node",
    	entry: {
    		server: resolve("../src/server-entry.js")
    	},
    	output: {
    		libraryTarget: "commonjs2"
    	},
    	plugins: [
    		new HtmlWebpackPlugin({
    			filename: "index.html",
    			template: resolve("../public/index.ssr.html"),
    			excludeChunks: ['server'],
    			minify: false,
    			client: '/client.bundle.js'
    		}),
    	]
    })
    ```
    

至此打包环境已弄好

- 安装sever开发环境
    
    ```bash
    yarn add koa koa-router koa-static vue-server-renderer -D
    ```
    
- server.js
    
    ```bash
    const Koa = require("koa");
    const Router = require("koa-router");
    const static = require("koa-static");
    const VueServerRender = require("vue-server-renderer");
    const fs = require("fs");
    const path = require("path");
    const resolve = (p) => path.resolve(__dirname, p);
    
    const serverBundle = fs.readFileSync(resolve("dist/server.js"), "utf8");
    const serverTemplete = fs.readFileSync(resolve("dist/index.html"), "utf8");
    
    const render = VueServerRender.createBundleRenderer(serverBundle, { template: serverTemplete });
    
    const app = new Koa();
    const router = new Router();
    
    router.get("/", async (ctx) => {
    	ctx.body = await new Promise((resolve, reject) => {
    		render.renderToString({ url: ctx.url }, (err, html) => {
    			if (err) {
    				reject(err);
    			} else {
    				resolve(html);
    			}
    		});
    	});
    });
    
    app.use(router.routes());
    app.use(static(resolve("../dist")));
    
    app.listen(4000, () => {
    	console.log("server start success port:", 4000);
    });
    ```
    
- 打包后运行server，访问localhost:4000，可以渲染出如上客户端的效果，同时点击也是有反应的

## 总结

- 每个请求都需要创建一个全新的vue，否则会导致多浏览器访问相同接口地址使用相同的vue实例，vue实例数据共享会导致数据错乱
- 利用app.$mount("#app")，激活客户端，否则会导致服务端渲染出来的页面无法进行交互（原因：服务端渲染出来仅仅是html字符串，是不关联事件的，所以需要利用客户端代码app.$mount(”#app”)进行激活）

**示例代码：[传送门](https://github.com/yxw007/vue-ssr/tree/master/vue2-webpack-ssr)**

## 参考文献

- [https://cn.vuejs.org/guide/scaling-up/ssr.html](https://cn.vuejs.org/guide/scaling-up/ssr.html#what-is-ssr)

> 以上：如发现有问题，欢迎留言指出，我及时更正
>
