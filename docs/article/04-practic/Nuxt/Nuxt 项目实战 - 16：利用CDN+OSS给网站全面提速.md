---
title: Nuxt 项目实战 - 16：利用CDN+OSS给网站全面提速
author: Potter
date: 2024-07-04 09:47

tags:

- Nuxt.js
- CDN
- OSS
- 性能优化

categories:

- Nuxt 项目实战
---

# Nuxt 项目实战 - 16：利用CDN+OSS给网站全面提速


## 背景

我面试过一些前端同学，同时也看到网上很多前端同学说可以利用CDN加速，提高网站的访问速度，具体如何搞？具体如何配置？估计很多前端都是不知道的，一方面权限所限，另一方面可能只是知道可以利用CDN加速网站，具体如何搞完全不知道，其实我也不太清楚😅。现在我有权限操作打算好好实践一番，让CDN好好给我开发的Nuxt网站提提速。🥰

## 创建和配置OSS Bucket

![xx](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720150025426.jpg)

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163991545.jpg)

> 注意：读写权限写成私有，避免被别人盗用，其他就按提示填就可以了

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163993380.jpg)

> 提示：记住这个OSS域名，方便后续配置CDN加速域名，需要让加速域名通过CNAME解析到这个OSS域名

## 创建CDN加速域名

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163994875.jpg)

> 提示：建议创建一个二级域名，类型设置成CNAME，记录值就填成上一步OSS对外公开的域名

## 上传CDN加速域名证书

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720150026781.png)

> 说明：点击证书管理，上传你的CDN域名证书。

## 完善OSS Bucket配置

点击绑定域名配置，即可以看到域名转发调用过程，如下图所示：

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163995930.png)

点击Bucket授权策略，点击授权，否则会导致无权访问Bucket上的资源
![alt text](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163996665.png)

开启TSL并配置TSL启用的版本，如下图所示：
![alt text](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163997625.png)

开启防盗链，避免其他人引用咋们网站的静态资源（），如下图所示：
![alt text](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720150027733.png)

> 提示：为了避免中途出错，建议先不开启，等整个流程验证走通后再开启，避免问题太多搞不清具体哪步配的有问题。

## 配置CDN域名，域名管理配置

> 提示：刚开始进入会有提示，可以先使用推荐配置，然后再调整

缓存配置->配置节点响应头，避免网站访问cdn资源时报跨域错误，如下图所示：
![alt text](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163998402.png)

> 说明：Access-Control-Allow-Origin 先配置成\*，等流程跑通后再调整成你运行访问的域名。其他配置就根据自己的需求来配置。

缓存配置->性能优化，如下图所示：
![alt text](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720163999669.png)

## Nuxt项目配置CDN

nuxt.config.ts配置cdn域名，如下图所示：
![alt text](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720164000433.png)

> 说明：如果你是将nuxt打包后前端静态资源public（提示：nuxt build后，会生成.output目录，至需要把.output/public里面的资源上传就可以了，不要一股脑的把所有资源都上传至OSS）直接上传至你创建OSS Bucket的根目录下的话，此处就直接填CDN加速域名即可。我这么配置的原因是可以动态控制是否使用CDN加速，比如：我测试环境不需要CDN加速，生成环境才需要CDN加速，而且我不想仅将打包后的前端静态资源放置在Bucket根目录下，所以我就动态根据环境加了一个前端，这样后面Bucket可以用于存其他东西，不至于仅存前端网站静态资源，添加前缀就相对比较灵活。

## 将打包产物上传OSSt，验证效果

优化前
![alt text](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720165435113.jpg)

优化后

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1720164001163.jpg)

## 总结

- CDN加速可以明显提高网站访问速度，减少服务器带宽压力，提高用户体验

为了提高网站访问速度，提升用户体验，大家赶快去试试吧~ 😄

## 参考文章

- [使用阿里云OSS+CDN部署前端页面与加速静态资源](https://www.jianshu.com/p/c001ac7cdf21)
- [教程示例：通过静态网站托管部署单页应用](https://help.aliyun.com/zh/oss/user-guide/tutorial-use-static-website-hosting-to-build-a-single-page-application)
