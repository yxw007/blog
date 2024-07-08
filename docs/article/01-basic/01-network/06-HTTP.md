---
title: HTTP
author: Potter
date: 2023/02/28 21:23

tags:

- HTTP

categories:

- 计算机网络
---

# HTTP



## 特点

- 无状态
    - 通过token、cookie 可解决无状态问题
- 明文传输，不安全
- 对头阻塞
- 一个域名(应该不包括同域不同端口？)可同时建立6个TCP链接，利用此特点（并发请求）可优化http的请求速度

#### http0.9（草版）

- 优点：tcp可靠
- 特点：纯文本格式、只能使用get请求（响应之后立即关闭请求）

#### http1.0（完善版）

- 提升：
    - 引入header，可传输非文本资源
    - 增加：状态码、Post、HEAD等请求方法
- 缺点：
    - 建立连接3次握手、慢启动、对头阻塞、(断开连接未通知到客户端导致）端口占用过多、串行问题

## http1.1（优化版）

- 提升：
    - keep-alive 复用连接
    - 管线化：解决串行问题，可并发请求。
    - 1个域名可以创建多个连接（chrome 6个）：6个不够可通过使用多域名，拓展并发请求数
    - 缓存
- 缺点：
    - http队头阻塞：虽然可以并发请求，但是返回给客户端还是得串行队头依次返回，否则就会导致数据错乱（比如：请求css 返回js，请求js返回css等）
    - 纯文本，容易引发歧义（比如：大小写问题）

#### http2（优化版升级）

- 提升：
    - 使用HPack算法压缩头部，减少数据传输量
    - 运行服务器主动推送消息给客户端
    - 二进制方式传输，解决歧义问题
    - 数据传输采用多路复用，让多个请求合并在一个tcp连接内
- 缺点：
    - tcp缺点（对头阻塞）

#### http3

- 提升：
    - 基于UDP的QUIC协议，彻底解决TCP对头阻塞问题

## 安全

## Cookie

- 正常使用：path 默认为/
    
    ```jsx
    const http = require('http');
    
    const server = http.createServer((req, res) => {
    	if (req.url === '/write') {
    		res.setHeader('Set-Cookie', "name=pt;");
    		return res.end("write ok");
    	}
    
    	if (req.url === '/read') {
    		return res.end(req.headers['cookie'] ?? 'empty');
    	}
    
    	res.end("not found");
    });
    
    server.listen(3000, () => {
    	console.log("start success port:3000");
    });
    ```
    
    - [http://localhost:3000/write](http://localhost:3000/write)
        
      ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112530.png)
        
    - [http://localhost:3000/read](http://localhost:3000/read)
        
      ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112559.png)
        
    
    #### path
    
    - 示例
        
        ```jsx
        const http = require('http');
        
        /* 2. 写path */
        const server = http.createServer((req, res) => {
        
        	res.setCookie = function (name, value, options = {}) {
        		let optionsArr = [];
        		if (options.path) {
        			optionsArr.push(`path=${options.path}`)
        		}
        
        		let str = `${name} = ${value}; ${optionsArr.join('; ')} `;
        		res.setHeader('Set-Cookie', str);
        	}
        
        	//1.写/下(默认)
        	if (req.url === '/write') {
        		res.setCookie("name", "pt");
        		return res.end("write ok");
        	}
        
        	//2.写/write下
        	if (req.url === '/write/write') {
        		res.setCookie("address", "sz", { path: "/write" });
        		return res.end("write ok");
        	}
        
        	//仅能读取"/"目录下的cookie
        	if (req.url === '/read') {
        		return res.end(req.headers['cookie'] ?? 'empty');
        	}
        
        	// "/" 和 "/write" 目录下的cookie 都能读取到
        	if (req.url === '/write/read') {
        		return res.end(req.headers['cookie'] ?? 'empty');
        	}
        
        	res.end("not found");
        });
        
        server.listen(3000, () => {
        	console.log("start success port:3000");
        });
        ```
        
        ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112632.png)
        
        ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112647.png)
        

#### domain

- 示例
    
    ```jsx
    const http = require('http');
    
    /* 3. 写domain */
    const server = http.createServer((req, res) => {
    
    	res.setCookie = function (name, value, options = {}) {
    		let optionsArr = [];
    		if (options.domain) {
    			optionsArr.push(`domain=${options.domain}`)
    		}
    
    		let str = `${name} = ${value}; ${optionsArr.join('; ')} `;
    		res.setHeader('Set-Cookie', str);
    	}
    
    	if (req.url === '/write') {
    		let host = req.headers['host'];
    
    		if (host === 'a.com:3000') {
    			res.setCookie("address", "sz", { domain: ".a.com" });
    		} else if (host === 'b.a.com:3000') {
    			res.setCookie("province", "gz", { domain: ".b.a.com" });
    		} else {
    			res.setCookie("name", "pt");
    		}
    
    		return res.end("write ok");
    	}
    
    	//说明：
    	//1.a.com 只能读取a.com 下的cookie，而b.a.com 既能读取自己域名下的cookie又能读取父域名下的cookie
    	//2.不是同域下的cookie访问不到
    	//3.未设置过期，数据会一直缓存起来
    	if (req.url === '/read') {
    		return res.end(req.headers['cookie'] ?? 'empty');
    	}
    
    	res.end("not found");
    });
    
    server.listen(3000, () => {
    	console.log("start success port:3000");
    });
    ```
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112719.png)
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112738.png)
    
    > 提示：a.com、b.a.com 可直接通过本地host文件配置即可，host位置：C:\Windows\System32\drivers\etc
    > 

#### maxAage

