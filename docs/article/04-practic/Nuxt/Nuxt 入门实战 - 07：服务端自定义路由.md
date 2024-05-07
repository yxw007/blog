---
title: Nuxt 入门实战 - 07：服务端自定义路由
author: Potter
date: 2023-06-22 11:43:29
tags: 
- Nuxt
categories: 
- Nuxt 入门实战

---


# Nuxt 入门实战 - 07：服务端自定义路由

## 方式一：通过中间件实现

```tsx
//server/middleware/api.ts

import { createRouter, defineEventHandler, useBase } from 'h3';

const router = createRouter();
router.get('/hello', defineEventHandler(event => 'Hello'));
router.get('/hello/world', defineEventHandler(event => 'Hello World'));
const handler = useBase('/api', router.handler);

export default defineEventHandler((event) => handler(event))
```

访问

```tsx
http://localhost:port/api/hello
http://localhost:port/api/hello/world
```

## 方式二：通过[…].ts实现

```tsx
// xxx/server/api/[...].ts

import { createRouter, defineEventHandler, useBase } from 'h3';

const router = createRouter();
router.get('/hello', defineEventHandler(event => 'Hello'));
router.get('/hello/world', defineEventHandler(event => 'Hello World'));

export default useBase('/api', router.handler);
```

访问：

```tsx
http://localhost:port/api/hello
http://localhost:port/api/hello/world
```

## 参考文献

- https://github.com/nuxt/nuxt/issues/13696
