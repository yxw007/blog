---
title: Nuxt 入门实战 - 04：常用操作
author: Potter
date: 2023-06-21 11:42:00
tags: 
- Nuxt
categories: 
- Nuxt 入门实战

---


# Nuxt 入门实战 - 04：常用操作

> 注意：Nuxt Kit 仅用于Module 模块开发，运行时别用
> 

## 环境变量覆盖运行时配置

> 注意：需要覆盖的运行时变量，必须在runtimeConfig定义出来，否则无效
> 
- .env
    
    ```jsx
    //.env
    NUXT_API_SECRET=api_secret_token
    NUXT_PUBLIC_API_BASE=https://nuxtjs.org
    ```
    
- nuxt.config.js
    
    ```jsx
    //nuxt.config.ts
    export default defineNuxtConfig({
      runtimeConfig: {
        apiSecret: '', // can be overridden by NUXT_API_SECRET environment variable
        public: {
          apiBase: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
        }
      },
    })
    ```
    

> 名称匹配： 环境变量中配置，需要添加NUXT前缀，然后单词大小用_分割。runtimeConfig：采用驼峰式
> 

## 访问运行时配置

- 使用方式
    
    ```jsx
    <template>
      <div>
        <div>Check developer console!</div>
      </div>
    </template>
    
    <script setup>
    const config = useRuntimeConfig()
    console.log('Runtime config:', config)
    if (process.server) {
      console.log('API secret:', config.apiSecret)
    }
    </script>
    ```
    
    > 注意：client端只能访问public，此字段可读可写。server端放访问运行时所有配置，但是仅只读不能修改，原因：如果能修改，多个请求访问运行时配置就会导致数据不一致问题。**切记：不要把apiSecret 暴露给client端，其他隐私数据也是如此。UseRuntimeConfig 仅在setup or Lifecycle Hooks 期间有效**
    > 

## useFetch 获取数据

> 说明：如何使用$fetch拉取SSR数据，会导致服务端获取一遍数据，客户端在获取一遍数据的问题，采用useFetch 可避免掉
> 
> 
> ```jsx
> <script setup>
> // During SSR data is fetched twice, once on the server and once on the client.
> const dataTwice = await $fetch('/api/item')
> 
> // During SSR data is fetched only on the server side and transferred to the client.
> const { data } = await useAsyncData('item', () => $fetch('/api/item'))
> 
> // You can also useFetch as shortcut of useAsyncData + $fetch
> const { data } = await useFetch('/api/item')
> </script>
> ```
> 

> 说明：如果仅在客户端调用，推荐使用$fetch
> 

## 参考文献

- [https://nuxt.com/docs/guide/going-further/runtime-config#serialization](https://nuxt.com/docs/guide/going-further/runtime-config#serialization)
- [https://nuxt.com/docs/api/utils/dollarfetch](https://nuxt.com/docs/api/utils/dollarfetch)
