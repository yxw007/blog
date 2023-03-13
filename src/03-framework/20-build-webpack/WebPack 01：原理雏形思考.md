---

title:  WebPack 01：原理雏形思考
author: Potter
date: 2022-05-12 18:45
tags: 
- WebPack
- 原理
categories: 
- WebPack

---

## 概要内容
- 实现目标
- 实现步骤

---

<!--more-->

## 实现目标

---

- 代码如下：
    
    ```jsx
    //add.js
    export default (a, b) => a + b;
    ```
    
    ```jsx
    //index.js
    const add = require("./add.js");
    console.log("sum:" + add(1, 2));
    ```
    
    ```html
    <!-- index.html -->
    <script src="./index.js"><script>
    ```
    
- 期望：我们期望控制台打印 sum:3
- 实际：
    
    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210808165823.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210808165823.png)
    
    > 原因：Chorme 不支持file协议，推荐简单好用的方法：VSCode 安装Live Server，然后右键index.html Open With Live Server
    > 
    
    解决后输出：
    
    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210808170605.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20210808170605.png)
    

---

### 反问1：require 浏览器不认识，怎么办？

- 回答：手动require功能（输入：文件名  输出：导出内容）
- 实现：exports.default
    
    ```jsx
    var exports = {};
    (function (exports, code) {
        eval(code);
    })(exports, `var a=123;exports.default=function(a,b){return a+b}`)
    
    console.log(exports.default(1, 2));
    
    //输出结果：3
    ```
    
- 实现：require方法
    
    ```jsx
    function require(filePath) {
        var exports = {};
        (function (exports, code) {
            eval(code);
        })(exports, "exports.default = function(a,b){return a + b}");
        return exports;
    }
    
    var add = require("add.js").default;
    console.log(add(1, 2));
    
    //输出结果：3
    ```
    

### 反问2：如果让html加载完index.js 后自动运行呢 ？

- 回答：传入index.js作为入口参数，然后采用执行运行函数
- 实现：
    
    ```jsx
    (function (codeMap) {
        var exports = {};
        function require(filePath) {
            (function (exports, code) {
                eval(code);
            })(exports, codeMap[filePath])
            return exports;
        }
    
        require("index.js");
    })({
        "index.js": `var add = require("add.js").default; console.log(add(1,2));`,
        "add.js": `var a=123;exports.default=function(a,b){return a+b}`,
    })
    ```
    

## 总结

---

## 参考文献

- 

