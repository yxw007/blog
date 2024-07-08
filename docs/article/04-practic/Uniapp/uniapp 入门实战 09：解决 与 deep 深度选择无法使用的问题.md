---
title: uniapp 入门实战 09：解决>>> 与 /deep/ 深度选择无法使用的问题
author: Potter
date: 2022/6/16 22:50

tags:

- UniApp

categories:

- UniApp
---

# uniapp 入门实战 09：解决>>> 与 /deep/ 深度选择无法使用的问题


## >>> 与 /deep/ 深度选择无法使用的问题

- 具体效果

  !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211025.png)

  !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211009.png)

## 解决办法

- 改用::v-deep 解决

```scss
::v-deep .tabbar {
  border-bottom: 1px solid;
}
```

## 参考文献

- **[Deep selector not working](https://forum.vuejs.org/t/deep-selector-not-working/68037)**
