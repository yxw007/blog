---
title: TypeStript 入门 - 05：类型保护
author: Potter
date: 2022-11-25 22:49
tags: 
- TypeScript
categories: 
- TypeScript 入门

---

# TypeStript 入门 - 05：类型保护


## typeof 类型保护

```tsx
function double(val: number | string) {
    if (typeof val === 'number') {
        val
    } else {
        val
    }
}
```

## instanceof类型保护

```tsx
class Cat { }
class Dog { }

//说明：clazz 拥有 new() 方法
const getInstance = (clazz: { new(): Cat | Dog }) => {
    return new clazz();
}

let r = getInstance(Cat);
if(r instanceof Cat){
    r
}else{
    r
}
```

## `in`类型保护

```tsx
interface Fish {
	swiming: string,
}

interface Bird {
	fly: string,
	leg: number
}

function isBird(animal: Fish | Bird): animal is Bird {
	return 'fly' in animal && 'leg' in animal
}

function getAniaml(animal: Fish | Bird) {
	if (isBird(animal)) {
		console.log("isBird");
	} else {
		console.log("Fish");
	}
}

getAniaml({ "swiming": "x" });
//output: Fish
```

## ****可辨识联合类型****

```tsx
interface WarningButton {
	class: 'warning'
}
interface DangerButton {
	class: 'danger'
}
function createButton(button: WarningButton | DangerButton) {
	if (button.class == 'warning') {
		console.log("Warning Button");
	} else {
		console.log("Warning Button");
	}
}
createButton({ class: 'warning' });
//output: Warning Button
```

## ****null保护****

```tsx
const addPrefix = (num?: number) => {
	num = num || 1.1;
	function prefix(fix: string) {
		//利用?.进行保护
		return fix + num?.toFixed()
	}
	return prefix('xx');
}
console.log(addPrefix());
//output: xx.1
```

## ****完整性保护****

```tsx
interface ICircle {
	kind: 'circle',
	r: number
}
interface IRant {
	kind: 'rant',
	width: number,
	height: number
}
interface ISquare {
	kind: 'square',
	width: number
}
type Area = ICircle | IRant | ISquare
const isAssertion = (obj: never) => { }
const getArea = (obj: Area) => {
	switch (obj.kind) {
		case 'circle':
			return 3.14 * obj.r ** 2
		default:
			// 不可抵达的断言保护, 此分支逻辑必须实现, 否则报错
			return isAssertion(obj);
	}
}
```
