---
title: uniapp 入门实战 10：利用 css 实现文字居中在圆中心
author: Potter
date: 2022/6/16 22:50

tags:

- UniApp

categories:

- UniApp
---

# uniapp 入门实战 10：利用 css 实现文字居中在圆中心


## 实现

```scss
.circle {
  background: gold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

```scss
<div class="circle">text</div>
```

效果

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616210157.png)

## 总结

- 需要固定宽高，否则会导致文字被压扁

## 参考文献

- [https://stackoverflow.com/questions/4801181/vertically-and-horizontally-centering-text-in-circle-in-css-like-iphone-notific](https://stackoverflow.com/questions/4801181/vertically-and-horizontally-centering-text-in-circle-in-css-like-iphone-notific)
- [https://www.codegrepper.com/code-examples/css/circle+css+with+text+in+the+center](https://www.codegrepper.com/code-examples/css/circle+css+with+text+in+the+center)
