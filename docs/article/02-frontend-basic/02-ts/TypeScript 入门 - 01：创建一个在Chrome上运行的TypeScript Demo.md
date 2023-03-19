---
title:  TypeScript 入门 - 01：创建一个在Chrome上运行的TypeScript Demo
author: Potter
date: 2022-05-12 18:49
tags: 
- TypeScript
- VSCode
- Chrome
categories: 
- TypeScript 入门

---

# TypeScript 入门 - 01：创建一个在Chrome上运行的TypeScript Demo

## 概述
> 目前使用TypeScript编写前端项目已成为趋势，所以搞一个运行在Chrome的demo 来方便练习一下TypeScript 相关语法。由于技术更新太快，会导致你在网上参考的例子可能已经过时，或者运行不起来。我的建议还是直接先去看官方文档，尝试这编写demo，实在搞不出来再去Google 查找相关文章。

## 构建环境
- vscode：1.53.2
- chrome：87.0.42.80.141
- Node.js：12.8.3
- win10

<!--more-->

## 具体步骤
- **第一步：创建工程**
    ```
    //创建目录工程
    mkdir typescript_chrom_demo

    //安装typescript 编译环境（推荐：使用pnpm安装，速度贼快）
    pnpm install -g typescript

    //初始化工程，会产生tsconfig.json 配置文件
    tsc ---init
    ```
- **第二步：创建目录和相关文件**
    - 目录结构效果
   ![](https://cdn.jsdelivr.net/gh/aa4790139/BlogPicBed@master//img/20210304153444.png)
    - 具体内容如下：
        **helloworld.html**
        ```
        <!DOCTYPE html>
        <html>
           <head>
               <title>This is a use TypeScript HTML demo</title>
           </head>
           <body>
           </body>
           <script src="../out/helloworld.js"></script>
        </html>
        ```
   
        **helloworld.ts**
    
        ```
        let message: string = 'Hello Web, I am is TypeSciprt';
        console.log(message);
        document.body.textContent = message;
        ```
        **tsconfig.json**
        ```
        {
          "compilerOptions": {
            "target": "es5",                           
            "module": "amd",                          
            "outFile": "./out/helloworld.js",         
            "strict": true,                           
            "esModuleInterop": true,                   
            "skipLibCheck": true,                     
            "forceConsistentCasingInFileNames": true  
          }
        }
        ```
- **第三步：创建运行和调试launch.json**
![](https://cdn.jsdelivr.net/gh/aa4790139/BlogPicBed@master//img/20210304153458.png)
  **内容如下**：
  ```
    {
        // 使用 IntelliSense 了解相关属性。 
        // 悬停以查看现有属性的描述。
        // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "configurations": [
            {
                "type": "pwa-chrome",
                "request": "launch",
                "name": "Open helloworld.html",
                "file": "d:\\Work\\h5_workspace\\typescript_chrome_demo\\src\\helloworld.html"
            }
        ]
    }
  ```
- **第四步：打开终端，开启自动编译typescript**

      ```
      tsc -w
      ```

      **效果如下**
      
  
- **最后：F5启动运行**

    **效果如下**
    ![](https://cdn.jsdelivr.net/gh/aa4790139/BlogPicBed@master//img/20210304153521.png)
    
## 参考文献
- [TypeScript tutorial in Visual Studio Code](https://code.visualstudio.com/docs/typescript/typescript-tutorial)
- [VSCode Debugging](https://code.visualstudio.com/docs/editor/debugging#_start-debugging)
- [TypeScript Compile on Save in Visual Studio Code](https://www.tektutorialshub.com/typescript/typescript-compile-on-save-in-visual-studio-code/)
