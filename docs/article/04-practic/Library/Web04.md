---

title:  创建通用JS公共模块并发布至npm
author: Potter
date: 2022-05-12 18:52
tags: 
- UMD
- rollup
- verdaccio
- npm
categories: 
- 模块化

---

### 概要内容
- 创建：JS公共模块
- 打包：使用rollup 打包公共模块
- 发布：js公共模块至verdaccio平台
- 发布：js公共模块至npm平台

<!--more-->

---

### 如何创建JS公共模块
> 由于代码有点多就不贴代码了，直接去代码仓库看吧  [传输门](https://github.com/aa4790139/JSCommonUtils)


---

### rollup 
- 简介：
    > Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。
- 使用起因：
    > 公共相关的js文件想弄成单独的一个模块，方便后续开发使用，而不是不停的copy 和paste，所以就去了解怎么样把js公共相关js 打包成一个模块。
- 安装
    ```
    pnpm install -g rollup
    ```
- 创建配置文件
    ```
    // rollup.config.js
    import json from 'rollup-plugin-json';
    import babel from 'rollup-plugin-babel';
    import {uglify} from 'rollup-plugin-uglify';
    import {version} from '../package.json';
    import multiEntry from "rollup-plugin-multi-entry";
    import {terser} from "rollup-plugin-terser";

    export default {
        input: 'src/*.js',
        output: {
            /*输出公共库路径*/
            file: 'lib/index.js',
            /*配置：UMD 通用定义模块，支持前端端跨平台模块化*/
            format: 'umd',
            name: 'JSCommonUtils',
            /*压缩和混淆js*/
            plugins: [terser(), uglify()],
            /*JS前缀: 添加库相关信息*/
            banner: '/* JSCommonUtils version ' + version + ' */',
            /*JS尾部: 添加个人相关信息*/
            footer: '/* follow me on github aa4790139 */'
        },
        plugins: [
            json(),
            babel({
                /*过滤node_modules编译*/
                exclude: 'node_modules/**'
            }),
            /*允许多输入源*/
            multiEntry()
        ],
    };

    ```

---

### verdaccio 
- 简介： 开源轻量的npm私服包管理平台
- 使用起因：
    > 创建好自己的js公共模块时，我们需要在浏览器和Node.js 环境中测试，有了verdaccio 就非常方便我们测试了。而不是去不停npm本地公共模块搞得非常蛋疼，而且很容易出问题，所以为了简单和方便我们使用verdaccio 搞个私有仓库，方便我们模拟安装使用。
- 安装 
    ```
    pnpm install -g verdaccio
    ```
- 启动
    ```
    verdaccio
    ```

### 发布至verdaccio平台
- 常用命令
```
//1. 添加用户
npm adduser --registry http://localhost:4873
//2. 发布至私有仓库位置
npm publish --registry http://localhost:4873
// 撤回发布刚发布包
npm unpublish --force --registry http://localhost:4873 
// 撤回发布的指定包
npm unpublish package_name  --force --registry http://localhost:4873
```
- 效果图
![](https://cdn.jsdelivr.net/gh/aa4790139/BlogPicBed@master//img/20210303144737.png)


### 发布至npm平台
- 创建.npmignore 文件，过滤掉无需上传的文件和目录
```
node_modules/*
src/
build/
.babelrc
.gitignore
package-lock.json
pnpm-lock.yaml
!node_modules/crc32
!node_modules/deflate-js
```
> 提示: .npmignore文件内容，需要忽略的文件和目录写前面，需要排除忽略的文件或目录前加!写后面

- 效果图
![](https://cdn.jsdelivr.net/gh/aa4790139/BlogPicBed@master//img/20210303144716.png)

---

#### 参考文献：
- [verdaccio 官网](https://verdaccio.org/docs/en/installation)
- [verdaccio 搭建配置](https://fe.rualc.com/note/npm-verdaccio.html#npm-install)
- [rollup.js 中文文档](https://www.rollupjs.com/guide/tools)
- [rollup 官网打包实践](https://github.com/Godiswill/blog/issues/6)
- [Rollup.js 实战学习笔记](https://chenshenhai.github.io/rollupjs-note/)
- [.npmignore: ignore whole folder except given file types](https://stackoverflow.com/questions/48092647/npmignore-ignore-whole-folder-except-given-file-types)


---

> 以上: 如发现有问题，欢迎留言指出，我及时更正