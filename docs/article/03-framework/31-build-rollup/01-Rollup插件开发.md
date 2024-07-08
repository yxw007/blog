---
title: Rollup插件开发
author: Potter
date: 2022-01-15 14:15

tags:

- 插件
- rollup

categories:

- rollup
---

# Rollup插件开发


---
![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220115211118.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220115211118.png)

### options

- 作用：获取rollup 配置

### buildStart

- 作用：开始构建时钩子，此时可获取最后的输入配置信息

### resolveId

- 作用：此钩子可以用于路径替换操作，也可以用于终止解析操作
- 应用场景：
  - 定义alias，最后替换代码中的别名路径

        ```jsx
        //1. 配置别名
        alias: {
          '@': './src'
        }
        
        //2. 使用代码
        import sum from '@/sum.js';
        
        function aliasPlugin(){
          return {
           name:'aliasPlugin',
            //3. 打包时：自动根据别名替换路径
           resolveId(importee, importer) {
               if (importee.startsWith('@')) {
                   return importee.replace('@', path.resolve(__dirname, 'src'))
               } // 如果这里返回false，则不再继续向下执行
           }
          }
        }
        ```

  - 自动安装第三方插件

        ```jsx
        import { exec } from 'child_process';
        import { promisify } from 'util'
        import fs from 'fs';
        import module from 'module'
        const execAsync = promisify(exec);
        
        function autoInstall(){
            const commands = {
                npm:'npm install',
                yarn: 'yarn add'
            }
            // 获取用的包管理器是yarn 还是 npm 
            const manager = fs.existsSync('package-lock.json') ? 'npm':'yarn';
            const pkgFile = path.resolve('package.json');
            // 读取文件内容
            let pkg = JSON.parse(fs.readFileSync(pkgFile,'utf8'));
        
            // 找到已安装的依赖和内置模块
            const installed = new Set(Object.keys(pkg.dependencies || {}).concat(module.builtinModules))
            // 要执行的命令
            const cmd = commands[manager];
        
            return {
                name:'auto-install',
                async resolveId(importee, importer){
                    if (!importer) return null; // 如果没有解析路径
                    const isExternalPackage =( importee[0] !== '.') && (!path.isAbsolute(importee));
                    if (isExternalPackage) {
                        if (!installed.has(importee)) {
                            console.log(`${cmd} ${importee}`)
                            await execAsync(`${cmd} ${importee}`)
                        }
                    }
                }
            }
        }
        ```

### load

