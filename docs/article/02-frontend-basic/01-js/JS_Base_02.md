---

title:  JS基础-02：继承
author: Potter
date: 2022-05-12 18:41
tags: 
- 继承
categories: 
- JS基础

---

# JS基础-02：继承

### 概要内容
- 常用继承方式
    - 方式一：调整类型原型的 __proto__ 、 Object.setPrototypeOf 、Object.create
    - 方法二：利用自定义createObject
    - 方式三：利用ES6 Class extends
- 总结


<!--more-->


## 常用继承方式

---

### 方式一：调整类型原型的__proto__ 、 Object.setPrototypeOf 、Object.create

```jsx
function Animal(name){
        this.name = name;
        this.arr = [1,2,3];
    }

    Animal.prototype.address = {location:"山里"};

    function Tiger(name){
        this.name = name;
        this.age = 10;
        Animal.call(this,this.name);
    }
		
    Tiger.prototype.__proto__ = Animal.prototype; 
    // 等同 es7 方法：Object.setPrototypeOf(Tiger.prototype,Animal.prototype);
		// or Tiger.prototype = Object.create(Animal.prototype);

    Tiger.prototype.say = function(){
        return "说话";
    }

    let tiger = new Tiger("xxx");
    console.log(`父类实例属性：${tiger.arr}`);//父类实例属性：1,2,3
    console.log(`父类原型属性：${JSON.stringify(tiger.address)}`);//父类原型属性：{"location":"山里"}
    console.log(`子类实例属性：${tiger.age}`);//子类实例属性：10
    console.log(`子类原型属性：${tiger.say()}`);//子类原型属性：说话
```

### 方法二：利用自定义createObject

```jsx
function Animal(name){
        this.name = name;
        this.arr = [1,2,3];
    }

    Animal.prototype.address = {location:"山里"};

    function Tiger(name){
        this.name = name;
        this.age = 10;
        Animal.call(this,this.name);
    }

    function createObject(parentPrototype){
        function Fn(){}
        Fn.prototype = parentPrototype;
        return new Fn();
    }

    Tiger.prototype = createObject(Animal.prototype);
    Tiger.prototype.say = function(){
        return "说话";
    }

    let tiger = new Tiger("xxx");
    console.log(`父类实例属性：${tiger.arr}`);//父类实例属性：1,2,3
    console.log(`父类原型属性：${JSON.stringify(tiger.address)}`);//父类原型属性：{"location":"山里"}
    console.log(`子类实例属性：${tiger.age}`);//子类实例属性：10
    console.log(`子类原型属性：${tiger.say()}`);//子类原型属性：说话
```

### 方式三：利用ES6 Class extends

```jsx
class Animal {
        address = {location:"山里"};
        constructor(name){
            this.name = name;
            this.arr = [1,2,3];
        }
    }
    
    class Tiger extends Animal {
        constructor(name){
           super(name);
           this.age = 10;
        }

        say(){
            return "说话";
        }
    }

    let tiger = new Tiger("xxx");
    console.log(`父类实例属性：${tiger.arr}`);//父类实例属性：1,2,3
    console.log(`父类原型属性：${JSON.stringify(tiger.address)}`);//父类原型属性：{"location":"山里"}
    console.log(`子类实例属性：${tiger.age}`);//子类实例属性：10
    console.log(`子类原型属性：${tiger.say()}`);//子类原型属性：说话
```

## 总结

- 推荐使用es6的class来进行继承（注意：继承链不宜过长，否则会导致性能问题。更多细节：[继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)）
- 不推荐通过改变类型原型的__proto__指向的方式（兼容性不好，而且将 `__proto__` 设置为非对象的值会静默失败，不会抛出错误。更多细节：[继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)）

---

## 参考文献

- [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

