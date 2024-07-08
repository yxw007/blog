# 解决XMLHttpRequest发送formData，java后端无法正确拿到数据问题

---

title: 解决XMLHttpRequest发送formData，java后端无法正确拿到数据问题
author: Potter
date: 2022-04-23 16:21:03

tags:

- 乱码

categories:

- web

...

## 故事背景

购物车清单导出至邮箱，由于之前是用客户端做的，现在需要前端也实现这一个功能。具体功能其实就是：一个请求同时传递参数（邮箱、文件名等）+ 清单文件

接下来抓包看客户端的请求数据

## 正常请求WebForm内容

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240108161310.png)

看到如上抓包信息，立马想到其实就是一个http请求，只是数据通过formData传过去的

## 示例代码

```bash
const xhr = new XMLHttpRequest();
 xhr.responseType = "json";

 xhr.setRequestHeader("Content-Type", "multipart/form-data");

 const formData = new FormData();
 formData.append("mail_address", email);
 formData.append("design_name", fileName);
 formData.append("ext", ".xlsx");
 formData.append("token", token);
 formData.append("file", new Blob([buffer]), "file.dat");

 xhr.onload = function () {
  const res = xhr.response;
  if (res?.status === 0) {
   callback(true);
  } else {
   callback(false, res?.info);
  }
 };

 xhr.onerror = function error(e) {
  callback(false, e);
 };

 xhr.open("post", url);
 xhr.send(formData);
```

> 此时：问题出现了，后端java要么拿到数据乱码，要不拿到数据为空
>

## 思考和解决问题的过程

1. 乱码：将Content-type 设置为text/plain;charset=”UTF8”（测试：不对，好像拿不到数据，不是这问题）
2. 难道formData的请求写错了？仔细看了一下好像没错，难道是传文件影响了？注释掉file 仍然不行
3. 实在想不到什么问题了，直接copy fromData 示例，文件也不传。

    ```jsx
    var formData = new FormData();
    
    formData.append("username", "Groucho");
    formData.append("accountnum", 123456);
    
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.send(formData);
    ```

    > 这样后端拿到了...
    >
4. 逐步排查后，其实就是xhr.setRequestHeader("Content-Type", "multipart/form-data"); 这句代码惹的活，直接去掉就可以了。（具体原因不明，如有小伙伴知道，烦请告诉我）

## 总结

- 如果实在找不到问题，将直接使用官方提供的极简示例测试，然后逐步还原真实场景，这样可快速定位问题

## 参考文献

- [https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects)

> 以上：如发现有问题，欢迎留言指出，我及时更正
>
