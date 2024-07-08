# uni-app 如何引入Iconfont阿里巴巴矢量图标库

---

title:  uni-app 如何引入Iconfont阿里巴巴矢量图标库
author: Potter
date: 2022-05-12 18:42

tags:

- UniApp

categories:

- 前端

...

## 步骤如下

1. 下载图标项目, 解压后效果如下
![](https://cdn.jsdelivr.net/gh/aa4790139/BlogPicBed@master/img/20201113164039.png)
2. 修改iconfont.css文件

    修改前格式：

    ```
    @font-face {font-family: "iconfont";
    src: url('iconfont.eot?t=1605254910083'); /* IE9 */
    src: url('iconfont.eot?t=1605254910083#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('data:application/x-font-woff2;charset=utf-8;base64,转换的base64内容') format('woff2'),
    url('iconfont.woff?t=1605254910083') format('woff'),
    url('iconfont.ttf?t=1605254910083') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
    url('iconfont.svg?t=1605254910083#iconfont') format('svg'); /* iOS 4.1- */
    }
    ```

    修改后格式:

    ```
    @font-face {
        font-family: "iconfont";
        src: url('data:application/x-font-woff2;charset=utf-8;base64,转换的base64内容') format('woff2');
    }
    ```

3. Copy字体文件iconfont.ttf和样式文件iconfont.css 至UniApp项目static/font目录中

---

> 以上: 如发现有问题，欢迎留言指出，我及时更正
