---
title:  TypeScript 入门 - 02：基本语法
author: Potter
date: 2022-05-12 18:49

tags:

- TypeScript

categories:

- TypeScript 入门
---

# TypeScript 入门 - 02：基本语法


---
## 接口

### 接口继承接口

- 理解：类似Java中的接口，继承接口相当于是继承接口中的东西至另外一个类或接口中。
- 示例：

    ```tsx
    interface Shape {
      color: string;
    }
    
    interface Square extends Shape {
      sideLength: number;
    }
    
    let square = <Square>{};
    square.color = "blue";
    square.sideLength = 10;
    console.log(JSON.stringify(square));
    ```

- 输出：

    ```tsx
    {"color":"blue","sideLength":10}
    ```
---

## 基础类型


---
### 判断东西是原型上的还是实例上的

```markdown
名称: 函数    
代表实例上的

名称():返回值   
代表原型上的

看名称后带：, 还是带()
```

## 函数

### 可选参数

- 只能放到必选函数后面

```tsx
function buildName(firstName: string, lastName? : string) {
  if (lastName)
    return firstName + " " + lastName;
  else
    return firstName;
}

let result3 = buildName("Bob", "123"); 
```

### 默认参数

- 可自动推动数据类型
- 不要求放至必选参数后面

```tsx
function buildName(firstName: string, lastName = "smith") {
  if (lastName)
    return firstName + " " + lastName;
  else
    return firstName;
}

let result3 = buildName("Bob", 123); //第2个参数只能传string 类型, 否则报错：Argument of type 'number' is not assignable to parameter of type 'string'
```

### 剩余参数

- 使用"..."可传递任意个参数

```tsx
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

### 函数重载

- 优先把精准的重载函数放置最前面

```tsx
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```
---

### 接口继承类


---
## 枚举

### 数字枚举

- 理解
  - 枚举成员可赋值为一个函数值返回值，C# 不允许
  - 枚举成员赋值为函数返回值时，后面不能放未直接放置的成员
- 示例

    ```tsx
    enum E {
      A = getSomeValue(),
      B = 2, // 说明：如果不初始化赋值, 否则就报：error! 'A' is not constant-initialized, so 'B' needs an initializer
    }
    
    function getSomeValue(): number {
      return 1;
    }
    ```

### 字符串枚举

- 理解：每一个枚举成员，必须使用字符串或使用其他枚举成员初始化，C# 不允许这么写。
- 示例：

    ```tsx
    enum Direction {
      Up = "UP",
      Down = "DOWN",
      Left = "LEFT",
      Right = Left,//说明：被使用的的枚举成员必须放到初始化枚举成员前面才行
    }
    ```

### 反向映射

- 理解：Enum[A] 可获取枚举成员名
- 实例：

    ```tsx
    enum Enum {
      A
    }
    let enum1 = Enum.A;
    let nameOfA = Enum[enum1]; // "A"
    ```

### const 枚举

- 理解：枚举成员名称不能通过Enum[A]获取，因为编译const枚举后会变成常量数组把名称都丢弃，所以就访问不了。
- 示例：

    ```tsx
    const enum Directions {
        Up,
        Down,
        Left,
        Right
    }
    let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
    ```

    编译后结果

    ```tsx
    var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
    ```

## 外部枚举

- 理解：
- 示例：

    ```tsx
    declare enum Enum {
        A = 1,
        B,
        C = 2
    }
    ```
---

## 泛型


---
-------------------------------------------------------------------
---

## 类型兼容性

        // src/test.ts
        import NumberValidator from './NumberValidator';
        let numberValidator = new NumberValidator();
        console.log(numberValidator.isAcceptable("123"));  //输出：true
        console.log(numberValidator.isAcceptable("1a"));   //输出：false
        ```

  - 理解3:  需要大量的导出内容，请使用命名空间
  - 示例：

        ```tsx
        // MyLargeModule.ts
        export class Dog { ... }
        export class Cat { ... }
        export class Tree { ... }
        export class Flower { ... }
        
        //test.ts
        import * as myLargeModule from "./MyLargeModule.ts";
        let x = new myLargeModule.Dog();
        ```

  - 理解4: 模块内不要使用命名空间
- 外部模块
  - 理解：外部模块类似C++中的外部模块头文件,  声明内容放置.d.ts 文件中
  - 示例：

        ```tsx
        /* 声明：外部模块文件src/node.d.ts */
        declare module "path" {
            export function normalize(p: string): string;
            export function join(...paths: any[]): string;
            export let sep: string;
        }
        //-------------------------------------------------------------------------
        /* 使用：外部模块 src/test.ts */
        // 1. 引用外部模块声明文件路径 + 引入外部模块
        /// <reference path="node.d.ts"/>
        import * as Path from "path";
        // 2. 使用
        let joinPath = Path.join("ab", "cd");
        console.log("joinPath=" + joinPath); //输出：ab\cd
        ```

- 模块声明通配符：
  - 理解：未理解啥意思
  - 示例1：

        ```tsx
        /* 声明：外部模块文件src/node.d.ts */
        declare module "*!text" {
            const content: string;
            export default content;
        }
     //-------------------------------------------------------------------------
        /// <reference path="node.d.ts"/>
        import fileContent from "./xyz.txt!text"; //报错：Cannot find module './xyz.txt!text'
        console.log(fileContent);
        ```

    - 示例2：

        ```tsx
        /* 声明：外部模块文件src/node.d.ts */
        declare module "json!*" {
            const value: any;
            export default value;
        }
        
        /// <reference path="node.d.ts"/>
        import urlJson from "json!http://e7show-test.oss-cn-shenzhen.aliyuncs.com/Temp/test.json"; //报错：Cannot find module 'json!http://e7show-test.oss-cn-shenzhen.aliyuncs.com/Temp/test.json'
        console.log(urlJson);
        ```

