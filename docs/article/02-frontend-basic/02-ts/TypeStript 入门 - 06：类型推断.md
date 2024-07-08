---
title: TypeStript 入门 - 06：类型推断
author: Potter
date: 2022-11-26 22:00

tags:

- TypeScript

categories:

- TypeScript 入门
---

# TypeStript 入门 - 06：类型推断



## ****赋值推断****

```tsx
//!赋值时推断，类型从右像左流动,会根据赋值推断出变量类型
let str = 'dd';
let age = 11;
let boolean = true;
```

## ****返回值推断****

```tsx
//! 自动推断返回值类型
function sum(a: string, b: string) {
	return a + b;
}
let ret = sum('a', 'b');
console.log(ret);
```

## ****函数推断****

```tsx
//!函数从左到右进行推断
type Sum = (a: string, b: string) => string;
const sum: Sum = (a, b) => a + b;
```

## ****属性推断****

```tsx
//! 可以通过属性值,推断出属性的类型
	let person = {
		name: 'zf',
		age: 11
	}
	let { name, age } = person;
```

## ****类型反推****

```tsx
//! 可以使用typeof关键字反推变量的类型
	let person = {
		name: 'zf',
		age: 11
	}
	type Person = typeof person
```

## ****索引访问操作符，推断类型****

```tsx
interface IPerson {
		name: string,
		age: number,
		job: {
			address: string
		}
	}
	//! 索引访问操作符，推断类型
	type job = IPerson['job']
```

## 利用keyof 进行类型映射

```tsx
interface IPerson {
	name: string,
	age: number
}
//! 利用keyof 进行类型映射, 最终MapPerson 与 Iperson 映射后的结构和类型一模一样
type MapPerson = { [key in keyof IPerson]: IPerson[key] }
```

