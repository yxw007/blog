---
title: vue-ssr 4.优化打包和支持preload
author: Potter
date: 2022-11-05 11:20
tags: 
- vue-ssr
- ssr
categories: 
- vue-ssr

---

# vue-ssr 4.优化打包和支持preload

---

> 由于服务端渲染，写死了加载文件，所以改成动态形式
> 

# 服务端渲染，自动关联到打包后的文件

通过VueSSRServerPlugin、VueSSRClientPlugin 打包，让服务端动态关联到打包配置

- webpack.server.js
    
    ```jsx
    const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
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
    		new VueSSRServerPlugin(),
    		new HtmlWebpackPlugin({
    			filename: "index.ssr.html",
    			template: resolve("../public/index.ssr.html"),
    			excludeChunks: ['server'],
    			minify: false,
    			client: '/client.bundle.js'
    		}),
    	]
    })
    ```
    
- webpack.client.js
    
    ```jsx
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
    
    const { merge } = require("webpack-merge");
    const { resolve, ...base } = require("./webpack.base");
    
    console.log(process.env.mode);
    
    module.exports = merge(base, {
    	mode: "development",
    	entry: {
    		client: resolve("../src/client-entry.js")
    	},
    	output: {
    		// clean: true,
    	},
    	plugins: [
    		new VueSSRClientPlugin(),
    		new HtmlWebpackPlugin({
    			filename: process.env.mode === 'development' ? "index.html" : "index.client.html",
    			template: resolve("../public/index.client.html")
    		}),
    	]
    })
    ```
    
- webpack.base.js：将输出统一至base文件中
    
    ```jsx
    const path = require("path");
    const { VueLoaderPlugin } = require("vue-loader");
    
    const resolve = (p) => path.resolve(__dirname, p);
    
    let config = exports = module.exports;
    const ASSET_PATH = process.env.ASSET_PATH || '/';
    
    config = {
    	mode: "development",
    	entry: resolve("../src/client.js"),
    	output: {
    		filename: '[name].bundle.js',
    		path: resolve('../dist'),
    		//! 注意：需要添加publicPath, 否则会导致服务端渲染出来的html中preload预加载的client.bundle.js 会添加auto前缀，导致加载路径错误导致报错
    		publicPath: ASSET_PATH
    	},
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
    
- server.js : 根据打包后的配置文件来关联打包文件
    
    ```jsx
    const Koa = require("koa");
    const Router = require("koa-router");
    const static = require("koa-static");
    const VueServerRender = require("vue-server-renderer");
    const fs = require("fs");
    const path = require("path");
    const resolve = (p) => path.resolve(__dirname, p);
    
    const serverTemplete = fs.readFileSync(resolve("dist/index.ssr.html"), "utf8");
    //! 通过vue-ssr-server-bundle.json 关联服务端打包文件server.bundle.js，避免写死读取的配置文件
    const serverBundle = require(resolve("dist/vue-ssr-server-bundle.json"));
    //! 通过vue-ssr-client-manifest.json 关联client打包文件client.bundle.js，避免写死读取的配置文件
    const clientManifest = require(resolve("dist/vue-ssr-client-manifest.json"));
    
    const render = VueServerRender.createBundleRenderer(serverBundle, { template: serverTemplete, clientManifest });
    
    const app = new Koa();
    const router = new Router();
    
    //! 说明：匹配非首页路径，否则会显示404页面
    router.get("/(.*)", async (ctx) => {
    	ctx.body = await new Promise((resolve) => {
    		render.renderToString({ url: ctx.url }, (err, html) => {
    			if (err && err.code == 404) resolve(`not found 404`);
    			resolve(html)
    		})
    	})
    })
    
    //! 特别注意：要先匹配static中间件，否则会导致全部进制get中然后渲染成html导致，请求client.bundle.js文件都是返回html内容
    app.use(static(resolve("dist")));
    app.use(router.routes());
    
    app.listen(4000, () => {
    	console.log("server start success port:", 4000);
    });
    ```
    

# 总结

- 通过VueSSRServerPlugin、VueSSRClientPlugin 打包出来的json文件，然后让服务端通过打包后的固定json文件来关联client.bundle.js 和server.bundle.js，避免写死读取的配置文件
- 需要添加publicPath, 否则会导致服务端渲染出来的html中preload预加载的client.bundle.js 会添加auto前缀，导致加载路径错误导致报错

> 以上：如发现有问题，欢迎留言指出，我及时更正
>
