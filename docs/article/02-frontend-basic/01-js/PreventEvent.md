# 屏蔽：键盘按键、鼠标点击事件

---

title:  屏蔽：键盘按键、鼠标点击事件
author: Potter
date: 2022-05-12 18:50

tags:

- 事件屏蔽

categories:

- H5

...

## 概要内容

- 屏蔽-键盘按键
- 屏蔽-鼠标点击
- 屏蔽-BackSpace

<!--more-->

## 屏蔽-键盘按键

```js
//添加按键监听
window.addEventListener('keydown', this.onKeyDown,true);

//移除按键监听
window.removeEventListener("keydown",this.onKeyDown,true);

onKeyDown(val){
    console.log('按下' + val.key);
    val.preventDefault();
    val.stopPropagation();
    val.cancelBubble = true;
    window.event.returnValue = false;
    window.event.preventDefault();
    window.event.stopPropagation();
    window.event.cancelBubble = true;
    return false;
}
```

## 屏蔽-鼠标点击

```js
//添加鼠标点击监听
window.addEventListener('mousedown',this.onClick,true);

//移除鼠标点击监听
window.removeEventListener('mousedown',this.onClick,true);

//which: 1-左键 2-中键 3-右键
onClick(val){
    console.error('点击' + val.which);
    return false;
}
```

## 屏蔽-BackSpace

在IE页面跳转过程中，按BackSpace退格键默认返回上此浏览页，导致路由中断引起(Vue)页面卡死，所以需要在IE中屏蔽掉BackSpce退格键，但是在输入框中则不屏蔽。

- preventBackSpce.js：

```js
export const banBackSpace = (e) => {
  let ev = e || window.event
  // 各种浏览器下获取事件对象
  let obj = ev.relatedTarget || ev.srcElement || ev.target || ev.currentTarget
  // 按下Backspace键
  if (ev.keyCode === 8) {
    // 标签名称
    let tagName = obj.nodeName.toLowerCase();
    // 如果标签不是input或者textarea则阻止Backspace
    if (tagName !== 'input' && tagName !== 'textarea') {
      return stopIt(ev)
    }
    let tagType = obj.type.toLowerCase() // 标签类型
    // input标签除了下面几种类型，全部阻止Backspace
    if (tagName === 'input' && (tagType !== 'text' && tagType !== 'textarea' && tagType !== 'password')) {
      return stopIt(ev)
    }
    // input或者textarea输入框如果不可编辑则阻止Backspace
    if ((tagName === 'input' || tagName === 'textarea') && (obj.readOnly === true || obj.disabled === true)) {
      return stopIt(ev)
    }
  }
}

function stopIt(ev) {
  if (ev.preventDefault) {
    // preventDefault()方法阻止元素发生默认的行为
    ev.preventDefault()
  }
  if (ev.returnValue) {
    // IE浏览器下用window.event.returnValue = false;实现阻止元素发生默认的行为
  }
  return false
}
```

- 使用方法：

```js
1. 在需要使用的Vue页面引入组件(一般在main.vue中添加)
import {banBackSpace} from "@/util/preventBackspace";

2. mounted 钩子函数挂载事件
document.onkeypress = banBackSpace;
document.onkeydown = banBackSpace;
```

---

> 以上: 如发现有问题，欢迎留言指出，我及时更正
