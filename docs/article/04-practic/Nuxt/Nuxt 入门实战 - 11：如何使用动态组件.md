---
title: Nuxt 入门实战 - 11：如何使用动态组件
author: Potter
date: 2023-06-26 11:44:45

tags:

- Nuxt

categories:

- Nuxt 入门实战
---

# Nuxt 入门实战 - 11：如何使用动态组件


## 背景

动态切换组件这是非常常见的需求，比如：hover到导航菜单，不同菜单需要显示内容。那么我们就可以使用component :is 来实现此功能。

## Vue实现demo

- App.vue

    ```json
    <script setup>
    import { ref } from 'vue'
    import Comp1 from './Comp1.vue';
    import Comp2 from './Comp2.vue';
    
    const b = ref(false);
    </script>
    
    <template>
      <button @click="b=!b"> 切换组件 </button>
      <component :is="b?Comp1:Comp2"></component>
    </template>
    ```

- Comp1.vue

    ```html
    <template>
     <div>组件1</div>
    </template>
    ```

- Comp2.vue

    ```html
    <template>
     <div>组件1</div>
    </template>
    ```

    > **特别注意：<component :is="b?Comp1:Comp2"></component>  引用的是组件而不是组件名称**
    >

## Nuxt 中如何实现?

1. components 创建两个组件，目录结果如下

   !["img"](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240507114845.png)

2. 利用component is 动态使用这2个组件

    ```html
    <template>
     <button @click="b=!b"> 切换组件 </button>
      <component :is="activeNavComName"></component>
    </template>
    
    <script setup>
    import { NavMenuEffect, NavMenuProduct } from "#components";
    const b = ref(false);
    
    const activeNavComName = computed(() => b.value ? NavMenuEffect : NavMenuProduct);
    </script>
    ```

    > 说明：这是个简单demo虽然实现了，但是还是不够灵活。是否能够通过组件名来动态切换呢？ 答案：可以的
    >

## 如何通过字符串动态切换组件?

1. 修改nuxt.config.ts 来增加组件扫描规则，让以上2个组件变成全局组件

    ```tsx
    //nuxt.config.ts
    export default defineNuxtConfig({
    ...
    components: [
      ...
      { path: "~/components/NavMenu", global: true },
      "~/components"
      ...
    ],
    ...
    });
    ```

2. 利用vue3给我们提供的resolveComponent来实现通过名称找到对应的组件

    ```html
    <template>
     <button @click="b=!b"> 切换组件 </button>
      <component :is="activeNavComName"></component>
    </template>
    
    <script setup>
    const b = ref(false);
    
    const activeNavComName = computed(() => resolveComponent(b.value ? "NavMenuEffect" : "NavMenuProduct"));
    </script>
    ```

## 总结

- 直接引入组件，配合component is 可以简单的需求
- 如果想要更多的灵活性，就可以通过全局注册组件，然后通过resolveComponent解析成组件，最后配合component is 来使用

## 参考文献

- **[I can't use dynamic components in Nuxt 3](https://stackoverflow.com/questions/73025338/i-cant-use-dynamic-components-in-nuxt-3)**
