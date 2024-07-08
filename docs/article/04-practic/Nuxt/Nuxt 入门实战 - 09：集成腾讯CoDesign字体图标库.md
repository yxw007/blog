---
title: Nuxt 入门实战 - 09：集成腾讯CoDesign字体图标库
author: Potter
date: 2023-06-24 11:44:05

tags:

- Nuxt

categories:

- Nuxt 入门实战
---

# Nuxt 入门实战 - 09：集成腾讯CoDesign字体图标库


## CDN引入

```tsx
//nuxt.config.ts
export default defineNuxtConfig({
 ...
 app: {
   head: {
    link: [
     {
      rel: "stylesheet",
      href: "https://cdn3.codesign.qq.com/icons/o5l429lvJGZdYDO/latest/iconfont.css",
     }
    ],
    script: [
     {
      src: "animation/TweenMax.min.js",
      defer: true,
     },
     {
      src: "animation/ModifiersPlugin.min.js",
      defer: true,
     },
     /* {
      src: "~/assets/font/iconfont.js",
      type: "text/javascript",
     }, */
     {
      src: "https://cdn3.codesign.qq.com/icons/o5l429lvJGZdYDO/latest/iconfont.js",
      type: "text/javascript",
     },
    ],
   },
  },
 ...
});
```

## 使用class

> 说明：无色图标使用
>

```html
<i class="iconfont icon-name-100%"></i>
```

## 使用Symbol

> 说明：有色图标使用
>

```html
<svg class="" aria-hidden="true">
 <use xlink:href="#icon-name"></use>
</svg>
```

## 参考文献

- [https://codesign.qq.com/hc/icons/](https://codesign.qq.com/hc/icons/)
