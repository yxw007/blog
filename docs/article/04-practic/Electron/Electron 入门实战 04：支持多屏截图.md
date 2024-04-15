---
title: Electron 入门实战 04：支持多屏截图
author: Potter
date: 2024-04-15 10:24:25
tags: 
- Electron
- 多屏截图
categories: 
- Electron

---


# Electron 入门实战 04：支持多屏截图

---

## 实现效果

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410181045.gif)

## 实现思路

1. 进入截图状态，启动一个定时器，动态监测获取当前鼠标所在位置
2. 根据鼠标位置所在屏幕，创建对应位置的window即可
3. 在截图状态，只要鼠标按下就关闭监测

## 关键代码

- src/main/index.js
    
    ```jsx
    ...
    function startCheckMouseMove() {
      checkMouseMoveTimer = setInterval(() => {
        const cursorPos = screen.getCursorScreenPoint()
        //! 获取光标所在的屏幕
        const currentScreen = screen.getDisplayNearestPoint(cursorPos)
        if (cutWindow == null) {
          cutWindow = createCutWindow(currentScreen)
          cutWindow.show()
          return
        }
        //! 获取截图窗口屏幕
        const windowScreen = screen.getDisplayMatching(cutWindow.getBounds())
        //! 如果光标所在屏幕与cutWindow 不是同一个屏幕就将cutWindow销毁，然后在光标屏幕创建cutWindow
        if (currentScreen.id !== windowScreen.id) {
          cutWindow.destroy()
          cutWindow = createCutWindow(currentScreen)
          cutWindow.show()
        }
      }, 500)
    }
    
    function stopCheckMouseMove() {
      if (checkMouseMoveTimer) {
        clearInterval(checkMouseMoveTimer)
        checkMouseMoveTimer = null
      }
    }
    
    function enterScreenCut() {
      mainWindow.hide()
      stopCheckMouseMove()
      startCheckMouseMove()
    }
    ...
    
    ipcMain.on(bridgeEvent.STOP_CHECK_MOUSE_MOVE, () => {
       stopCheckMouseMove()
    })
    ...
    ```
    
- src/renderer/src/pages/Cut/index.vue
    
    ```jsx
    ...
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
    	ipcRenderer.send(bridgeEvent.STOP_CHECK_MOUSE_MOVE);
    }
    ...
    ```
    

## 总结

- cutWindow 创建时，需要获取currentScreen的bounds的x,y 也就当前屏幕的偏移量，否则会导致创建的cutWindow位置错误

完整demo ：[传送门](https://github.com/yxw007/QRCodeTools)，顺便帮忙点个star，感谢~

## 参考文献

- [https://www.electronjs.org/docs/latest/api/screen#screengetcursorscreenpoint](https://www.electronjs.org/docs/latest/api/screen#screengetcursorscreenpoint)
- [https://www.electronjs.org/docs/latest/api/screen#screengetdisplaynearestpointpoint](https://www.electronjs.org/docs/latest/api/screen#screengetdisplaynearestpointpoint)
