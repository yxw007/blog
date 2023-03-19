---
title: VueRouter 核心原理
author: Potter
date: 2022-11-02 11:23
tags: 
- 路由
- VueRouter
categories: 
- VueRouter

---

# VueRouter 核心原理

## 核心流程

![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220417221815.jpg](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220417221815.jpg)

## 工作流程

1. 监听路由变化：
    1. **hash模式：通过window.addEventListener(hashchange) 监听hash值变化**
    2. **history模式：window.addEventListener('popstate')来监听路径变化**
2. 路由数据转换收集
    1. 创建Matcher：循环递归构建path与匹配记录收集至pathMap
3. 渲染router-view：根据当前的$route 匹配组件渲染
4. 路由跳转：
    1. 利用router.match 匹配path 对应的记录
    2. 安装history监听函数
    3. 将响应式的app._route 重新赋值为新newRoute（此时触发set→render函数，从而导致页面刷新）
        
        ```jsx
        //install.js
        Vue.util.defineReactive(this, '_route', this._router.history.current)
        ```
