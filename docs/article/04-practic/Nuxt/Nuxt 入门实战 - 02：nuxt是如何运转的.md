---
title: Nuxt 入门实战 - 02：nuxt是如何运转的 ?
author: Potter
date: 2023-06-20 11:40:40
tags: 
- Nuxt
categories: 
- Nuxt 入门实战

---

# Nuxt 入门实战 - 02：nuxt是如何运转的？

## 两个核心上下文

- `nuxt`:  全局上下文，可获取nuxt.config配置
- nuxtApp：界面共享上下文，有vue实例、运行时钩子、内部状态ssrContext、payload等，可通过useNuxtApp获取（Runtime Core）

## 生命周期钩子

### Nuxt Hook(build Time)

- nuxt.config使用钩子
    
    ```jsx
    //nuxt.config
    export default defineNuxtConfig({
      hooks: {
        'close': () => { }
      }
    })
    ```
    
- defineNuxtModule 方式使用钩子
    
    ```jsx
    import { defineNuxtModule } from '@nuxt/kit'
    
    export default defineNuxtModule({
      setup (options, nuxt) {
        nuxt.hook('close', async () => { })
      }
    })
    ```
    

### App Hooks（Runtime）

- 插件使用钩子
    
    ```jsx
    //plugins/test.ts
    export default defineNuxtPlugin((nuxtApp) => {
        nuxtApp.hook('page:start', () => {
            /* your code goes here */
         })
    })
    ```
    

### Nitro Plugin

- 使用钩子
    
    ```jsx
    //~/server/plugins/test.ts
    export default defineNitroPlugin((nitroApp) => {
      nitroApp.hooks.hook('render:html', (html, { event }) => {
        console.log('render:html', html)
        html.bodyAppend.push('<hr>Appended by custom plugin')
      })
    
      nitroApp.hooks.hook('render:response', (response, { event }) => {
        console.log('render:response', response)
      })
    })
    ```
    

## 参考文献

- [https://nuxt.com/docs/guide/going-further/internals](https://nuxt.com/docs/guide/going-further/internals)