- UMD模块
  - 示例

        ```tsx
        //math-lib.d.ts
        export function isPrime(x: number): boolean;
        export as namespace mathLib;
        
        //test.ts
        import { isPrime } from "math-lib";
        isPrime(2);
        mathLib.isPrime(2); // 错误: 不能在模块内使用全局定义。
        ```

- **危险信号**
  - 重新检查以确保没有在对模块使用命名空间
  - 文件的顶层声明是`export namespace Foo { ... }` （删除`Foo`并把所有内容向上层移动一层）
  - 文件只有一个`export class`或`export function` （考虑使用`export default`）
  - 多个文件的顶层具有同样的`export namespace Foo {` （不要以为这些会合并到一个`Foo`中！）

## 命名空间

- 理解1：类似C#和C++中的namespace
- 理解2：引用外部命名空间请将引用的外部命名空间代码namespace 前加declare，然后包裹外部接口
- 示例：

    ```tsx
    declare namespace D3 {
        export interface Selectors {
            select: {
                (selector: string): Selection;
                (element: EventTarget): Selection;
            };
        }
    
        export interface Event {
            x: number;
            y: number;
        }
    
        export interface Base extends Selectors {
            event: Event;
        }
    }
    
    declare var d3: D3.Base;
    ```

## 补充知识

### Type和interface区别

1. type 可以使用联合类型，interface 不可以(type 适合复杂类型联合使用)

    ```tsx
    interface IModel {
        (arg: string): string
    }
    
    type TModel1 = ((arg: string) => string);
    
    //说明：单一函数签名,interface和type 可以互换, IModel 换成TModel1 也是可以的
    const model: IModel = (arg: string): string => "123";
    
    //说明：针对 type 联合类型，interface 就做不到了
    type TModel = ((arg: string) => string) | ((arg1: number, arg2: string) => number);
    ```

2. interface 不能使用in 关键词

    ```markdown
    
    ```

    ```tsx
    class Cat {
        constructor(public name: number, public age: number) {
        }
    }
    
    class Dog {
        constructor(public name: number) {
        }
    }
    
    type Tp = new (...args: any[]) => any
    
    function instance<T extends Tp>(name: string, age?: number) {
        // if (T instanceof Dog) {
        //     return new T(name);
        // } else {
        //     return new T(name, age)
        // }
    }
    
    //说明：不能这么创建
    let s = instance<Dog>();
    
    type TSon = (val: string | number | boolean) => string | number;
    type TParent = (valu: string | number | boolean | null) => string;
    
    function fun(cb: TSon) {
        cb("123");
    }
    
    fun((val: TParent) => "123");
    ```

### 兼容性

    - 总结原则：
        - 声明：满足我需要的约定规则即可，否则报错
        - 使用：在我约定的范围内操作即可，否则报错
        - 赋值：满足协议规则就通过，否则就报错。
        - 函数参数个数：只能在规定的范围活动，超出边界个数就报错
        - 联合类型：
            - 取值：只能取限定值
            - 赋值：必须满足声明的条件，才能赋值
    - 联合类型兼容

        ```tsx
        
        let n1!: string | number;
        let n2!: string | number | boolean;
        
        //n2 = n1;  √ n1 满足n2 规定字段范围
        //n1 = n2;  × n2 不满足n1 约定规则范围,多出来了boolean
        ```

    - 对象类型兼容

        ```tsx
        let obj1!: {
            color: string
        };
        let obj12!: {
            color: string,
          name: string
        };
        
        // obj1= obj2; √ 满足obj1 约定规则必有字段
        // obj2= obj1; × 不满足obj2 约定规则必有字段,缺少name字段
        ```

    - 函数参数兼容

        ```tsx
        let fn1!: (a: string, b: string) => string;
        let fn2!: (a: string, b: string, c: string) => string;
        
        // fn2 = fn1; √ 满足fn2 约定函数参数规则,可以少传参数
        // fn1 = fn2; × 不满足fn1约定函数参数规则,不能多传参数
        ```

    - 函数返回值类型兼容

        ```tsx
        let fn3!: (a: string, b: string) => string | number | boolean;
        let fn4!: (a: string, b: string) => string;
        
        // fn3 = fn4; √ 满足fn3 规定字段类型范围
        // fn4 = fn3; × 不满足fn4 规定字段类型范围, 多出来了boolean
        ```

    - 函数兼容： 传父返子,  可转成下面的方式理解

        ```tsx
        type IType = (val: string | number | boolean) => string | number;
        
        //特别注意：形参按对象规则来理解, 也就是必须满足cb:TSon 规则定义的范围即可
        function fun(cb: IType ) {
           //满足TSson定义的参数类型规则 和 返回值类型规则即可
            cb("");
        }
        
        // √ 满足Tson 规定的形参字段的类型范围,多出来的不管
        // fun((valu: string | number | boolean | null) => "123"); 
        
        // × 不满足Tson 规定的形参字段的类型范围,缺少boolean类型
        // fun((valu: string | number) => "123"); 
        ```

        ```tsx
        interface IF1 {
            (val: string | number | boolean): string | number;
        }
        
        interface IF2 {
            (val: string | number | boolean | null): string | number;
        }
        
        let if1!: IF1;
        let if2!: IF2;
        
        if1 = if2; // √ if2 满足if1 参数类型规定必须的范围,多出来的不管
        if2 = if1; // × if1 满足if2 参数类型规定必须的范围,缺少null
        ```
