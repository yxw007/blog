---
title: Nuxt 入门实战 - 05：特性
author: Potter
date: 2023-06-21 11:42:18

tags:

- Nuxt

categories:

- Nuxt 入门实战
---

# Nuxt 入门实战 - 05：特性


## 自动导入

> 说明：以下目录只要有引用，都具有自动导入能力
>
- components：可以被template 直接使用
- composables：其中的导出，可以直接被template、ts、js 文件直接引用使用
- utils：其中的导出，可以直接被template、ts、js 文件直接引用使用

## 拉取数据

```jsx
<script setup>
const { data } = await useFetch('/api/hello')
</script>

<template>
  <div>
    <p>Result of <code>/api/hello</code>:</p>
    <pre>{{ data }}</pre>
    <p><NuxtLink to="/external">Visit /external</NuxtLink></p>
    <p><NuxtLink to="/component">Visit /component</NuxtLink></p>
  </div>
</template>
```

## 状态共享

> 说明：此时counter 和 sameCounter 就共用一个状态了
>

```jsx
//app.vue
<script setup>
//1.赋值
const counter = useState("counter", () => 30);
//2.获取共享状态
const sameCounter = useState("counter");
</script>

<template>
 <div>
  <p>Counter: {{ counter }}</p>
  <p>
   <button @click="counter--">-</button>
   <button @click="counter++">+</button>
  </p>
  <p>Same Counter: {{ sameCounter }}</p>
  <Test></Test>
 </div>
</template>
```

## Meta Tags

