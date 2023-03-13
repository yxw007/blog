---

title:  Web构建优化
author: Potter
date: 2022-05-12 18:48
tags: 
- DllPlugin
- DllReferencePlugin
- 打包优化
categories: 
- webpack
---

### 概要内容
- DllPlugin 和 DllReferencePlugin 简介
- 如何使用DllPlugin打包，及DllReferencePlugin如何引用dll
- 构建优化效果
- SplitChunks 
- Demo源码工程

<!--more-->

---

### DllPlugin 和 DllReferencePlugin 简介
- DllPlugin: 
> 这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 DLLReferencePlugin 映射到相关的依赖上去的。
- DllReferencePlugin:
> 此插件配置在 webpack 的主配置文件中，此插件会把 dll-only-bundles 引用到需要的预编译的依赖中
- 通俗点讲：
> DllPlugin 插件负责把第三方公共库，打包进一个独立的dll库中。最后项目打包时DllReferencePlugin 通过manifest.json 来引用dll的公共库，避免项目每次构建时都将第三库和业务代码进行重复打包。
- 优点：
    - 提升打包构建速度
    - 公共js文件配置CDN，避免掉重复下载公共库js文件

---

### 如何使用DllPlugin打包，及DllReferencePlugin如何引用dll
- DllPlugin 配置需要打包第三方库至dll中

    
```
//webpack.dll.config.js

const DllPlugin = require('webpack/lib/DllPlugin');
const path = require('path')
const fs = require('fs');

var packageJsonContent = fs.readFileSync(path.resolve(__dirname, '../package.json'));
var packageJson = JSON.parse(packageJsonContent);

var dependencies = Object.keys(packageJson.dependencies);

module.exports = {
    entry: {
        vendor: dependencies
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'vendor.bundle.js',
        library: 'vendor_lib'
    },
    plugins: [
        new DllPlugin({
            context: __dirname,
            name: 'vendor_lib',
            /* 生成manifest文件输出的位置和文件名称 */
            path: path.resolve(__dirname, '../dist/vendor-manifest.json')
        })
    ],
}

```
- DllReferencePlugin如何引用dll

```
//webpack.config.js 中 plugins添加以下代码

new DllReferencePlugin({
            manifest: require(path.resolve(__dirname, '../dist/vendor-manifest.json'))
}),
```

---

### 构建优化效果
> 简单demo，未抽离公共库打包时间7572ms，抽离公共库打包时间2315ms，打包速度快2倍多
![](https://cdn.jsdelivr.net/gh/aa4790139/BlogPicBed@master//img/20201230131323.png)

---

### SplitChunks
- 简介：Webpack中一个提取或分离代码的插件，主要作用是提取公共代码，防止代码被重复打包，拆分过大的js文件，合并零散的js文件，可配置
- 配置：

```
//webpack.dll.config.js中optimization 中新增如下配置
splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
```

---

### Demo源码工程
- 访问地址：[https://github.com/aa4790139/webpack4_confuse_demo](https://github.com/aa4790139/webpack4_confuse_demo)

---

### 最后：
> 由于对于公共库抽离和分割包过大优化打包，我只是试探性的去了解和测试。如果你还有什么更好的优化构建方法或者建议，欢迎给我留言。感谢~

---

### 参考文献
- [深入浅出的webpack构建工具---DllPlugin DllReferencePlugin提高构建速度(七)](https://www.cnblogs.com/tugenhua0707/p/9520780.html)
- [SplitChunksPlugin 使用说明](https://webpack.docschina.org/plugins/split-chunks-plugin/#optimizationsplitchunks)
- [Webpack之SplitChunks插件用法详解](https://zhuanlan.zhihu.com/p/152097785)
- [webpack 4 Code Splitting 的 splitChunks 配置探索](https://imweb.io/topic/5b66dd601402769b60847149)

> 以上: 如发现有问题，欢迎留言指出，我及时更正