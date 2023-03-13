---

title:  WebPack 02：利用 VS Code 进行调试
author: Potter
date: 2022-05-12 18:45
tags: 
- WebPack
- vscode
- debugger
categories: 
- WebPack

---

## 概要内容

1. npm init -y
2. 安装依赖
3. 创建webpack.config.js
4. 创建index.js
5. 创建调试launch.json
6. 启动调试

---

> 由于工作中遇到一个问题，需要根据环境编译代码，比如：ios平台需要某项功能，pc平台不需要这个功能，所以就可以用过编写一个自定义的loader解决此问题。虽然可以通过打例子的方式来调试代码，但是这种方式太低效了，如果日后还想知道webpack的工作原理，打日志的方式就太可行了，不能单不跟踪、实时看到各变量的当前情况，调用堆栈等等，所以来了解一下vscode里面如何调试webpack代码。
> 

<!--more-->

## 步骤如下：

---

1. npm init -y
2. package.json (说明：为了保证示例能运行，方便npm install)
    
    ```json
    {
      "name": "02-debugger",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "debugger": "node ./node_modules/.bin/webpack --config webpack.config.js"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "@babel/core": "^7.16.0",
        "@babel/preset-env": "^7.16.0",
        "webpack": "^5.64.0",
        "webpack-cli": "^4.9.1"
      }
    }
    ```
    
3. webpack.config.js
    
    ```json
    const path = require("path")
    module.exports = {
        mode:'development',
        entry:"./src/index.js",
        output:{
            filename:"[name].js",
            path:path.resolve(__dirname,"dist")
        },
        module:{
            rules:[]
        }
    }
    ```
    
4. 创建index.js
    
    ```json
    //src/index.js
    console.log("hello")
    ```
    
5. 创建调试launch.json
    
    ```json
    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "debugger",
                "stopOnEntry": true,
                "console": "integratedTerminal",
                "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.js",
                "args": [
                    "--config",
                    "./webpack.config.js"
                ],
                "env": {
                    "NODE_ENV": "production"
                }
            }
        ]
    }
    ```
    
6. 最后目录结构
    
    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114234644.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114234644.png)
    
7. 启动调试
    
    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114215606.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114215606.png)
    

> 完整示例：[https://github.com/yxw007/H5-Learn/tree/master/webpack/02-debugger](https://github.com/yxw007/H5-Learn/tree/master/webpack/02-debugger)
> 

---

## 参考文献

- **[Debugging Webpack with VS Code](https://medium.com/@jsilvax/debugging-webpack-with-vs-code-b14694db4f8e)**
- **[VSCode 调试 Webpack 指南](https://zhuanlan.zhihu.com/p/108939782)**

