---

title:  响应式核心原理
author: Potter
date: 2022-05-12 18:42
tags: 
- Proxy
- watchEffect
- dep
- Reflect
categories: 
- 响应式原理

---

# 响应式核心原理

### 概要内容
- 核心原理：流转图
- 流转步骤：讲解&疑问解答

---

> 由于Vue3 Reactive源码涉及的代码较多，给初学者学习带来一定的门槛，所以尤大讲解的最核心的响应式demo来讲解响应式核心原理实现

<!--more-->

## 核心原理-流转图

---

![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210726223603.jpg](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210726223603.jpg)

### 流转步骤讲解

- 第1步：利用Proxy 封装代理响应式对象
- 第2步：巧妙利用Javascript是单线程执行特性，用watchEffect包装一层调用，让activeUpdate暂存匿名函数。
- 第3步：执行匿名函数，让匿名函数访问到的对象属性，触发对象的get 拦截
- 第4、5、6步：get拦截到的属性访问，创建依赖跟踪对象dep，然后利用dep搜集依赖匿名函数
- 第7、8步：set拦截到属性设置，获取属性对应的依赖对象dep，然后调用之前搜集的依赖匿名函数

---

### 疑问解答：

- 为啥要用proxy拦截? ( 请阅读：[响应式根基：Object.defineProperty 与 Proxy 拦截区别](https://yanxuewen.cn/2021/07/17/principle-learn-01/) )
- 为啥要用WeakMap？
    - 原因：可被垃圾回收器自动回收，而Map不会被垃圾回收器自动回收，需要手动清理。否则会造成内存泄漏
- 为啥要用Reflect获取对象属性和设置对象属性？
    - 原因1：保证不管存不存在原型链继承，都能保存操作正确。
    - 原因2：语义更明确，避免异常抛出等

---

## 总结

- watchEffect : 暂存当前匿名函数
- proxy：对象访问拦截
- dep：依赖收集

> demo 源码：[vue-principle-learn](https://github.com/yxw007/vue-principle-learn/blob/master/vue-3-min/reactivity/reactivity.html)

> 为了方便记牢响应式原理，记住这3个角色便于以后快速回忆起响应式原理。

---

## 参考文献

- [【课程】Vue 3 Deep Dive with Evan You 【中英字幕】- Vue Mastery](https://www.bilibili.com/video/BV1rC4y187Vw)

