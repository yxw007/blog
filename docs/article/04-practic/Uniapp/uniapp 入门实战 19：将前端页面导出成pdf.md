---
title: uniapp 入门实战 19：将前端页面导出成pdf
author: Potter
date: 2024-11-07 17:54
tags: 
- uniapp
- pdf
- html2canvas
- jsPDF
- 微信小程序

categories: 
- uniapp 入门实战

---

# uniapp 入门实战 19：将前端页面导出成pdf

---

## 背景

产品要求公司的小程序和网站需要将商品详情导出成pdf，所以今天有琢磨一下如何将前端页面导出成pdf

## 实现效果

![导出效果.gif](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1730970162288.gif)

## Web网站

> 提醒：以下代码图片地址，请自行修改一下。

- demo： 整体来说很简单，就是借助html2canvas将dom转成图片，然后jsPDF添加图片，然后保存即可

  ```html
  <!DOCTYPE html>
  <html lang="en">

  <head>
   <meta charset="UTF-8" />
   <title>title</title>
   <style>
    .btn {
     width: 300px;
     height: 100px;
    }

    img {
     width: 100%;
     object-fit: cover;
    }
   </style>
   <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
   <script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
  </head>

  <body>
   <button type="button"
       class="btn btn-primary"
       onclick="exportPdf()">导出PDF</button>
   <div id="app">
    <h1>自然石纹的纯粹之美</h1>
    <img src="https://xxx/img-0-0.png?x-oss-process=image/resize,m_fill,h_1133,w_750,limit_0,q_80"
       alt="">
    <div>
     5A全抛釉 打造高性价比空间
    </div>
   </div>

   <script type="module">
    import jsPDF from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm';

    function exportPdf() {
     let shareContent = document.getElementById('app');
     let width = shareContent.offsetWidth;
     let height = shareContent.offsetHeight;
     html2canvas(shareContent, {
      dpi: 900,
      scrolly: 0,
      // width:eleW,//生成后的宽度
      // height:eleH,//生成后的高度
      scrollx: -10,
      useCORS: true, //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
      // backgroundColor: null //避免图片有白色边框
     }).then((canvas) => {
      let context = canvas.getContext('2d');
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      let img = new Image();
      img.src = pageData;
      img.onload = () => {
       img.width = img.width;
       img.height = img.height;
       console.log(img.width, '------ img.width');
       console.log(img.height, '------img.height');
       let pdf = null;
       if (width > height) {
        // 此可以根据打印的大小进行自动调节
        // eslint-disable-next-line
        pdf = new jsPDF('l', 'mm', [width, height]);
       } else {
        // eslint-disable-next-line
        pdf = new jsPDF('p', 'mm', [width, height]);
       }
       pdf.addImage(pageData, 'jpeg', 0, 0, width, height);
       pdf.save('安全服务协议' + '.pdf');  //h5在这就可以保存pdf
      };
     }).catch((r) => {
      console.log(r);
     })
    }

    window.exportPdf = exportPdf;
   </script>
  </body>

  </html>

  ```

## 微信小程序

> 说明：公司小程序项目是用的uniapp开发的

### 方法1：通过wx.miniProgram.postMessage将pdf数据传给小程序

> 提醒：以下代码图片地址，请自行修改一下。

