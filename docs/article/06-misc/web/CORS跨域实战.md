---
title: CORS跨域实战
author: Potter
date: 2022-06-17 16:20:50
tags: 
- cors
- 跨域
categories: 
- web

---


# CORS跨域实战

## 报错示例

[Error] Origin http://qt.e7show.com is not allowed by Access-Control-Allow-Origin.
[Error] XMLHttpRequest cannot load https://**e7show-resouce.oss-cn-shenzhen.aliyuncs.com**/template/QW_ORDER_LIST_TEMPLATE.xlsx due to **access control checks.**
[Error] Failed to load resource: Origin http://qt.e7show.com is not allowed by Access-Control-Allow-Origin. (QW_ORDER_LIST_TEMPLATE.xlsx, line 0)

## 解释

- Origin ： 访问起源 **qt.e7show.com**
- **access control checks：检查访问控制，是检查被访问域名的控制 e7show-resouce.oss-cn-shenzhen.aliyuncs.com**

## 跨域逻辑

- 域名：[a.xxx.com](https://a.xxx.com)  访问 [b.xxx.com](http://b.xxx.com) ，说明a.xxx.com 跨域访问b.xxx.com
- 如果 [b.xxx.com](http://如果b.xxx.com) 设置能允许被跨域访问，请求就会被放行，如果没有设置就会报CORS 错误
- 如果仔细思考一下就知道逻辑，当前加载的页面是无法控制别的域名访问控制的，只能控制自己的域名被访问控制

> **特别注意：跨域访问设置Access-Control-Allow-xxx 是设置的被访问的域名b.xxx.com，而不是当前发起访问的域名a.xxx.com**
> 

---

# 正确配置跨域，3个关键点（真实心得）

> 重点提示：跨域问题不在前端而在后端
> 

---

### 前端

> 请求使用到的header字段梳理并告知后端
> 

---

### 后端

### nginx：针对API 服务配置跨域，而不是Web服务

> 疑问1：nginx 其实就是转换请求，所以需要配置。
注意：Access-Control-Allow-Origin *，必须加在Nginx层，否则请求不会转换至api server 层，所以api server 层的Access-Control-Allow-Origin * 可以去掉，否则会报：
> 

```
location /secret-http-api/ {
            proxy_pass <http://127.0.0.1:3001/>;
            proxy_read_timeout 240s;
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'Content-Type,Authorization,Content-Encoding,Accept-Encoding';
            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }

```

---

### API Server (Nodejs)

```
        app.use(function (req, res, next) {
    if (req.path !== '/' && !req.path.includes('.')) {
        res.set({
            /* 允许后端发送cookie*/
            // 'Access-Control-Allow-Credentials': true,
            /*任意域名都可以访问,或者基于我请求头里面的域*/
            // 'Access-Control-Allow-Origin': '*',
            /*允许请求头字段*/
            'Access-Control-Allow-Headers': 'Accept,Content-Encoding,Content-Type,Accept-Encoding',
            /*允许请求方式*/
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
            /*预检成功后相同请求无需预检的有效时间(单位：秒)*/
            'Access-Control-Max-Age': 3600,
            /*默认与允许的文本格式json和编码格式*/
            'Content-Type': 'text/plain; charset=utf-8'
        })
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next()
});

```

# 参考文章

- [跨源资源共享](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#%E4%BB%80%E4%B9%88%E6%83%85%E5%86%B5%E4%B8%8B%E9%9C%80%E8%A6%81_cors_%EF%BC%9F)
- [Node设置cors,后端解决跨域问题](https://segmentfault.com/a/1190000022512695)
- [cors跨域之简单请求与预检请求（发送请求头带令牌token）](https://segmentfault.com/a/1190000009971254)
- [OPTIONS 方法在跨域请求（CORS）中的应用](https://blog.yiguochen.com/options-cors.html)
- [Nginx配置跨域请求 Access-Control-Allow-Origin *](https://segmentfault.com/a/1190000012550346)
