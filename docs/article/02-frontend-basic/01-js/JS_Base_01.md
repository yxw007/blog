---

title:  JS基础-01：原型了解
author: Potter
date: 2022-05-12 18:41
tags: 
- js
- 原型
categories: 
- JS基础

---

# JS基础-01：原型了解

## 概要内容

- 原型
- 总结

---

> 在接触JS之前，我工作过程中基本都是采用Java、C#、C++开发，也就是面向对象编程，对于类、继承都很熟悉，所以在构建数据结构的时候，就会下意识的采用类来定义结构，而使用JS开发的时候，创建可以通过new 方法名来创建对象，定义属性和方法放到不同位置，会出现属于类的、属于实例的还是属于原型的？这让我搞得很懵逼，面向对象结构都定义在类上，没有这么复杂，为了搞清这些概念决定仔细学习一下。
>

<!--more-->

## 原型

---

- 示例代码
    
    ```jsx
    function Parent(name){
        this.name = name;
    }
    
    let p1 = new Parent("xxx");
    
    //测试关系
    console.log("p1.constructor === Parent:" + (p1.constructor === Parent));//true
    console.log("Parent.constructor === Function:" + (Parent.constructor === Function));//true
    console.log("Function.constructor === Function:" + (Function.constructor === Function));//true
    
    console.log("Parent.__proto__ === Function.prototype:" + (Parent.__proto__ === Function.prototype));//true
    console.log("Parent.prototype.constructor === Parent:" + (Parent.prototype.constructor === Parent));//true
    
    console.log("p1.__proto__ === Parent.prototype:" + (p1.__proto__ === Parent.prototype));//true
    console.log("Parent.prototype.__proto__ === Object.prototype:" + (Parent.prototype.__proto__ === Object.prototype));//true
    console.log("Object.prototype.__proto__:" + (Object.prototype.__proto__));//null
    
    console.log("Object.prototype.constructor === Object:" + (Object.prototype.constructor === Object));//ture
    console.log("Object.constructor === Function:" + (Object.constructor === Function));//ture
    console.log("Object.prototype === Object.prototype:" + (Object.prototype === Object.prototype));//ture
    
    console.log("Object.__proto__ === Function.prototype:" + (Object.__proto__ === Function.prototype));//ture
    
    console.log("Function.__proto__ === Function.prototype:" + (Function.__proto__ === Function.prototype));//ture
    console.log("Function.prototype === Function.prototype:" + (Function.prototype === Function.prototype));//ture
    
    console.log("Function.prototype.__proto__ === Object.prototype:" + (Function.prototype.__proto__ === Object.prototype));//ture
    ```
    > 更多测试示例：[https://github.com/yxw007/H5-Learn/blob/master/js/02_Proto.js](https://github.com/yxw007/H5-Learn/blob/master/js/02_Proto.js)
    > 
    
- 图解关系：根据以上测试用例，得出一下关系图
    
    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211107203334.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211107203334.png)
    
    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211105224752.jpg](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20211105224752.jpg)
    
    
- 规则：
    - **__proto__、constructor 属性 是【对象】独有的**
    - **prototype 属性 是【函数】独有的**
    - **函数也是一种对象，所以也具有__proto__、constructor 属性**

## 总结：数据结构定义

- 实例属性：在构造方法中定义，通常用【this.名称 = 初始值】定义
    
    ```jsx
    function Animal(name){
    	this.name = name
    }
    
    //es6
    //方式1：推荐方式
    class Animal{
    	constructor(name){
    		this.name = name
    	}
    }
    
    //补充
    class Animal{
    	material="材质",  // 说明：此种方式定义的属性material 也属于实例上的
    	constructor(name){
    		this.name = name
    	}
    }
    ```
    
- 原型属性和方法：
    
    ```jsx
    
    function Animal(){
    }
    
    Animal.prototype.live= "地球"
    Animal.prototype.move = function(){}
    
    //es6
    class Animal{
    	move(){}
    	get live(){
          return "地球";
      }
    }
    ```
    ```
    
- 类上的属性和方法
    
    ```jsx
    class Animal {
    		//类上的属性和方法
        static material = "材质"
        static sex(){
            return "未知"
        }
    }
    ```
    

---

> 启发：JS 是一门动态语言，了解到原型链概念，属性和方法如果自身没有就去原型上找，如果原型上面没有就依次往上找，直到找到或者找不到。如果模块继承关系套很多层，就会产生性能问题。由此就知道为了性能，为什么前端业界大佬，都不使用面向对象编程而采用函数式编程（案例：vue2.x 的vue还采用class new出实例，vue3.x 就都采用常用函数式编程了）
> 

## 参考文献

- [对象原型](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Object_prototypes)
- [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- **[一张图搞定JS原型&原型链](https://segmentfault.com/a/1190000021232132)**

 