- h5 webview页面

  ```html
  <!DOCTYPE html>
  <html lang="en">

  <head>
   <meta charset="UTF-8" />
   <title>title</title>
   <style>
    .btn {
     width: 300px;
     height: 100px;
    }

    img {
     width: 100%;
     object-fit: cover;
    }
   </style>
   <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
   <script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
  </head>

  <body>
   <button type="button"
       class="btn btn-primary"
       onclick="exportPdf()">导出PDF</button>
   <div id="app">
    <h1>自然石纹的纯粹之美</h1>
    <img src="https://xxx/img-0-0.png?x-oss-process=image/resize,m_fill,h_1133,w_750,limit_0,q_80"
       alt="">
    <div>
     5A全抛釉 打造高性价比空间
    </div>
   </div>

   <script type="module">
    import jsPDF from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm';

    function exportPdf() {
     let shareContent = document.getElementById('app');
     let width = shareContent.offsetWidth;
     let height = shareContent.offsetHeight;
     html2canvas(shareContent, {
      dpi: 900,
      scrolly: 0,
      // width:eleW,//生成后的宽度
      // height:eleH,//生成后的高度
      scrollx: -10,
      useCORS: true, //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
      // backgroundColor: null //避免图片有白色边框
     }).then((canvas) => {
      let context = canvas.getContext('2d');
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      let img = new Image();
      img.src = pageData;
      img.onload = () => {
       img.width = img.width;
       img.height = img.height;
       console.log(img.width, '------ img.width');
       console.log(img.height, '------img.height');
       let pdf = null;
       if (width > height) {
        // 此可以根据打印的大小进行自动调节
        // eslint-disable-next-line
        pdf = new jsPDF('l', 'mm', [width, height]);
       } else {
        // eslint-disable-next-line
        pdf = new jsPDF('p', 'mm', [width, height]);
       }
       pdf.addImage(pageData, 'jpeg', 0, 0, width, height);
       pdf.save('安全服务协议' + '.pdf');  //h5在这就可以保存pdf

       wx.miniProgram.getEnv(function (res) {
        console.log("当前环境：" + JSON.stringify(res));
        if (res.miniprogram) {
         wx.miniProgram.postMessage({
          data: {
           imageData: pdf.output("datauristring"),
          }
         });
         wx.miniProgram.navigateBack({ delta: 1 })
        }
       });
      };
     }).catch((r) => {
      console.log(r);
     })
    }

    window.exportPdf = exportPdf;
   </script>
  </body>

  </html>

  ```

- uniapp 页面代码

  > 特别提醒：请将页面部署至自己的服务器下，然后修改一下地址，然后在小程序后台把部署的域名配置到web合法域名列表下，不然webview无法加载页面

  ```tsx
  <template>
   <PageLayout>
    <web-view src="https://xxx.com/pdf_test.html"
         @message="handleGetMessage"></web-view>
   </PageLayout>
  </template>

  <script>
  export default {
   data() {
    return {
     imageData: "",
    }
   },
   methods: {
    handleGetMessage(e) {
     console.log("收到webview消息:", e)
     this.imageData = e.detail.data[0].imageData
     console.log("收到webview消息: imageData=", this.imageData);
     const base64 = this.imageData.split("base64,")[1]
     console.log("收到webview消息: path=", base64);
     this.download(base64)
    },
    async download(base64) {
     base64 = base64.replace(/[\r\n]/g, "");
     const fs = wx.getFileSystemManager();
     const buffer = wx.base64ToArrayBuffer(base64);
     const filePath = wx.env.USER_DATA_PATH + "/" + Date.now() + ".pdf"
     fs.writeFile({
      filePath,
      data: buffer,
      success(res) {
       uni.openDocument({
        showMenu: true,
        fileType: "pdf",
        filePath,
        success: function (res) {
         console.log("打开文档成功")
        }
       })
      },
      fail(err) {
       console.log("错误", err)
      }
     })
    },
   },
   onLoad(e) {

   }
  }

  </script>

  <style scoped></style>

  ```

### 方法2：通过后端中转数据，然后通过导航传参（最后的备用方案）

> 补充说明：如果你碰到h5通过wx.miniProgram.postMessage发送消息，小程序死活的搜索不到消息，返回、分享都没用。解决办法：可以通过将数据保存至后端，然后再通过导航将参数传给小程序，然后再下载pdf。具体代码就罗列了，简单说下思路

1. 将h5导出的pdf传给后端，然后返回一个id
2. 通过wx.miniProgram.navigateTo({url: ‘/pages/xx/xx?id=234’})
3. 然后xx页面加载的onLoad回调中从option拿到参数后，反查后端拿pdf

## 总结

- 部署webview页面时，需要小程序后台配置合法域名，否则部分正常加载webview的页面
- web页面中用到的图片，相应的域名也要在小程序后台进行配置，配置到**request合法域名列表中，不然图片可能加载不出来**
- 小程序2个坑位，千万要注意，别掉坑里了。
  1. uniapp webview 监听postmessage的函数是message，微信小程序里面监听的方法是bindmessage（注意：千万别搞错了）
  2. postMessage发送后不是立即响应的，而是只在特点时机触发的 （[后退、组件销毁、分享触发并收到消息](https://uniapp.dcloud.net.cn/component/web-view.html#web-view)）

## 参考文献

- [**uniapp实现将页面转换成pdf（小程序、app、h5）**](https://blog.csdn.net/xiyan_yu/article/details/132496935)
- [**web-view**](https://uniapp.dcloud.net.cn/component/web-view.html#web-view)
- [**关于h5跳转到小程序的坑**](https://juejin.cn/post/7210582842359463996)
- <https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html>