> 说明：可以在页面template中添加html head 内容，修改页面head数据
>
>
> ```html
> <template>
>  <div>
>   <p>
>    We are using renderless <code>&lt;Html&gt;</code>,
>    <code>&lt;Meta&gt;</code>, <code>&lt;Title&gt;</code> components
>    <br />that can magically bind the meta inside Vue components.
>   </p>
> 
>   <Html lang="en">
>    <Head>
>     <Title>Lucky number: {{ number }}</Title>
>     <Meta name="description" :content="`My page's ${number} description`" />
>    </Head>
>   </Html>
> 
>   <p>
>    <button @click="number = Math.round(Math.random() * 100)">
>     Click me and see the title updates
>    </button>
>   </p>
> 
>   <p><NuxtLink to="/about">About page</NuxtLink></p>
>  </div>
> </template>
> ```
>

## Layout

- NuxtLayout 默认引用Layouts/default.vue 布局
- NuxtLink 相当于router-link
- 动态修改layout

    ```jsx
    setPageLayout(layoutname)
    ```

- 导航进特定路由前，执行中间件

    ```jsx
    //pages/other.vue
    <script setup>
    definePageMeta({
      middleware: 'other'
    })
    </script>
    ```

    > 进入other路由器，会先执行middleware/other.ts 中间件
    >

    ```jsx
    //middleware/other.ts
    export default defineNuxtRouteMiddleware(() => {
      setPageLayout('other')
    })
    ```

## routing

- 禁止跳转进某个路由

    ```jsx
    //pages/fobidden.vue
    <template>
     <div>Forbidden</div>
    </template>
    
    <script setup>
    definePageMeta({
     middleware: () => {
      console.log("Strictly forbidden.");
      //! 返回false,可禁止跳入此路由
      return false;
     },
    });
    </script>
    ```

- 利用middleware 重定向

    ```jsx
    //pages/redirect.vue
    <template>
      <div>
        You should never see this page
      </div>
    </template>
    
    <script setup>
    
    definePageMeta({
      middleware: 'redirect-me'
    })
    </script>
    ```

    ```jsx
    //middleware/redirect-me.ts
    export default defineNuxtRouteMiddleware((to) => {
      const { $config } = useNuxtApp()
      if ($config) {
        console.log('Accessed runtime config within middleware.')
      }
      console.log('Heading to', to.path, 'but I think we should go somewhere else...')
      return '/secret'
    })
    ```

- 全局中间件：只要切换路由就会执行

    ```jsx
    //middleware.global.ts
    export default defineNuxtRouteMiddleware(() => {
      console.log('running global middleware')
    })
    ```

- 获取当前路由信息

    ```jsx
    const route = useRoute()
    ```

- 路由占位符传参

    ```jsx
    //app.vue
    <button class="n-link-base" @click="$router.push(`/parent/reload-${(Math.random() * 100).toFixed()}`)">
       Keyed child
    </button>
    ```

    > 说明：会先加载parent组件，然后通过parent再嵌套载入reload-[id].vue 组件，会将reload-后面的参数动态传给reload-[id].vue 组件
    >

**NuxtLink 相当于 router-link，NuxtPage 相当于 router-view**

## 配置extend

- nuxt.config.ts 继承

    ```jsx
    //nuxt.config.ts
    export default defineNuxtConfig({
      extends: [
        './ui',
        './base'
      ],
      runtimeConfig: {
        public: {
          theme: {
            primaryColor: 'user_primary'
          }
        }
      },
      modules: [
        '@nuxt/ui'
      ]
    })
    ```

    > app.config.ts 也会自动继承
    >

    ```jsx
    export default defineAppConfig({
      foo: 'user',
      bar: 'user',
      baz: 'base',
      array: [
        'user',
        'user',
        'user'
      ]
    })
    ```

- base 配置

    ```jsx
    //base/nuxt.config.ts
    export default defineNuxtConfig({
      imports: {
        dirs: ['utils']
      },
      runtimeConfig: {
        public: {
          theme: {
            primaryColor: 'base_primary',
            secondaryColor: 'base_secondary'
          }
        }
      }
    })
    ```

    ```jsx
    export default defineAppConfig({
      bar: 'base',
      baz: 'base',
      array: () => [
        'base',
        'base',
        'base'
      ],
      arrayNested: {
        nested: {
          array: [
            'base',
            'base',
            'base'
          ]
        }
      }
    })
    ```

最终nuxt.config.ts 和app.config.ts 都会对应合并

## 错误处理

- 通过插件捕获错误

    ```jsx
    //plugins/error.ts
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.hook('vue:error', (..._args) => {
        console.log('vue:error')
        // if (process.client) {
        //   console.log(..._args)
        // }
      })
    
      nuxtApp.hook('app:error', (..._args) => {
        console.log('app:error')
        // if (process.client) {
        //   console.log(..._args)
        // }
      })
    
      //全局错误处理
      nuxtApp.vueApp.config.errorHandler = (..._args) => {
        console.log('global error handler')
        // if (process.client) {
        //   console.log(..._args)
        // }
      }
    })
    ```

- 中间件处理错误

    ```jsx
    //middleware/error.global.ts
    export default defineNuxtRouteMiddleware((to) => {
      if ('middleware' in to.query) {
        return showError('error in middleware')
      }
    })
    ```

> 说明：根目录创建error.vue，出错就会跳转至此页面，错误消息通过defindPros 中的error.message拿到
>

## module

> 可以将页面拓展到模块，然后extendPages接口将拓展的页面加进路由中
>
1. 配置nuxt.config.ts 添加对应模块

    ```jsx
    //nuxt.config.js
    export default defineNuxtConfig({
      modules: [
        '~/modules/pages/index',
        '@nuxt/ui'
      ]
    })
    ```

2. setup添加模块页面

    ```jsx
    //modules/pages/index.ts
    import { defineNuxtModule, extendPages } from '@nuxt/kit'
    import { resolve } from 'pathe'
    
    export default defineNuxtModule({
      setup () {
        extendPages((pages) => {
          // Add /test page
          pages.push({
            name: 'Test',
            path: '/test',
            file: resolve(__dirname, './pages/test.vue')
          })
        })
      }
    })
    ```

## Cookie

```jsx
//默认为空，具备响应式
const user = useCookie<{ name: string }>('user')
const logins = useCookie<number>('logins')
```

## 参考文献

- [https://nuxt.com/docs/examples/features/auto-imports](https://nuxt.com/docs/examples/features/auto-imports)
- [https://nuxt.com/docs/examples/features/data-fetching](https://nuxt.com/docs/examples/features/data-fetching)
- [https://nuxt.com/docs/examples/features/state-management](https://nuxt.com/docs/examples/features/state-management)
- [https://nuxt.com/docs/examples/features/meta-tags](https://nuxt.com/docs/examples/features/meta-tags)
- [https://nuxt.com/docs/examples/features/layouts](https://nuxt.com/docs/examples/features/layouts)
- [https://nuxt.com/docs/examples/routing/middleware](https://nuxt.com/docs/examples/routing/middleware)
- [https://nuxt.com/docs/examples/routing/pages](https://nuxt.com/docs/examples/routing/pages)
- [https://nuxt.com/docs/examples/advanced/config-extends](https://nuxt.com/docs/examples/advanced/config-extends)
- [https://nuxt.com/docs/examples/advanced/error-handling](https://nuxt.com/docs/examples/advanced/error-handling)
