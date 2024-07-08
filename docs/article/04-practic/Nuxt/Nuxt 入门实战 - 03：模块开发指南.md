# Nuxt 入门实战 - 03：模块开发指南

---

title: Nuxt 入门实战 - 03：模块开发指南
author: Potter
date: 2023-06-21 11:41:30

tags:

- Nuxt

categories:

- Nuxt 入门实战

...

## 创建模块项目

```jsx
npx nuxi init -t module nuxt-my-module
```

## 开发

```jsx
pnpm run dev
```

## 开发

```jsx
pnpm run dev:build
```

## 打包

```jsx
pnpm run prepack
```

## 发布

```jsx
pnpm publish
```

## 如何使用

```jsx
//nuxt.config.ts

export default defineNuxtConfig({
 ...
 modules: [...,"nuxt-my-module"],
});
```

## 参考文献

- [https://nuxt.com/docs/guide/going-further/modules](https://nuxt.com/docs/guide/going-further/modules)
