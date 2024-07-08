---
title:  uniapp 入门实战 03：富文本显示
author: Potter
date: 2022-05-12 18:42

tags:

- rich-text

categories:

- uniapp 入门实战
---

# uniapp 入门实战 03：富文本显示


---
<!--more-->

## 方案一：利用rich-text的v-html属性
---

## 概要内容


```html
<template>
 <view>
   <rich-text v-html="text" :style="{color: '#818181'}"></rich-text>
 </view>
</template>
```

```jsx
export default {
 data(){
  return {
   text:`您当前有<span style="color:#E2434A;font-weight:bold;"> 3 </span>个客户`
  }
 }
}
```

## 方案二：利用rich-text的nodes参数

---

```html
<template>
 <view>
  <rich-text :nodes="nodes"></rich-text>
 </view>
</template>
```

```jsx
export default {
 data() {
  return {
   nodes: [
    {
     name: ''
    },
    {
     name: 'span',
     attrs: {
      style: 'font-size: 12px; color: #818181;'
     },
     children: [
      {
       type: 'text',
       text: '您当前有'
      }
     ]
    },
    {
     name: 'span',
     attrs: {
      style: 'font-size: 12px; color: red;'
     },
     children: [
      {
       type: 'text',
       text: '3'
      }
     ]
    },
    {
     name: 'span',
     attrs: {
      style: 'font-size: 12px; color: #818181;'
     },
     children: [
      {
       type: 'text',
       text: '个客户'
      }
     ]
    }
   ]
  };
 }
}
```

## 总结

- 使用rich-text外面需套一层view，否则会出现不显示或不生效问题

## 参考文献

- [富文本/渲染/显示/图文混排方案。rich-text、uparse、v-html的区别](https://ask.dcloud.net.cn/article/35772)
- [rich-text 文档](https://uniapp.dcloud.io/component/rich-text)