- 示例
    
    ```jsx
    const http = require('http');
    
    /* 4. Max-Age */
    const server = http.createServer((req, res) => {
    
    	res.setCookie = function (name, value, options = {}) {
    		let optionsArr = [];
    		if (options.maxAge) {
    			optionsArr.push(`Max-Age=${options.maxAge}`)
    		}
    		if (options.expires) {
    			optionsArr.push(`expires=${options.expires}`);
    		}
    
    		let str = `${name} = ${value}; ${optionsArr.join('; ')} `;
    		console.log("cookie:", str);
    		res.setHeader('Set-Cookie', str);
    	}
    
    	if (req.url === '/write') {
    		//延迟10s
    		res.setCookie("name", "pt", { maxAge: 10 });
    		return res.end("write ok");
    	}
    
    	if (req.url === '/write-expires') {
    		let date = new Date();
    		//延迟10s
    		date.setTime(date.getTime() + 10 * 1000);
    
    		//能使用 toUTCString\toGMTString(弃用)  不能使用：toDateString、toString、toISOString
    		//utc: 协调世界时，最重要的世界标准时间。由于可能网站在不同国家使用，不能按照本地时间来算，所以为了简单统一直接采用世界标准时间算
    		res.setCookie("name", "pt", { expires: date.toUTCString() });
    		return res.end("write ok");
    	}
    
    	if (req.url === '/read') {
    		return res.end(req.headers['cookie'] ?? 'empty');
    	}
    
    	res.end("not found");
    });
    
    server.listen(3000, () => {
    	console.log("start success port:3000");
    });
    ```
    

#### httpOnly

- 示例
    
    ```jsx
    const http = require('http');
    
    /* 5. httpOnly */
    const server = http.createServer((req, res) => {
    
    	let arr = [];
    	res.setCookie = function (name, value, options = {}) {
    		let optionsArr = [];
    		if (options.httpOnly) {
    			optionsArr.push(`httpOnly=${options.httpOnly}`)
    		}
    
    		let str = `${name} = ${value}; ${optionsArr.join('; ')} `;
    		arr.push(str);
    		console.log("cookie:", arr);
    		res.setHeader('Set-Cookie', arr);
    	}
    
    	if (req.url === '/write') {
    		//说明：设置成httpOnly后，前端就无法通过代码获取（目的：为了信息安全）
    		res.setCookie("name", "pt", { httpOnly: true });
    		res.setCookie("address", "sz");
    		return res.end("write ok");
    	}
    
    	if (req.url === '/read') {
    		return res.end(req.headers['cookie'] ?? 'empty');
    	}
    
    	res.end("not found");
    });
    
    server.listen(3000, () => {
    	console.log("start success port:3000");
    });
    ```
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112752.jpg)
    

#### signed

- 示例
    
    ```jsx
    const http = require('http');
    const { createHmac } = require('crypto');
    const secretKey = "123";
    const qs = require("querystring");
    
    function sign(item) {
    	//说明：不能用base64，需要改用base64url，[+,/,=] 转成url规范字符
    	return createHmac('sha256', secretKey).update(JSON.stringify(item)).digest("base64url");
    }
    
    /* 6. sign */
    const server = http.createServer((req, res) => {
    
    	let arr = [];
    	res.setCookie = function (name, value, options = {}) {
    		let optionsArr = [];
    
    		if (options.signed) {
    			let signValue = sign(`${name}=${value}`);
    			console.log(`signValue:${signValue}`);
    
    			arr.push(`${name}.sign=${signValue}`)
    		}
    
    		let str = `${name} = ${value}; ${optionsArr.join('; ')} `;
    		arr.push(str);
    		console.log("cookie:", arr);
    
    		res.setHeader('Set-Cookie', arr);
    	}
    
    	res.getCookie = function (name, options = {}) {
    		let cookie = req.headers.cookie;
    		//! 说明：将a=b; c=d 用"; "分割拆成对象形式, 变成{a:b,c:d}形式方便使用
    		let cookieObj = qs.parse(cookie, '; ');
    		console.log("cookieObj:", cookieObj);
    
    		let value = cookieObj[name];
    
    		if (options.signed && value) {
    			//! 说明：判断之前的signValue和新生成的signValue是否一样，如果一样说明没有被篡改，否则就是被篡改后的
    			let signPreValue = cookieObj[`${name}.sign`];
    			let signNewValue = sign(`${name}=${value}`);
    			console.log("signPreValue:", signPreValue);
    			console.log("signNewValue:", signNewValue);
    
    			if (signPreValue === signNewValue) {
    				return cookieObj[name] ?? "empty";
    			} else {
    				return `invalid cookie name:${name} !`
    			}
    		} else {
    			return value ?? "empty";
    		}
    	}
    
    	if (req.url === '/write') {
    		res.setCookie("name", "pt", { signed: true });
    		return res.end("write ok");
    	}
    
    	if (req.url === '/read') {
    		let ret = res.getCookie('name', { signed: true }) ?? "empty"
    		return res.end(ret);
    	}
    
    	res.end("not found");
    });
    
    server.listen(3000, () => {
    	console.log("start success port:3000");
    });
    ```
    

## Http 数据格式

- 请求数据结构
    
		![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112830.png)
    
- 响应数据结构
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112841.png)
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313112849.png)
    

## 参考文献

- [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString)
- [https://www.w3school.com.cn/tags/html_ref_urlencode.asp](https://www.w3school.com.cn/tags/html_ref_urlencode.asp)
- [https://tool.ip138.com/ascii_code/](https://tool.ip138.com/ascii_code/)
- [https://www.zhihu.com/question/24474922](https://www.zhihu.com/question/24474922)
