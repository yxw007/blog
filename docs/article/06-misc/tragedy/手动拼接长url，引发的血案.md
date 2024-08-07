---
title:  手动拼接长url，引发的血案
author: Potter
date: 2022-05-12 18:32

tags:

- 编程血案

categories:

- 编程血案
---

# 手动拼接长url，引发的血案


## 问题描述

小程序内嵌 webview 网站显示不正常，单独把网站地址放置浏览器正常工作

## 问题思考

肯定是网站的地址参数问题

## 断定理由

- 理由 1：网站是可以打开，只是显示不正确
- 理由 2：相同地址不同参数，一个现实正常一个现实不正常

把问题的原因告诉做内嵌网站的那个同事 A 了，结果找到一天都没有找到原因。他跟另外一个同事说：可能是我升级环境导致的问题，由 vue2 升级到 vue3 导致（无语，完全跟这无关啊）

根据与另外一个 B 同事的尝试，最后发现的问题，地址多了一个换行符导致。（额，哪里会多拼一个换行符出来了，直接调试定位到以下代码）

## 具体原因

!["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220512182400.png)

vscode 安装 prettier，自动格式化后把超过长度限制的拼接地址加了换行。

## 解决办法

!["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220512182342.png)

## 总结

- 切忌：不要纯手工手动拼接 url，直接将 url 参数转成对象，然后根据对象生成 url 参数（这也是以前的同事为了偷懒导致的问题）
