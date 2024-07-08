---
title:  uniapp 入门实战 07：解决引入阿里巴巴字体图标，修改字体颜色无效问题
author: Potter
date: 2022-05-12 18:42

tags:

- UniApp
- canvas
- 小程序

categories:

- uniapp 入门实战
---

# uniapp 入门实战 07：解决引入阿里巴巴字体图标，修改字体颜色无效问题


---
> 由于最近新开了一个项目，在引入阿里巴巴字体图标库后，字体图标显示正常，但是怎么修改字体颜色都无效。
>

## 排查问题

> 只能逐步情况排查问题了，排查情况如下
>
- 新项目+新字体：修改字体颜色无效×
- 之前使用HbuildX构建的项目 + 之前字体：修改字体颜色正常√
- 之前使用HbuildX构建的项目 + 新字体：修改字体颜色无效×
- 新项目+老字体：修改字体颜色无效√

> 锁定问题：新下载的字体资源问题

## 解决办法

> 对比新旧项目设置，发现问题。
---

## 概要内容


![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220103151509.jpg](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220103151509.jpg)

![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220103151641.jpg](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220103151641.jpg)
