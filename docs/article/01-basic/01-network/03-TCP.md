# TCP

---

title: TCP
author: Potter
date: 2022/08/08 19:40

tags:

- TCP

categories:

- 计算机网络


...


![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20230312222944.png)

## 名词解释：

- Seq：序列（sequence）
- Ack：应答信号（acknowledgment）
- Sync：握手
- PSH：推送数据
- FIN：完成断开(挥手)

> TCP数据包结构
> 	![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20230312224531.png)
    

## 建立连接：3次握手

### 指令标识

- 抓包结果
    
    ![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220807161123.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220807161123.png)
    
- 图解过程
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20230312224647.jpg)
    
    解释
    
    - 从Seq=0开始
    - 响应过程：本次Seq=上次Ack（没有就是0），本次Ack = 上次seq + 1

### 通俗表述

1. 快递员→你 : 有你的快递，请问在家吗?
2. 你→快递员：在家，送过来吧
3. 快递员→你：好的

## 连接中：数据传输

- 抓包
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20230312224745.png)
    
- 图解过程
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20230312224835.jpeg)
    
    解释
    
    - 从Seq=1，ack=1 开始
    - 响应过程：本次Seq=上次Ack，本次Ack = 上次seq + 上次Len

## 断开连接：4次挥手

### 指令表述

- 抓包
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20230312225139.png)
    
- 图解
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20230312225208.jpg)
    
    解释
    
    - 假设从Seq=1，Ack=1 开始（连接后未传送数据）
    - 响应过程：本次Seq=上次Ack，本次Ack = 上次Seq + 1（实际不管从Seq和ACK到多少也是遵从这个逻辑）
    

> 确认过程：都是Ack = 上次Seq + 1（如果是传送中就是+Len），Seq = 上次Ack
> 

### 通俗表述

1. 男→女：我们分手吧？
2. 女→男：好，等下我把你以前的东西都找出来给你
3. 女→男：你的东西都给你了，再见
4. 男→女：再见

## TCP 特点

缺点：

1. 对头阻塞
2. 客户端大量端口被占用：服务端最后的ack未给到客户端
3. 慢启动
4. 粘包

优点：

1. 实时性好

1. 滑动窗口，对头阻塞（可靠，能保证顺序）
    1. 通过窗口大小，进行拥塞控制
2. 有发送和接收缓存区
3. 粘包：（流量控制）
    1. ****[Nagle 算法 && CORK算法](https://www.cnblogs.com/tangr206/articles/3115586.html)****

## 参考文献

- ****[Nagle 算法 && CORK算法](https://www.cnblogs.com/tangr206/articles/3115586.html)****
