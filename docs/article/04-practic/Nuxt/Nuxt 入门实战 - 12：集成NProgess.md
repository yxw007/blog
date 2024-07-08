---
title: Nuxt 入门实战 - 12：集成NProgess
author: Potter
date: 2023-07-01 11:45:04

tags:

- Nuxt

categories:

- Nuxt 入门实战
---

# Nuxt 入门实战 - 12：集成NProgess


## 背景

如果网络卡时，切换导航界面完全没反应，这样的体验非常不好，所以给切换导航时页面顶部添加一个蓝进度条。于是网上搜索一番找到nprogress库来满足这个需求

## 安装nprogress

```bash
pnpm add nprogress

# 如果是ts项目，请安装对应types包
pnpm add -D @types/nprogress
```

## 配置nprogress

- nuxt.config.ts

    ```tsx
    export default defineNuxtConfig({
     ...
     plugins: [
      { src: '~/plugins/nprogress.ts', mode: 'client' }
     ],
     ...
    }
    ```

- 新增 nprogress.ts

    ```tsx
    import NProgress from 'nprogress'
    import 'nprogress/nprogress.css'
    
    export default defineNuxtPlugin((): void => {
    
     useRouter().beforeEach((): void => {
      NProgress.start();
     });
    
     useRouter().afterEach((): void => {
      NProgress.done();
     });
    })
    ```

此时你可能有这样的疑问，切换导航加了这个进度条。假如我想点某个按钮发送请求也显示出进度条，等请求结束后关闭进度条。那么如何配置呢？

根下的utils目录添加以下代码即可

```tsx
import NPInstance from "nprogress";

export type TNProgress = typeof NPInstance;
export const NP: TNProgress = NPInstance;
```

此时在任何地方直接用NP就可以了（NP会在使用的地方自动导入，如果你禁止自动导入就将其打开吧 [autoimport](https://nuxt.com/docs/guide/concepts/auto-imports)），示例：

```tsx
NP.start();
const res: S2CLoginRes = await $fetch("xxx", {
 method: "POST",
 body: {
  ...
 }
});
NP.done();
```

## 总结

起初我以为NProgress是一个组件，网上搜索next3 如何引入第三方组件，然后支持全局引入等等，搞得我兜了一大圈发现是一个对象

- 在不确定库导出内容时，最好点进去看一看，免得浪费时间

## 参考文献

- [https://juejin.cn/post/7276716177120723005](https://juejin.cn/post/7276716177120723005)
- [https://nuxt.com/docs/guide/concepts/auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports)
