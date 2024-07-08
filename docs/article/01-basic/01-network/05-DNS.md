# DNS

---

title: DNS
author: Potter
date: 2022/08/05 21:25

tags:

- 计算机网络
- DNS

categories:

- 计算机网络


...


## dig 指定DNS 查询特定域名IP

> 提示：****[How to Install Dig on Windows](https://phoenixnap.com/kb/dig-windows)****
> 
- 用法
    
    ```bash
    dig @[dns server ip] [domain name]
    
    //example
    //dig @1.1.1.1 google.com
    ```
    
- 示例
    
	![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313111513.png)
    

## 域名树状结构

- 图示
    
  ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313111529.png)
    
- 根域名：所有域名的起点
- 顶级域名：根域名的下一级域名，分成两种：通用顶级域名（.com、.net）和国别顶级域名（.cn、.us）
- 一级域名：顶级域名的下一级域名。比如：google.com
- 二级域名：一级域名的下一级域名，域名拥有者可自行设置。比如：news.google.com

## 域名查询IP

域名查询ip是逐级查询的，**只有上级域名，才知道下一级域名的 IP 地址**

比如：查询二级域名news.google.com的ip

- 第一步：查询根域名服务器，获得顶级域名服务器(.com)ip地址
- 第二步：根据顶级域名服务器，获取一级域名服务器(google.com)IP地址
- 第三步：根据一级域名服务器，获取二级域名服务器(news.google.com)IP地址

## DNS服务器种类

- 1.1.1.1（递归DNS服务器）
- 根域名服务器
- 顶级域名(TLD)服务器
- 一级域名服务器（权威域名服务器）

### 递归DNS服务器

比如：1.1.1.1 直接自动递归查下域名ip，无需手动逐级查询获得ip

- 示例
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313111547.png)
    

### 权威DNS服务器

一级域名服务器，正式名称：权威域名服务器（Authoritative Name Server）

"权威"的意思是域名的 IP 地址由它给定，不像递归服务器自己做不了主。我们购买域名后，设置 DNS 服务器就是在设置该域名的权威服务器

## 四种服务器的关系

- 图示
	![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230313111606.png)
    

## 参考文献

- ****[How to Install Dig on Windows](https://phoenixnap.com/kb/dig-windows)****
- [http://www.ruanyifeng.com/blog/2022/08/dns-query.html](http://www.ruanyifeng.com/blog/2022/08/dns-query.html)
