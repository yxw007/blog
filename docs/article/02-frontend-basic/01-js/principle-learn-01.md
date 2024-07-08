---
title:  响应式根基：Object.defineProperty 与 Proxy 拦截区别
author: Potter
date: 2022-05-12 18:42

tags:

- Object.defineProperty
- Proxy

categories:

- 响应式原理
---

# 响应式根基：Object.defineProperty 与 Proxy 拦截区别


---
> 假如你熟悉Vue，同时好奇心比较强，你肯定会想知道Vue是如何实现响应式的，要了解响应式原理就需要我们了解Object.defineProperty 和 Proxy 这两个API。针对这两个API编写对应的测试例子看看情况如何。

## Object.defineProperty 拦截测试
---

## 概要内容


---
---修改：对象-string类型字段，拦截测试------");
    hero.name = "吕布"
    console.log(`更改后结果：${hero.name}`);
    ```

- 输出结果：

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717175153.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717175153.png)

- 结论：**对象-普通字段修改，可以被get set拦截**

### 测试2：修改对象-数组类型字段，新增元素，拦截测试

- code：

    ```jsx
    console.log("------修改：对象-数组类型字段，新增元素，拦截测试------");
    hero.equipment.push("盔甲");
    console.log(`更改后结果： ${hero.equipment}`);
    ```

- 输出结果：

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717181404.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717181404.png)

- 结论：**对象-数组字段新增元素,可以被get拦截，无法被set拦截**

### 测试3：修改对象-添加字段，拦截测试

- code

    ```jsx
    console.log("------修改：对象-添加字段，拦截测试------");
    hero.age = 23;
    console.log(`更改后结果： ${hero.age}`);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717181932.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717181932.png)

- 结论：**对象-添加字段,无法被get set拦截**

### 测试4：修改对象-删除字段，拦截测试

- code

    ```jsx
    console.log("------修改：对象-删除字段，拦截测试------");
    delete hero.name;
    console.log(`更改后结果： ${hero.name}`);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717182115.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717182115.png)

- 结论

### 测试5：修改数组类型字段，新增元素，拦截测试

- code

    ```jsx
    Object.defineProperty(hero.equipment, 'push', {
            value() {
                console.log(`value ${this} -  ${arguments[0]}`)
                this[this.length] = arguments[0]
            }
    });

    console.log("---------------第二部分：对象-数组value拦截测试-----------------------");
    console.log("------修改：数组类型字段，新增元素，拦截测试------");
    console.log(`当前 equipment： ${hero.equipment}`);
    hero.equipment.push("盔甲");
    console.log(`新增[盔甲]后 equipment： ${hero.equipment}`);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717185253.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717185253.png)

- 结论：**可以利用value 拦截到对象-数组字段元素删减**

## Proxy拦截测试
---

### 公共代码


---
---修改：对象string类型字段，拦截测试------");
    heroProxy.name = "吕布"
    console.log(`更改后结果：${heroProxy.name}`);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717184434.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717184434.png)

- 结论：**对象-普通字段修改，可以被get set拦截**

### 测试2：修改对象数组类型字段，新增元素，拦截测试

- code

    ```jsx
    console.log("------修改：对象数组类型字段，新增元素，拦截测试------");
    heroProxy.equipment.push("盔甲");
    console.log(`更改后结果： ${heroProxy.equipment}`);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717184544.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717184544.png)

- 结论：**对象-数组字段新增元素,可以被get拦截，无法被set拦截**

### 测试3：修改对象-添加字段，拦截测试

- code

    ```jsx
    console.log("------修改：对象-添加字段，拦截测试------");
    heroProxy.age = 23;
    console.log(`更改后结果： ${heroProxy.age}`);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717184736.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717184736.png)

- 结论：**对象-添加字段,可以被set拦截**

### 测试4：修改对象-删除字段，拦截测试

- code

    ```jsx
    console.log("------修改：对象-删除字段，拦截测试------");
    delete heroProxy.name;
    console.log(`更改后结果： ${heroProxy.name}`);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717185008.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717185008.png)

- 结论：**对象-删除字段,可以被get拦截**

### 测试5：修改：对象数组类型字段

- code

    ```jsx
    let heroProxyArray = new Proxy(hero.equipment, handler);
    console.log("------修改：对象数组类型字段，新增元素，拦截测试------");
    console.log(`当前 equipment：`);
    console.log(heroProxyArray);

    heroProxyArray.push("匕首");

    console.log(`新增[匕首]后 equipment：`);
    console.log(heroProxyArray);
    ```

- 输出结果

    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717185209.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210717185209.png)

- 结论：**利用proxy 即可轻松拦截数组变化**
---

### 公共代码


> demo 源码：[vue-principle-learn](https://github.com/yxw007/vue-principle-learn/tree/master/Proxy%26Reflect)
后续我会把vue原理相关的学习资料和demo都会更新到此仓库，欢迎star收藏~

## 总结

- Object.defineProperty
  - 缺点1：只能遍历对象已存在的属性，进行get set拦截，无法针对新增、删除元素进行拦截
  - 缺点2：针对array 拦截，需要拦截push、shift、pop、unshift等，拦截操作复杂
- Proxy
  - 优势1：新增、删减字段都能轻松拦截
  - 优势2：针对array 拦截，跟object 属性get set一样拦截，无需特殊处理

...

## 参考文献

- [深入实践 ES6 Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)
- [how-to-watch-for-array-changes](https://stackoverflow.com/questions/5100376/how-to-watch-for-array-changes)
