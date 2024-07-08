# webpack 03：实现一个自定义loader

---

title:  webpack 03：实现一个自定义loader
author: Potter
date: 2022-05-12 18:45

tags:

- webpack
- 自定义loader

categories:

- webpack

...

## 概要内容

- 自定义loader
- 总结

---

> 相信利用webpack打包项目，都会碰到各种内置的loader，比如：vue-loader、babel-loader、svg-sprite-loader、url-loader等等，其实他们的作用就是进行资源转换，最近碰到一个需求就刚好需要这样一个东西，比如：ios平台打出来的包需要某个功能，pc平台却不需要某个功能，所以就可以利用loader的机制来实现。下面给出一个简单的示例
>

---

<!--more-->

## 创建步骤

1. npm init -y
2. package.json (说明：网上提供的示例基本不提供具体的插件版本，导致要么这个问题要么哪个问题，版本不兼容太正常了。为了保证示例能运行，方便npm install 所以把package.json 直接贴出)

    ```json
    {
      "name": "03-custom-loader",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "dev": "webpack-dev-server --config webpack.config.js",
        "debugger": "node ./node_modules/.bin/webpack --config webpack.config.js",
        "build": "webpack"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "@babel/core": "^7.16.0",
        "@babel/preset-env": "^7.16.0",
        "loader-utils": "^2.0.0",
        "webpack": "^5.64.0",
        "webpack-cli": "^4.9.1",
        "webpack-dev-server": "^4.5.0",
        "html-webpack-plugin": "^5.5.0"
      }
    }
    ```

3. 创建webpack.config.js

    ```json
    const path = require("path")
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const HotmoduleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
    module.exports = {
        mode:'development',
        entry:"./src/index.js",
        output:{
            filename:"[name].js",
            path:path.resolve(__dirname,"dist")
        },
        devServer:{
            client: {
                logging: "info",
                overlay: true,
                progress: true,
            },
            hot:true,
            port:9000,
        },
        resolveLoader: {
            alias: {//创建loader别名
                "replace-name-loader": path.resolve(__dirname, "./build/replace-name-loader.js"),
                "replace-age-loader": path.resolve(__dirname, "./build/replace-age-loader.js"),
            }
        },
        module:{
            rules:[
                {
                    test: /\.js$/,
                    use:[{
                            loader: 'replace-name-loader',
                            options: {
                                name: "Alice",
                            },
                        },{
                            loader: 'replace-age-loader',
                            options: {
                                age: 100,
                            },
                        }
                    ],
                  },
            ]
        },
        plugins:[
            new HtmlWebpackPlugin({
                filename:"index.html",
                template:'index.html',
                inject: true
            }),
            new HotmoduleReplacementPlugin()
        ]
    }
    ```

4. babel.config.js

    ```json
    module.exports = {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current',
              },
            },
          ],
        ],
      };
    ```

5. 创建index.html

    ```json
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <title>title</title>
        <style>
        </style>
    </head>
    
    <body>
    </body>
    
    </html>
    ```

6. 创建src中的文件
    1. index.js

        ```jsx
        import { name} from "./name.js";
        import { age} from "./age.js";
        function showInfo(){
            console.log(`${name}的年龄是${age}岁`);
        }
        showInfo();
        ```

    2. age.js

        ```jsx
        export const age = 18;
        ```

    3. name.js

        ```jsx
        export const name = "小明";
        ```

7. 创建loader
    1. replace-age-loader.js

        ```jsx
        /**
         * @param {*} source loader 匹配的资源文件内容
         * @returns 
         */
        const loaderUtils = require('loader-utils')
        const { SourceMap } = require('module');
        module.exports = function(source)  {
            let {age} = loaderUtils.getOptions(this);
            const content = source.replace("18",age);
            this.callback(null,content,SourceMap)
        }
        ```

    2. replace-name-loader.js

        ```jsx
        /**
         * @param {*} source loader 匹配的资源文件内容
         * @returns 
         */
        const loaderUtils = require('loader-utils')
        const { SourceMap } = require('module');
        module.exports = function(source)  {
            let {name} = loaderUtils.getOptions(this);
            const content = source.replace("小明",name);
            this.callback(null,content,SourceMap)
        }
        ```

8. 最后的目录结构

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114233457.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114233457.png)

9. npm run dev  效果如下

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114233600.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211114233600.png)

---

> 完整示例：[https://github.com/yxw007/H5-Learn/tree/master/webpack/03-custom-loader](https://github.com/yxw007/H5-Learn/tree/master/webpack/03-custom-loader)
>

## 总结

1. use 里面的loader 是最后一个往第一个执行的
2. loader请保持单一原则，一个loader只做一件事

## 参考文献

- **[由浅及深实现一个自定义loader](https://zhuanlan.zhihu.com/p/334741480)**
- **[Writing a Loader](https://webpack.js.org/contribute/writing-a-loader/)**
- **[Rule.use](https://webpack.docschina.org/configuration/module/#ruleuse)**
- **[https://github.com/webpack/loader-utils/blob/master/CHANGELOG.md](https://github.com/webpack/loader-utils/blob/master/CHANGELOG.md)**
- **[五分钟了解模板引擎原理，阅读后做出自己的模板引擎](https://www.jianshu.com/p/9091e8a343e4)**
