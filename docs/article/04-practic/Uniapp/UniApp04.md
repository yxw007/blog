# uniapp 入门实战 04： canvasToTempFilePath 解决 fail canvas is empty 报错

---

title:  uniapp 入门实战 04： canvasToTempFilePath 解决 fail canvas is empty 报错
author: Potter
date: 2022-05-12 18:42

tags:

- UniApp
- canvas
- 小程序

categories:

- uniapp 入门实战

...

## 概要内容

- 问题描述
- 解决方法

---

## 问题描述

---

> 起因：一个vue页面组件都2645行，而且功能有多，实在太难维护，所以决定进行功能拆分重构。
>

![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20211021093914.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20211021093914.png)

### 调整之前结构

- PageScene.vue

```html
<template>
  ...
  <!-- #ifdef APP-PLUS || H5 -->
    <canvas
      canvas-id="canvas"
      class="canvas"
      :style="{ width: canvasWidth, height: canvasHeight }"
    ></canvas>
    <!-- #endif -->

    <!-- #ifndef APP-PLUS || H5 -->
    <canvas
      canvas-id="canvas"
      id="canvas"
      class="canvas"
      :style="{ width: canvasWidth, height: canvasHeight }"
    ></canvas>
    <!-- #endif -->
  ...
</template>
```

<!--more-->

### 调整之后结构

- SceneRender.vue

    ```html
    <template>
      <div class="scene-Render">
      <!-- #ifdef APP-PLUS || H5 -->
        <canvas
          canvas-id="canvas"
          class="canvas"
          :style="{ width: canvasWidth, height: canvasHeight }"
        ></canvas>
        <!-- #endif -->
    
        <!-- #ifndef APP-PLUS || H5 -->
        <canvas
          canvas-id="canvas"
          id="canvas"
          class="canvas"
          :style="{ width: canvasWidth, height: canvasHeight }"
        ></canvas>
        <!-- #endif -->
     </div>
    </template>
    
    <script>
    ...
    export default {
     onShow(){
      let canvas = uni.createCanvasContext("canvas", this);
      canvas.setStrokeStyle("#00ff00");
        canvas.setLineWidth(5);
        canvas.rect(0, 0, 200, 200);
        canvas.stroke();
      canvas.draw(false, () => {
          setTimeout(() => {
            uni.canvasToTempFilePath({
              canvasId: "canvas",
              x: 0,
              y: 0,
              width: 200,
              height: 200,
              destWidth: 200,
              destHeight: 200,
              complete: (res) => {
                console.error(res);
              },
            });
          }, 500);
        });
     }
    }
    ...
    </script>
    ```

    > 问题出现：canvas绘制没有一点问题，但是uni.canvasToTempFilePath回调一直报错：canvasToTempFilePath: fail canvas is empty。
    >
- PageScene.vue

    ```html
    <template>
      ...
      <SceneRender></SceneRender>
      ...
    </template>
    ```

## 解决方法

> 经过各种尝试最终发现canvas标签的定义只能放到page页面中，uni.canvasToTempFilePath 才会转换成功。
>
- SceneRender.vue

    ```html
    <template>
      <div class="scene-Render">
      ...
     </div>
    </template>
    
    <script>
    ...
    export default {
     data: {
      return {
       canvas: undefined
      }
     },
     methods: {
      init(cs){
       this.canvas = cs;
      }
     }
    }
    ...
    </script>
    ```

- PageScene.vue

    ```html
    <template>
      ...
      <!-- #ifdef APP-PLUS || H5 -->
        <canvas
          canvas-id="canvas"
          class="canvas"
          :style="{ width: canvasWidth, height: canvasHeight }"
        ></canvas>
        <!-- #endif -->
    
        <!-- #ifndef APP-PLUS || H5 -->
        <canvas
          canvas-id="canvas"
          id="canvas"
          class="canvas"
          :style="{ width: canvasWidth, height: canvasHeight }"
        ></canvas>
        <!-- #endif -->
    
      <SceneRender ref="sceneRender"></SceneRender>
      ...
    </template>
    
    <script>
    ...
    export default {
     onShow(){
      this.$refs.sceneRender.init(uni.createCanvasContext("canvas", this));
     }
    }
    ...
    ```

## 参考文献

- [wx.canvasToTempFilePath文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html)
- [canvasToTempFilePath: fail canvas is empty 的坑](https://developers.weixin.qq.com/community/develop/article/doc/000cca357f07e0be99eacad095bc13)

>
