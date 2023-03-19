---
title: TypeStript 入门 - 11：类型声明
author: Potter
date: 2022-11-28 22:00
tags: 
- TypeScript
categories: 
- TypeScript 入门

---

# TypeStript 入门 - 11：类型声明

## 声明全局类型

```tsx
//! 声明全局类型
declare let age: number;
declare function sum(a: string, b: string): void;
declare class Animal { };
declare const enum Seaons {
	Spring,
	Summer,
	Autumn,
	Winter
}
declare interface Person {
	name: string,
	age: number
}
//类型声明在编译的时候都会被删除，不会影响真正的代码。目的：是不用重构原有的js代码，TS能支持支持
```

## 使用第三方库，编写声明

### 通过cdn引入第三方库，比如：jquery手动编写声明

```tsx
//! 使用场景：通过cdn引入，声明全局jquery方法
declare const $: (selector: string) => {
	height(num?: number): void
	width(num?: number): void
};
//! 声明后，此时就可以调用jquery中的方法，其他库也是类似的，如果没有.d.ts文件，可这样声明一下即可避免报错
//!（注意：一般库都提供了.d.ts文件，所以不用自己手动写）
$('').height();
```

### 通过webpack 使用第三方库，比如：jQuery手动编写声明

```tsx
//! 使用场景：通过webpack 使用jQuery，进行声明
declare namespace jQuery {
	//! 注意：namespace 内的声明 无需添加declare
	function ajax(url: string, otpions: object): void;
	namespace fn {
		function extend(obj: object): void
	}
}
jQuery.ajax('/', {});
jQuery.fn.extend({});
```

### 创建类型声明文件.d.ts，将相关类型声明放到一个独立文件，这样使代码更加整洁(推荐方式)

```tsx
//! 说明：可以把jquery声明，单独放置一个单独的声明文件中jquery.d.ts
declare const $: (selector: string) => {
	height(num?: number): void
	width(num?: number): void
};

declare namespace jQuery {
	function ajax(url: string, otpions: object): void;
	namespace fn {
		function extend(obj: object): void
	}
}
```

让ts能自动识别类型声明文件，修改tsconfig.js配置

```tsx
{
	...
	"paths": { 
		"*": [ "**/*.d.ts"],
	},
	...
}
```

### ****第三方声明文件****

> 约定声明库前缀为@types，所有第三方声明的类型库都以@types/xxx开头
> 

```bash
npm install @types/jquery -S

#等安装完后,使用jquery时默认会查找node_modules/@types/jquery/index.d.ts 文件
```

**查找规范：先从package.json中types找，找不到再找node_modules/@types/jquery/index.d.ts**

1. node_modules/jquery/package.json 中的types字段
2. node_modules/jquery/index.d.ts
3. node_modules/@types/jquery/index.d.ts

