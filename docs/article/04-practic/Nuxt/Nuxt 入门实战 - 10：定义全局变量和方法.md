---
title: Nuxt 入门实战 - 10：定义全局变量和方法
author: Potter
date: 2023-06-25 11:44:26
tags: 
- Nuxt
categories: 
- Nuxt 入门实战

---


# Nuxt 入门实战 - 10：定义全局变量和方法

---

## 定义

> 通过插件来实现全局函数和变量定义
> 

```tsx
//plugins/global.ts
export default defineNuxtPlugin(nuxtApp => {
	function getIconClassName(name: string) {
		return `iconfont icon-${name}`;
	}

	function getIconSymbolName(name: string) {
		return `#${name}`;
	}

	return {
		provide: {
			getIconClassName,
			getIconSymbolName
		}
	}
});
```

## 添加插件配置

```tsx
export default defineNuxtConfig({
	...
	plugins:["~/plugins/global.ts"]
	...
})
```

## 如何使用

```tsx
//注意：全局变量和方法是带$前缀的所以使用的时候要注意一点
const { $getIconClassName, getIconSymbolName} = useNuxtApp();
```

## 参考文献

- [https://stackoverflow.com/questions/74410533/nuxt-3-how-to-access-plugin-injections-from-components](https://stackoverflow.com/questions/74410533/nuxt-3-how-to-access-plugin-injections-from-components)
- [https://greensock.com/forums/topic/35443-nuxt-3-setup-with-plugins/](https://greensock.com/forums/topic/35443-nuxt-3-setup-with-plugins/)
