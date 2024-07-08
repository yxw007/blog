---
title: uniapp 入门实战 08：设置 with 为 auto，图片列表显示仍然被压缩在屏幕宽度内显示的问题
author: Potter
date: 2022/6/16 22:49

tags:

- UniApp

categories:

- UniApp
---

# uniapp 入门实战 08：设置 with 为 auto，图片列表显示仍然被压缩在屏幕宽度内显示的问题


## 问题现象

- 效果

  !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616210533.png)

- xml 文档结构(说明：把父节点 list 的 width 设置成 auto 和 100%都没有效果)

  !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616210431.png)

- 设置成大的具体值起效了

  !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616210448.png)

> 说明：单纯的 image 未能正确把父节点撑开

## 解决思路

实在看不出啥问题，就将此列表与一个正常列表对比参数，没有发现问题，唯一的区别就是用 item 包裹一层。结果一试竟然可以..（具体原因未找到，如果有知道的小伙，麻烦告诉我一下）

## 解决方法

!["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616210507.png)

最后效果
!["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616210523.png)

## 总结

- 看不出问题就直接采用对比法
