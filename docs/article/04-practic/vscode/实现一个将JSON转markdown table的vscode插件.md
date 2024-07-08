# 实现一个将JSON转markdown table的vscode插件

---

title: 实现一个将JSON转markdown table的vscode插件
author: Potter
date: 2024-04-15 10:25:02

tags:

- vscode
- 插件

categories:

- vscode 插件


...


## 准备

1. [注册Microsoft 账号](https://login.live.com/)
2. [azure平台创建Publisher](https://login.microsoftonline.com/common/oauth2/authorize?client_id=499b84ac-1321-427f-aa17-267ca6975798&site_id=501454&response_mode=form_post&response_type=code+id_token&redirect_uri=https%3A%2F%2Fapp.vssps.visualstudio.com%2F_signedin&nonce=902323fe-1c94-4666-afa8-07cc8bf7402e&state=realm%3Daex.dev.azure.com%26reply_to%3Dhttps%253A%252F%252Faex.dev.azure.com%252Fsignup%253FacquisitionId%253D015cfa9b-53cd-4373-9145-264d43b1e8a2%2526acquisitionType%253DbyDefault%26ht%3D3%26mkt%3Dzh-CN%26nonce%3D902323fe-1c94-4666-afa8-07cc8bf7402e&resource=https%3A%2F%2Fmanagement.core.windows.net%2F&cid=902323fe-1c94-4666-afa8-07cc8bf7402e&wsucxt=1&githubsi=true&msaoauth2=true&mkt=zh-CN) (温馨提示：如果无法创建Publisher，尝试换个浏览器试试，我就是chrome点击创建没反应，改成edge就可以了)
3. [创建Person access token](https://dev.azure.com/)
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410175658.png)
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410175724.png)
    
    > 提示：点击create后记得保存token，后面发布插件至vscode marketplace 需要用到
    > 

## 快速生成插件项目

- 全局安装插件模板
    
    ```bash
    npm install -g yo
    npm install -g generator-code
    ```
    
- 根据模板生成插件项目
    
    ```bash
    yo code extensionProject
    ```
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410175746.png)
    

## 修改项目

- package.json
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410175758.png)
    
    1. 入口文件
    2. azure创建的Publisher
    3. 配置快捷键和命令title
- extension.js
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410175807.png)
    
    - 注意：框出来注册的命名名称，必须与package.json 中配置的command对应一致，否则就会导致快捷键无效问题
    - activate 函数就是写插件代码的地方

## 发布

- 安装vsce
    
    ```bash
    vsce login Publisher
    # Publisher 就是创建Publisher名称
    ```
    
- 打包插件成vsix文件（可用于本地安装）
    
    ```bash
    vsce package
    # 工程根目录下会生成一个xxx.vsix 文件
    ```
    
- 发布到vscode marketplace
    
    ```bash
    vsce publish
    # 注意：会提示输入个人访问令牌,就填前面生成个人令牌是保存的值
    # 提示：发布成功后需要过几分才能在marketplace上搜索到
    ```
    

## 安装插件测试

- 本地安装，选择打包生成的xxx.vsix文件即可
    
    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240410175816.png)
    
- marketplace安装：就是正常的搜索安装即可

完整：[demo](https://github.com/yxw007/JsonToMarkdown.git)

## 参考文献

- [https://juejin.cn/post/7121381959883816968](https://juejin.cn/post/7121381959883816968)