- 作用：根据文件路径返回文件内容
- 应用场景：
  - 代码引用资源(png\svg\jpg等)：改成引用相对路径地址，而无需打包资源（需要看webpack 里面的打包插件）

        ```jsx
        //1. 打包时转换icon.png
        function changeResPlugin(){
         return {
          name:'changeResPlugin',
          resolveFileUrl({fileName}){
            //说明：将import.meta.ROLLUP_FILE_URL 替换成此返回结果
              return JSON.stringify(new URL(`test/${fileName}`, 'http://www.baidu.com').href);
          },
          load(filepath){
            let fileName = path.basename(filepath);
              let data = fs.readFileSync(filepath,{encoding:"utf-8"});
            //说明：往打包目录发送文件
              let referenceId = this.emitFile({type: 'asset',source:data,fileName});
            return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`
          }
        }
        
        //打包结果：
        //不用resolveFileUrl 打包结果
        var index = new URL('icon.png', import.meta.url).href;
        export { index as default };
        
        //利用resolveFileUrl转换import.meta.url 打包结果
        var index = "http://www.zhufeng.com/icon.png";
        export { index as default };
        ```

  - 引用小图片，可以直接转成base64内容返回

        ```jsx
        //1. 配置
        plugins: [
         image({
             dom:true
          })
        ]
        
        //2. 使用
        import logo from './static/icon.png';
        document.body.appendChild(logo);
        console.log(logo);
        
        //3. 打包时加载转换
        function changeResPlugin(){
         return {
          name:'changeResPlugin',
          load(id) {
              if (!filter(id)) {
                return null;
              }
          
              const mime = mimeTypes[extname(id)];
              if (!mime) {
                // not an image
                return null;
              }
          
              const isSvg = mime === mimeTypes['.svg'];
              const format = isSvg ? 'utf-8' : 'base64';
              const source = readFileSync(id, format).replace(/[\r\n]+/gm, '');
              const dataUri = getDataUri({ format, isSvg, mime, source });
              const code = options.dom ? domTemplate({ dataUri }) : constTemplate({ dataUri });
          
              return code.trim();
          }
         }
        }
        
        ```

### resolveFileUrl

- 作用：对import.meta.url进行路径的替换
- 应用场景：

    ```jsx
    resolveFileUrl({fileName}){
      //说明：将import.meta.ROLLUP_FILE_URL 替换成此返回结果
        return JSON.stringify(new URL(`test/${fileName}`, 'http://www.baidu.com').href);
    },
    ```

### transform

- 作用：最常用的钩子方法，可以实现各种各样的逻辑转化
- 应用场景：es6 转es5

    ```jsx
    import path from 'path';
    import rollupPluginutils from 'rollup-pluginutils'
    import babel from '@babel/core'
    function babelPlugin(pluginOptions = {}) {
        const defaultExtensions = ['.js', '.jsx', '.cjs']
        const {
            exclude,
            include,
            extensions = defaultExtensions
        } = pluginOptions;
        // 生成后缀匹配正则
        const extensionRegExp = new RegExp(extensions.map(ext => `(${ext})`).join('|') + '$');
        // 创建include和exclude过滤器
        const includeExcludeFilter = rollupPluginutils.createFilter(include, exclude);
        // 实现过滤方法
        const filter = id => extensionRegExp.test(id) && includeExcludeFilter(id);
        return {
            name: 'babel',
            transform(code, filename) {
                if (!filter(filename)) return null; // 如果不能转化直接return
                const config = babel.loadPartialConfig({ filename });
                const transformOptions = config.options;
                let result = babel.transformSync(code, {
                    ...transformOptions,
                    caller: {
                        name: '@rollup/plugin-babel',
                        supportsStaticESM: true,
                    }
                });
                return result
            }
        }
    }
    ```

### moduleParsed

- 作用：获取模块ast信息，可以进行ast代码转换

### resolveDynamicImport

- 作用：动态模块导入钩子
- 应用场景：
  - 解析动态导入路径， 返回转换后路径

        ```jsx
        //1. 使用
        import('multiple')
        
        //2. 插件转换
        function dynamicPlugin(){
         return {
          name: 'dynamicPlugin',
          resolveDynamicImport(id){
           if (id === 'multiple') {
               return path__default["default"].resolve(__dirname, 'src/multiple.js')
           }   
          }
         }
        }
        
        //3. 转换后结果
        import('./multiple.js');
        ```

### buildEnd

- 作用：构建结束调用此钩子(包括成功和失败)

## Generate阶段hook
---

## Build 阶段hook


![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220115210942.png](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/20220115210942.png)

### outputOptions

- 作用：生成阶段的第一个钩子，与Build阶段Options 钩子类似

### renderStart

- 作用：开始生成的钩子，与Build阶段BuildStart钩子类似

### banner、footer、intro、outro

- 作用：可以在固定位置插入代码的钩子，比如：文件头、尾等

### renderDynamicImport

- 作用：可以用于实现import()的polyfill

### augmentChunkHash

- 作用：将模块名称，改用hash值作为参数
- 示例：

    ```jsx
    augmentChunkHash(chunkInfo) { // 用全新的hash作为模块的参数
        let hash = Date.now().toString()
        // 对动态导入的模块进行hash处理
        if (chunkInfo.name === 'minus') {
            return hash;
        }
    }
    ```

### resolveImportMeta

- 作用：解析import.meta中的属性

### renderChunk

- 作用：可对输出代码进行转化处理
- 示例：

    ```jsx
    renderChunk(code) { 
        return code + 'haha'
    }
    ```

### generateBundle

- 作用：生成bundle钩子

### writeBundle

- 作用：Bundle文件生成钩子

### closeBundle

- 作用：bundle关闭钩子

### renderError

- 作用：渲染出错钩子

## 参考文献

- [https://rollupjs.org/guide/en/#plugins-overview](https://rollupjs.org/guide/en/#plugins-overview)
- [https://github.com/rollup/plugins/tree/master/packages/image](https://github.com/rollup/plugins/tree/master/packages/image)
- [https://rollupjs.org/guide/en/#build-hooks](https://rollupjs.org/guide/en/#build-hooks)
- [https://rollupjs.org/guide/en/#output-generation-hooks](https://rollupjs.org/guide/en/#output-generation-hooks)

> 以上：如发现有问题，欢迎留言指出，我及时更正
>
