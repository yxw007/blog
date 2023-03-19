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

## 基础类型

### 类型断言

- 类型断言：好比其它语言里的类型转换，但是不进行特殊的数据检查和解构
- 类型断言形式：
    - "尖括号”语法
        
        ```tsx
        let someValue: any = "this is a string";
        
        let strLength: number = (<string>someValue).length;
        ```
        
    - as语法
        
        ```tsx
        let someValue: any = "this is a string";
        
        let strLength: number = (someValue as string).length;
        ```
        

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

### 接口继承类

- 理解1：接口继承类，会继承类中的成员，但不会继承行为实现
    
    ```tsx
    class Control {
      private state: any = "state";
    }
    
    interface SelectableControl extends Control {
      select(): void ;
    }
    
    class Button extends Control implements SelectableControl {
      select() { }
    }
    
    //错误：“Image”类型缺少“state”属性。
    class Image implements SelectableControl {
      select() { }
    }
    ```
    
- 理解2：类继承类，子类也能访问到 private 成员
    
    ```tsx
    let button = new Button();
    console.log(button.state); //输出：state
    ```
    

## 类

### readonly修饰符

- 理解：readonly 就是标识为只读
- 示例：
    
    ```tsx
    class Octopus {
    	readonly name：string;
      readonly numberOfLegs: number = 8;
      constructor(theName: string) {
    		this.name = theName;
      }
    }
    
    let dad = new Octopus("Man with the 8 strong legs");
    // dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
    console.log(dad.name);
    ```
    
    - 简化：将私有成员name挪至构造函数中，可修改至如下样子。
    
    ```tsx
    class Octopus {
      readonly numberOfLegs: number = 8;
      constructor(readonly name: string) {
      }
    }
    ```
    

### 存储器

- 理解：类似C# 的属性，比如：get set
    
    ```tsx
    let passcode = "secret passcode";
    class Employee {
        private _fullName: string;
        
        get fullName(): string {
            return this._fullName;
        }
    
        set fullName(newName: string) {
            if (passcode && passcode == "secret passcode") {
                this._fullName = newName;
            }
            else {
                console.log("Error: Unauthorized update of employee!");
            }
        }
    }
    let employee = new Employee();
    employee.fullName = "Bob Smith";
    ```
    

### 静态属性

- 理解：
    - 类成员不适用访问修饰符，默认为public
    - TypeScript 类中调用类静态属性，必须带上类名。而C#不需要
    - 类静态成员变量，不属于类示例成员（调试即可看到），而C#实例也可直接调用
- 示例：
    
    ```tsx
    class ClassA {
      static origin: number = 100;
      name: string;
      constructor(name: string) {
        this.name = name;
      }
      add(num: number): void {
        ClassA.origin += num; //说明：此处必须带上类名ClassA, 否则报: Uncaught ReferenceError: origin is not defined
      }
    }
    
    let classA = new ClassA("classA");
    classA.add(1);
    console.log(classA.name);
    console.log(ClassA.origin);
    ```
    

### 类可以当做接口使用

- 理解：
    - 类可以当做接口使用，C# 不可以
    - 类如果有函数，赋值是也是需要满足接口约束，否则会报错
- 示例：
    
    ```tsx
    class Point {
        x: number;
        y: number;
    		value(): string {
    	    return `x=${this.x},y=${this.y}`;
    	  }
    }
    
    interface Point3d extends Point {
        z: number;
    }
    
    let point3d: Point3d = { x: 1, y: 2, z: 3, value: function () { return "123"; } };
    ```
    

### 类保持接口中的契约即可使用

- 理解：类Person缺少Named interface中任何一项锲约都会报错，C#和Java 是不允许的

```tsx
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
p = new Person();
```

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

### 剩余参数：

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

## 泛型

### 泛型约束

- 理解：使用 extends  约束参数类型，类似C#中的where
- 示例
    
    ```tsx
    interface Lengthwise {
      length: number;
    }
    
    function loggingIdentity<T extends Lengthwise>(arg: T): T {
      console.log(arg.length);  // Now we know it has a .length property, so no more error
      return arg;
    }
    console.log(loggingIdentity("22"));
    ```
    

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

## 类型兼容性

### 比较两个函数

- 理解：
    - 被赋值函数y参数个数并对应类型+返回指类型，必须全部包含x赋值函数的参数个数并对应类型，才可进行赋值。否则就会函数签名不一致，导致报错
- 示例：

```tsx
let x = (a: number): string => {
  return "";
};
let y = (b: number, s: string): number => {
  return 0;
};

y = x; // Erro
x = y; // Error
```

### 枚举

- 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的
- 示例：
    
    ```tsx
    enum Status { Ready, Waiting };
    enum Color { Red, Blue, Green };
    
    let status = Status.Ready;
    status = Color.Green;  // Error
    ```
    

### 类

- 理解：两个实例对象比较，静态成员与构造函数不在比较范围。
- 示例：
    
    ```tsx
    class Animal {
        feet: number;
        constructor(name: string, numFeet: number) { }
    }
    
    class Size {
        feet: number;
        constructor(numFeet2: number) { }
    }
    
    let a: Animal;
    let s: Size;
    
    a = s;  // OK
    s = a;  // OK
    ```
    

### 泛型

```tsx
//泛型接口契约T未使用，所以x、y可以互相赋值
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // OK, because y matches structure of x
```

```tsx
//泛型接口契约T设计具体成员类型, 所以x=y报错
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // Error, because x and y are not compatible
```

## 模块

- 内部模块
    - 理解1：内部模块，1.5术语更改为命名空间
    - 理解2：尽可能地在顶层导出，避免上层使用多一层命令空间名称带来的繁琐
    - 示例：
        
        ```tsx
        // src/NumberValidator.ts
        const numberRegexp = /^[0-9]+$/;
        export default class NumberValidator {
            isAcceptable(s: string) {
                return s.length > 0 && numberRegexp.test(s);
            }
        }
        //-------------------------------------------------------------------------
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
    

## 补充知识：

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
