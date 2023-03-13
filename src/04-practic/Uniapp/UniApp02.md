---

title:  uniapp 入门实战 02：编译时动态替换配置方案
author: Potter
date: 2022-05-12 18:42
tags: 
- UniApp
categories: 
- uniapp 入门实战

---

## 概要内容

- 通过vue.config 实现
- 示例

---

## 通过vue.config 实现

---

由于我们公司业务需求，同一份uniapp项目代码需搞出两个不同名称的小程序，所以每次切换项目配置时，需要改好几处配置信息。根据以前的经验，就是通过webpack编译时，动态选择不同的配置。看到工程项目结构后我傻眼了，编译相关的uniapp 框架完全封装集成完，让人无需关系。可问题是我现在需要啊~...  😭

<!--more-->

![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513221230.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513221230.png)

先google一下，都找不到uniapp 编译相关资料。只好翻uniapp 官网，看到以下信息，希望就在眼前。

![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513222337.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513222337.png)

所以解决方案就来了  😜

## 示例：

- 首先：项目根目录创建vue.config.js

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513222808.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513222808.png)

- 其次：vue.config.js（替换微信小程序appid）

    ```jsx
    /**
    * 创建日期: 2021-05-13
    * 文件名称：vue.config.js
    * 创建作者：Potter
    * 开发版本：1.0.0
    * 相关说明：
    */

    //-------------------------------------------------------------------------
    console.log("------------------------------------------");
    console.log("Compile [Auto replace config]: Go...");
    const path = require('path')
    const fs = require('fs');
    //-------------------------------------------------------------------------
    /**
     * 读取launch_config.json 配置
     */
    let serverConfig = undefined;
    try {
    	const data = fs.readFileSync(path.join(__dirname, './static/launch_config.json'), 'utf8');
    	let launchConfig = JSON.parse(data);
    	serverConfig = launchConfig["server_configs"][launchConfig["server"]];
    	console.log("Compile [Auto replace config] : current choice configInfo=" + JSON.stringify(serverConfig));
    } catch (e) {
    	console.error("Compile [Auto replace config] : read lanch_config error ! e=" + e);
    }
    //-------------------------------------------------------------------------

    /**
     * 读取manifest.json, 采用当前渲染server_config 替换掉manifest.json 中的对应字段
     */
    try {
    	const manifestPath = path.join(__dirname, './manifest.json');
    	const data = fs.readFileSync(manifestPath, 'utf8');
    	let manifest = JSON.parse(data);

    	console.log("Compile [Auto replace config] : manifest " + `appid[${manifest["mp-weixin"]['appid']}->${serverConfig['appid']}]`);
    	manifest["mp-weixin"]['appid'] = serverConfig['appid'];

    	fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
    } catch (e) {
    	console.error("Compile [Auto replace config] : read manifest error ! e=" + e);
    }
    //-------------------------------------------------------------------------
    console.log("Compile [Auto replace config]: Complete !");
    console.log("------------------------------------------");
    ```

- 最后：运行即可，可以看到以下appid 已替换

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513223413.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20210513223413.png)

---

