---
title: Electron 入门实战 01：主进程与渲染进程通信
author: Potter
date: 2024-01-08 15:36:42

tags:

- Electron

categories:

- Electron
---

# Electron 入门实战 01：主进程与渲染进程通信


## 项目搭建

1. 创建命令

    ```bash
    mkdir electron_app
    cd electron_app
    npm init -y
    yarn add electron -D
    ```

2. 必要的配置
    - package.json

        ```bash
        {
          "name": "my-electron-app",
          "version": "1.0.0",
          "main": "main.js",
          "license": "MIT",
          "scripts": {
            "dev": "electron ."
          },
          "devDependencies": {
            "electron": "^28.0.0"
          }
        }
        ```

        - main：设置入口文件
        - scripts： 添加开发命令
    - main.js

        ```jsx
        const { app, BrowserWindow } = require("electron");
        
        const createWindow = () => {
         const win = new BrowserWindow({
          width: 800,
          height: 600,
         });
         
         // 添加首页面
         win.loadFile("index.html");
        };
        
        //! 1. app已准备就绪
        app.whenReady().then(() => {
         //2. 创建一个win窗口
         createWindow();
         console.log(process.platform);
         
          //3. 添加预防处理，如果app已处于active状态还没window自动创建一个
         app.on("activate", () => {
          if (BrowserWindow.getAllWindows().length === 0) {
           createWindow();
          }
         });
        });
        
        app.on("window-all-closed", () => {
         // 说明：不为mac os 平台，添加此退出命令
         if (process.platform !== "darwin") {
          console.log("quit");
          app.quit();
         }
        });
        ```

- index.html

    ```jsx
    <!DOCTYPE html>
    <html>
    
    <head>
     <meta charset="UTF-8" />
     <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
     <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self'" />
     <meta http-equiv="X-Content-Security-Policy"
        content="default-src 'self'; script-src 'self'" />
     <title>Hello from Electron renderer!</title>
    </head>
    
    <body>
     <h1>Hello from Electron renderer!</h1>
     <p>👋</p>
    </body>
    
    </html>
    ```

- yarn dev  看下效果

   !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240108153845.png)

说明最简单的项目已搭建好，我们来看下Render process 与 Main process 是如何通讯的

## 主进程与渲染进程通讯

- 为了让代码更加清晰，我们将渲染进程的代码写到renderer.js中
- 由于Electron是一个Node环境，可以完全的访问系统，为了安全我们添加一个preload 脚本来建立一个桥，让渲染进程与主进程进行通信
- 利用Electron包中的ipcMain 和 ipcRenderer 进行通信

具体代码：

- main.js

    ```jsx
    const { app, BrowserWindow, ipcMain } = require("electron");
    const path = require("node:path");
    
    const createWindow = () => {
     const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
       //! 3.注意这里添加了预加载preload.js
       preload: path.join(__dirname, "preload.js"),
      },
     });
    
     win.loadFile("index.html");
    };
    
    app.whenReady().then(() => {
     //! 主进程，处理渲染进程的消息
     ipcMain.handle("ping", () => {
      return `I'm ipcMain`;
     });
    
     // ! 1.主进程监听来自渲染进程的消息
     ipcMain.on("message-from-renderer", (event, arg) => {
      console.log("Renderer Process Message:", arg);
    
      //! 2.发送回复消息到渲染进程
      event.sender.send("message-from-main", "Hello from main process!");
     });
    
     createWindow();
     console.log(process.platform);
     app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
       createWindow();
      }
     });
    });
    
    app.on("window-all-closed", () => {
     if (process.platform !== "darwin") {
      console.log("quit");
      app.quit();
     }
    });
    ```

- preload.js

    ```jsx
    const { contextBridge, ipcRenderer } = require("electron");
    
    contextBridge.exposeInMainWorld("versions", {
     node: () => process.versions.node,
     chrome: () => process.versions.chrome,
     electron: () => process.versions.electron,
     //! 给桥上线添加对应方法
     ping: (name) => ipcRenderer.invoke("ping", name),
    });
    
    //! 1.添加渲染进程与主进程的桥梁接口
    contextBridge.exposeInMainWorld("electronAPI", {
     sendMessageToMain: (message) => {
      ipcRenderer.send("message-from-renderer", message);
     },
     receiveMessageFromMain: (callback) => {
      ipcRenderer.on("message-from-main", (event, message) => {
       callback(message);
      });
     },
    });
    ```

- renderer.js

    ```jsx
    const information = document.getElementById("info");
    information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
    
    const func = async () => {
     //! 渲染进程, 调用主进程方法
     const response = await window.versions.ping();
     console.log("渲染进程接收主进程的消息：", response); // prints out 'pong'
    };
    
    func();
    
    //! 1.渲染进程往主进程发送消息
    window.electronAPI.sendMessageToMain("Hello from the renderer process!");
    //! 2.渲染进程接收到主进程的消息
    window.electronAPI.receiveMessageFromMain((message) => {
     console.log(`Received message from main process: ${message}`);
    });
    ```

yarn dev 看下效果

- 主进程收到渲染进程消息（注意：主进程接收到的消息打印在终端控制台）

    !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240108153904.png)

- 渲染进程收到主进程消息

    !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240108153923.png)

    说明：可能你不知道打开Electron App的日志控制台，看下图：

    !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240108153934.png)

## 总结

- 整体来说参看官方文档和网上的文章就可以轻松实现

## 参考文献

- [https://www.electronjs.org/docs/latest/tutorial/tutorial-preload](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload)

---

> 以上: 如发现有问题，欢迎留言指出，我及时更正
