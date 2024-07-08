---
title: 解决vue项目打包后，开发环境页面正常显示，打包后页面却无法显示问题，排查全过程
author: Potter
date: 2023-10-15 16:18:28

tags:

- xx

categories:

- xx
---

# 解决vue项目打包后，开发环境页面正常显示，打包后页面却无法显示问题（排查全过程）




## 排查第1阶段

问题细节：

- html 仅显示了app跟节点，app下面仅包含<←- —> 空节点

怀疑原因：路由未匹配到界面组件

各种配置：

- nginx 配置
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240108161452.png)
    
    访问路径：https://xx.xx.com/pay/index
    
- webpack 配置
    
    ```jsx
    ...
    output: {
    		path: "/",
    		filename: utils.assetsPath("js/[name].[chunkhash].js"),
    		chunkFilename: utils.assetsPath("js/[id].[chunkhash].js"),
    		publicPath: config.build.assetsPublicPath,
    },
    ...
    ```
    
    说明：此时的配置是错误的，path应该配成/pay/ 与 nginx location /pay/ 是对应的。（**注意：此处path也容易配成/path忘掉/也是不对的**）
    

## 排查第2阶段

配置好后发现路由还是未匹配到组件，以下来看下routes

```jsx
export default [
	{
		path: "/",
		name: "index",
		alias: ["/index"],
		nav_name: "首页",
		component: () => import("@/view/main"),
	},
];
```

无论我如何修改main界面内容都是无法显示，实在找不到原因，最后尝试将其改成官网的demo代码

```jsx
const Foo = { template: "<div>foo</div>" };

export default [
	{
		path: "/",
		name: "index",
		alias: ["/index"],
		nav_name: "首页",
		component: Foo,
	},
];
```

结果尽量显示出来了，经过不停的捣腾发现vue2.7中() => import("@/view/main") 是无法异步加载组件，需要用defineAsyncComponent套一层，翻了一遍changelog 也未看到说明，算是踩坑了。

## 排查第3阶段

改成defineAsyncComponent 异步加载组件后，界面仍然不显示。此时真想骂人，但是没办法问题必须解决，应该是main组件的问题，所以改成把main的组件代码全部删掉，就搞一个div 123 到template里面，结果显示出来了。那么就是main中的代码问题，所以逐步注释排查到最后，发现是?? 语法问题，将其改成|| 即可。

## 总结

- publicPath 与 nginx 中配置的path 路径要匹配（注意不能丢到末尾的/，否则会导致加载资源路径会少一个/）
- 快速验证诊断问题是否正确：怀疑某个东西有问题，又实在找不到原因，那么就直接将其改到最简化，验证怀疑的方向对不对。
    - 诊断正确：继续怀疑诊断，想不到就用最笨的方法，逐段注释排查，直到排查出最终原因。
- 经验总结：
    - 一模一样的代码，一种环境运行正常，另外一种环境运行不正常，首先应该怀疑的就是代码是否存在兼容性问题。
    - 项目接入支付尽量采用低版本特性，避免js or css 新特性无法在老环境中运行的情况（多考虑兼容性）

## 参考文献

- [快速查看js语法兼容情况](https://compat-table.github.io/compat-table/es6/)
