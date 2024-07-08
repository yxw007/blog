---
title: Electron 入门实战 03：实现一个截图功能
author: Potter
date: 2024-04-15 10:23:32

tags:

- Electron
- 截图

categories:

- Electron
---

# Electron 入门实战 03：实现一个截图功能


## 实现效果

!["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410180945.gif)

## 实现思路

1. 创建两个window，一个叫mainWindow，一个叫cutWindow
2. mainWindow：主界面用来展示截图结果
3. cutWindow：截图窗口，加载截图页面和截图交互逻辑
4. mainWindow 页面点击截图，让cutWIndow 来实现具体截图逻辑
5. cutWindow：截图完后把截图send给mainWindow页面

## 截图过程-时序图

!["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410181003.png)

## 创建项目

我在网上找了一大圈，没有找到一个合适的模板，要么环境太老、要么配置各种缺失不完善、要么打包出来各种问题等等，说实话坑还真不少，无意间找到一个特别好的脚手架，它简单又完善。推荐给大家：[electron-vite](https://cn.electron-vite.org/guide/) ，所以接下来直接用创建命令

```jsx
yarn create @quick-start/electron
```

## 安装依赖

- vue-router：切换加载首页和截图页面
- konva：完成截图交互的库

```jsx
yarn add konva vue-router
```

## 核心代码

为了更好的展示添加的内容，提供如下目录结构图方便理解

### 目录结构

!["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410181015.png)

### 主进程

- src/main/index.js

    ```jsx
    import {
      app,
      shell,
      BrowserWindow,
      ipcMain,
      screen,
      desktopCapturer,
      globalShortcut
    } from 'electron'
    import { join } from 'path'
    import { electronApp, optimizer, is } from '@electron-toolkit/utils'
    import icon from '../../resources/icon.png?asset'
    
    let mainWindow
    let cutWindow
    
    function closeCutWindow() {
      cutWindow && cutWindow.close()
      cutWindow = null
    }
    
    function createMainWindow() {
      mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false
        }
      })
    
      mainWindow.on('ready-to-show', () => {
        mainWindow.show()
      })
    
      mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
      })
    
      console.log('loadURL:', process.env['ELECTRON_RENDERER_URL'])
    
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
      } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
      }
    
      mainWindow.on('closed', () => {
        closeCutWindow()
      })
    }
    
    function registerShortcut() {
      //! 截图快捷键
      globalShortcut.register('CommandOrControl+Alt+C', () => {
        openCutScreen()
      })
      globalShortcut.register('Esc', () => {
        closeCutWindow()
        mainWindow.show()
      })
      globalShortcut.register('Enter', sendFinishCut)
    }
    
    app.whenReady().then(() => {
      // Set app user model id for windows
      electronApp.setAppUserModelId('com.electron')
    
      // Default open or close DevTools by F12 in development
      // and ignore CommandOrControl + R in production.
      // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
      //! 开发模式：win 环境F12 和 mac os 环境：CommandOrControl + R 打开 DevTools
      app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
      })
    
      createMainWindow()
      registerShortcut()
      openMainListener()
    
      app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
      })
    })
    
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        globalShortcut.unregisterAll()
        app.quit()
      }
    })
    
    function getSize() {
      const { size, scaleFactor } = screen.getPrimaryDisplay()
      return {
        width: size.width * scaleFactor,
        height: size.height * scaleFactor
      }
    }
    
    function createCutWindow() {
      const { width, height } = getSize()
      cutWindow = new BrowserWindow({
        width,
        height,
        autoHideMenuBar: true,
        useContentSize: true,
        movable: false,
        frame: false,
        resizable: false,
        hasShadow: false,
        transparent: true,
        fullscreenable: true,
        fullscreen: true,
        simpleFullscreen: true,
        alwaysOnTop: false,
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          nodeIntegration: true,
          contextIsolation: false
        }
      })
    
      console.log('createCutWindow:', is.dev, process.env['ELECTRON_RENDERER_URL'])
    
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        let url = process.env['ELECTRON_RENDERER_URL'] + '/#/cut'
        console.log('createCutWindow: loadURL=', url)
        cutWindow.loadURL(url)
      } else {
        cutWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
      }
    
      cutWindow.maximize()
      cutWindow.setFullScreen(true)
    }
    
    function sendFinishCut() {
      cutWindow && cutWindow.webContents.send('FINISH_CUT')
    }
    
    function openCutScreen() {
      closeCutWindow()
      mainWindow.hide()
      createCutWindow()
      cutWindow.show()
    }
    
    function openMainListener() {
      ipcMain.on('OPEN_CUT_SCREEN', openCutScreen)
      ipcMain.on('SHOW_CUT_SCREEN', async (e) => {
        let sources = await desktopCapturer.getSources({
          types: ['screen'],
          thumbnailSize: getSize()
        })
        cutWindow && cutWindow.webContents.send('GET_SCREEN_IMAGE', sources[0])
      })
      ipcMain.on('FINISH_CUT_SCREEN', async (e, cutInfo) => {
        closeCutWindow()
        mainWindow.webContents.send('GET_CUT_INFO', cutInfo)
        mainWindow.show()
      })
      ipcMain.on('CLOSE_CUT_SCREEN', async (e) => {
        closeCutWindow()
        mainWindow.show()
      })
    }
    ```

### 渲染器

- scr/main.js

    ```jsx
    import { createApp } from 'vue'
    import App from './App.vue'
    import router from './router'
    
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
    ```

- src/router/index.js

    ```jsx
    import { createRouter, createWebHashHistory } from 'vue-router'
    
    const routes = [
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        component: () => import('../pages/Home/index.vue')
      },
      {
        path: '/cut',
        name: 'cut',
        component: () => import('../pages/Cut/index.vue')
      }
    ]
    
    const router = createRouter({
      history: createWebHashHistory(),
      routes
    })
    
    export default router
    ```

- src/App.vue

    ```jsx
    <template>
      <router-view>
      </router-view>
    </template>
    
    <script setup>
    </script>
    
    <style lang="less">
    @import './assets/css/styles.less';
    </style>
    ```

- src/pages/index.vue：首页

    ```jsx
    <template>
     <div class="container">
      <button @click="handleCutScreen">截屏</button>
      <div>
       <img :src="previewImage"
          style="max-width: 100%" />
      </div>
     </div>
    </template>
    
    <script setup>
    import { ref } from "vue";
    const { ipcRenderer } = window.electron;
    const previewImage = ref("");
    
    async function handleCutScreen() {
     await ipcRenderer.send("OPEN_CUT_SCREEN");
     ipcRenderer.removeListener("GET_CUT_INFO", getCutInfo);
     ipcRenderer.on("GET_CUT_INFO", getCutInfo);
    }
    
    function getCutInfo(event, pic) {
     previewImage.value = pic;
    }
    </script>
    ```

- src/pages/cut.vue：截图界面

    ```jsx
    <template>
     <div class="container"
        :style="'background-image:url(' + bg + ')'"
        ref="container"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp">
     </div>
    </template>
    <script setup>
    import Konva from "konva";
    import { ref, onMounted } from "vue";
    
    const { ipcRenderer } = window.electron;
    let container = ref(null);
    let bg = ref("");
    let stage, layer, rect, transformer;
    
    onMounted(() => {
     ipcRenderer.send("SHOW_CUT_SCREEN");
     ipcRenderer.removeListener("GET_SCREEN_IMAGE", getSource);
     ipcRenderer.on("GET_SCREEN_IMAGE", getSource);
     ipcRenderer.on("FINISH_CUT", confirmCut);
    });
    
    async function getSource(event, source) {
     const { thumbnail } = source;
     const pngData = await thumbnail.toDataURL("image/png");
     bg.value = pngData;
     render();
    }
    
    function render() {
     stage = createStage();
     layer = createLayer(stage);
    }
    
    function createStage() {
     return new Konva.Stage({
      container: container.value,
      width: window.innerWidth,
      height: window.innerHeight,
     });
    }
    
    function createLayer(stage) {
     let layer = new Konva.Layer();
     stage.add(layer);
     layer.draw();
     return layer;
    }
    
    function createRect(layer, x, y, width, height, alpha, draggable) {
     let rect = new Konva.Rect({
      x,
      y,
      width,
      height,
      fill: `rgba(0,0,255,${alpha})`,
      draggable
     });
     layer.add(rect);
     return rect;
    }
    
    let isDown = false;
    let rectOption = {};
    function onMouseDown(e) {
     if (rect || isDown) {
      return;
     }
     isDown = true;
     const { pageX, pageY } = e;
     rectOption.x = pageX || 0;
     rectOption.y = pageY || 0;
     rect = createRect(layer, pageX, pageY, 0, 0, 0.25, false);
     rect.draw();
    }
    
    function onMouseMove(e) {
     if (!isDown) return;
     const { pageX, pageY } = e;
     let w = pageX - rectOption.x;
     let h = pageY - rectOption.y;
     rect.remove();
     rect = createRect(layer, rectOption.x, rectOption.y, w, h, 0.25, false);
     rect.draw();
    }
    
    function onMouseUp(e) {
     if (!isDown) {
      return;
     }
     isDown = false;
     const { pageX, pageY } = e;
     let w = pageX - rectOption.x;
     let h = pageY - rectOption.y;
     rect.remove();
     rect = createRect(layer, rectOption.x, rectOption.y, w, h, 0, true);
     rect.draw();
     transformer = createTransformer(rect);
     layer.add(transformer);
    }
    
    function createTransformer(rect) {
     let transformer = new Konva.Transformer({
      nodes: [rect],
      rotateAnchorOffset: 60,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
     });
     return transformer
    }
    
    /**
     * 根据选择区域生成图片
     * @param {*} info 
     */
    async function getCutImage(info) {
     const { x, y, width, height } = info;
     let img = new Image();
     img.src = bg.value;
     let canvas = document.createElement("canvas");
     let ctx = canvas.getContext("2d");
     canvas.width = ctx.width = width;
     canvas.height = ctx.height = height;
     ctx.drawImage(img, -x, -y, window.innerWidth, window.innerHeight);
     return canvas.toDataURL("image/png");
    }
    
    /**
     * 确认截图
     */
    async function confirmCut() {
     const { width, height, x, y, scaleX = 1, scaleY = 1 } = rect.attrs;
     let _x = width > 0 ? x : x + width * scaleX;
     let _y = height > 0 ? y : y + height * scaleY;
     let pic = await getCutImage({
      x: _x,
      y: _y,
      width: Math.abs(width) * scaleX,
      height: Math.abs(height) * scaleY,
     });
     ipcRenderer.send("FINISH_CUT_SCREEN", pic);
    }
    
    /**
     * 关闭截图
     */
    function closeCut() {
     ipcRenderer.send("CLOSE_CUT_SCREEN");
    }
    </script>
    
    <style lang="scss" scoped>
    .container {
     position: fixed;
     top: 0;
     bottom: 0;
     left: 0;
     right: 0;
     width: 100%;
     height: 100%;
     overflow: hidden;
     background-color: transparent;
     background-size: 100% 100%;
     background-repeat: no-repeat;
     border: 2px solid blue;
     box-sizing: border-box;
    }
    </style>
    ```

## 总结

虽然实现了核心功能，但是仅支持主屏幕截图，不支持多屏幕截图，同时还遗留诸多问题，后面单独一篇更新解决

完整demo ：[传送门](https://github.com/yxw007/QRCodeTools)，顺便帮忙点个star，感谢~

## 参考文献

- [https://juejin.cn/post/7111115472182968327](https://juejin.cn/post/7111115472182968327)
- [https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts](https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts)
- [https://konvajs.org/docs/select_and_transform/Basic_demo.html](https://konvajs.org/docs/select_and_transform/Basic_demo.html)
- [https://stackoverflow.com/questions/40360109/content-security-policy-img-src-self-data/62213224#62213224](https://stackoverflow.com/questions/40360109/content-security-policy-img-src-self-data/62213224#62213224)
