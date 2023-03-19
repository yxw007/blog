---
title: 2.集成vue-router
author: Potter
date: 2022-11-03 11:00
tags: 
- vue-ssr
- ssr
categories: 
- vue-ssr

---

# SSR - 2.集成vue-router

---

# 安装依赖

```jsx
yarn add vue-router
```

# 配置路由

创建两个路由对应的页面，方便测试

- src/views/Foo.vue
    
    ```jsx
    <template>
    	<div>Foo page</div>
    </template>
    
    <script>
    export default {
    	name: "Foo",
    };
    </script>
    
    <style scoped>
    div {
    	background: red;
    }
    </style>
    ```
    
- src/views/Bar.vue
    
    ```jsx
    <template>
    	<div>Bar page</div>
    </template>
    
    <script>
    export default {
    	name: "Bar",
    };
    </script>
    
    <style scoped>
    div {
    	background-color: blue;
    }
    </style>
    ```
    
- App.vue 添加路由组件进行切换
    
    ```jsx
    <template>
    	<!-- app节点必须在此处定义，否则客户端交互失效，所以防止这里统一管理 -->
    	<div id="app">
    		<button @click="add">click me</button>
    		<div>counter: {{ counter }}</div>
    		<router-link to="/">foo</router-link>
    		<router-link to="/bar">bar</router-link>
    		<router-view></router-view>
    	</div>
    </template>
    
    <script>
    export default {
    	name: "App",
    	data() {
    		return { counter: 1 };
    	},
    	methods: {
    		add() {
    			this.counter++;
    		},
    	},
    };
    </script>
    
    <style lang="scss" scoped></style>
    ```
    
- src/router/index.js：配置路由文件
    
    ```jsx
    import Vue from "vue";
    import Router from "vue-router";
    
    import Foo from "../views/Foo.vue";
    import Bar from "../views/Bar.vue";
    
    Vue.use(Router);
    
    export default function () {
    	const router = new Router({
    		mode: 'history',
    		routes: [
    			{
    				path: '/', component: Foo
    			},
    			{
    				path: '/bar', component: Bar
    			},
    			{
    				path: '*', component: {
    					render(h) {
    						return h("div", {}, "not found 404");
    					}
    				}
    			},
    		]
    	});
    
    	return router;
    }
    ```
    
- src/app.js ： 引入router 创建路由
    
    ```jsx
    import Vue from "vue";
    import App from "./App.vue"
    import createRouter from "./router";
    
    export default () => {
    	const router = createRouter();
    	const app = new Vue({
    		router,
    		render: h => h(App)
    	});
    	return { app, router }
    }
    ```
    

至此vue-router 集成完成，但是会有个问题，从首页切至bar页面按回车会导致404

# 解决：刷新本地路由bar页面地址会导致404问题

- src/server-entry.js：利用vue-router 的push 和onReady接口解决

```jsx
import createApp from "./app.js";

export default function (context) {
	const { url } = context;
	return new Promise((resolve, reject) => {
		const { app, router } = createApp();
		//! 说明：如果当前使用的是前端路由，比如：/bar 回车就会导致404,
		//! 解决办法：利用vue-router的push和onReady接口解决
		//! 1. 让其跳入前端路由
		router.push(url);
		//! 2. 路由渲染完毕，准备进入匹配的路由
		router.onReady(() => {
			const matchComponents = router.getMatchedComponents();
			if (matchComponents.length === 0) {
				return reject({ code: 404 });
			} else {
				Promise.all(matchComponents.map(component => {
					if (component.asyncData) {
						return component.asyncData();
					}
				})).then(() => {
					resolve(app);
				});
			}
		});
	});
}
```

**示例代码：[传送门](https://github.com/yxw007/vue-ssr/tree/master/vue2-webpack-ssr)**

# 总结

- 本地的路由按回车是会404的，所以服务端渲染需要先让前端路由跳转渲染，等路由页面渲染好等待跳转onReady触发时再进行返回

> 以上：如发现有问题，欢迎留言指出，我及时更正
>
