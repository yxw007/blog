---
title: 3.集成vuex
author: Potter
date: 2022-11-04 11:00
tags: 
- vue-ssr
- ssr
categories: 
- vue-ssr

---

# SSR - 3.集成vuex

---

# 安装依赖

```jsx
yarn add vuex@3.6.2
```

# 添加vuex相关配置

- src/store/index.js
    
    ```jsx
    import Vuex from "vuex";
    import Vue from "vue";
    
    Vue.use(Vuex);
    
    export default function () {
    	const store = new Vuex.Store({
    		state: {
    			age: 18
    		},
    		mutations: {
    			add(state, payload) {
    				if (payload) {
    					state.age += payload;
    				} else {
    					state.age++;
    				}
    			}
    		},
    		actions: {
    			asyncAdd({ commit }, payload) {
    				return new Promise((resolve, reject) => {
    					setTimeout(() => {
    						commit('add', payload);
    						resolve();
    					}, 1000);
    				});
    			}
    		}
    	});
    
    	return store;
    }
    ```
    
- src/app.js：引入store
    
    ```jsx
    import Vue from "vue";
    import App from "./App.vue"
    import createRouter from "./router";
    import createStore from "./store";
    
    export default () => {
    	const router = createRouter();
    	const store = createStore();
    	const app = new Vue({
    		router,
    		store,
    		render: h => h(App)
    	});
    	return { app, router, store }
    }
    ```
    
- src/server-entry.js：调整服务端入口
    
    ```jsx
    import createApp from "./app.js";
    
    export default function (context) {
    	const { url } = context;
    	return new Promise((resolve, reject) => {
    		const { app, router, store } = createApp();
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
    					//! 1. 调用异步组件的asyncData 函数，进行异步数据获取
    					if (component.asyncData) {
    						console.log("execute: component asyncData");
    						return component.asyncData(store);
    					}
    				})).then(() => {
    					//! 2. 等待异步组件数据全部处理完毕后，需要将后端的store.state 挂载至上下文中，方便客户端对服务端的state数据进行同步
    					context.state = store.state;
    					resolve(app);
    				});
    			}
    		});
    	});
    }
    ```
    

# 页面使用store

- Foo.vue
    
    ```jsx
    <template>
    	<div>Foo page age: {{ $store.state.age }}</div>
    </template>
    
    <script>
    export default {
    	name: "Foo",
    	/* mounted() {
    		this.$store.dispatch("asyncAdd", 1000);
    	}, */
    	asyncData(store) {
    		return store.dispatch("asyncAdd", 1000);
    	},
    };
    </script>
    
    <style scoped>
    div {
    	background: red;
    }
    </style>
    ```
    

至此vuex 集成完毕，但是会存在一个问题服务端将数据state.age渲染成1018，但是前端页面还是显示的age: 18

# 解决：客户端与服务端store.state不同步，导致页面数据闪回原来的样子的问题

- src/store/index.js
    
    ```jsx
    import Vuex from "vuex";
    import Vue from "vue";
    
    Vue.use(Vuex);
    
    export default function () {
    	const store = new Vuex.Store({
    		state: {
    			age: 18
    		},
    		mutations: {
    			add(state, payload) {
    				if (payload) {
    					state.age += payload;
    				} else {
    					state.age++;
    				}
    			}
    		},
    		actions: {
    			asyncAdd({ commit }, payload) {
    				return new Promise((resolve, reject) => {
    					setTimeout(() => {
    						commit('add', payload);
    						resolve();
    					}, 1000);
    				});
    			}
    		}
    	});
    
    	//! 用后端最新的store.state 替换掉client中的store.state 避免服务端已渲染最新的state 页面后，client又渲染会之前的state中的状态页面效果
    	//! 注意：此时需要用global变量，webpack打包后会自动替换global变量(不要使用window会导致报错)
    	if (global && global.__INITIAL_STATE__) {
    		store.replaceState(global.__INITIAL_STATE__);
    	}
    
    	return store;
    }
    ```
    

**示例代码：[传送门](https://github.com/yxw007/vue-ssr/tree/master/vue2-webpack-ssr)**

# 总结

- 等页面和异步数据处理完后，需将server端store.state 挂载至context对象中，context.state = store.state（原因：让客户端同步store.state数据事从context获取）
- store创建完后，从global.__INITIAL_STATE__查看是否有server挂载的state数据，如果存在的话就需要将server state 数据替换client state数据

> 以上：如发现有问题，欢迎留言指出，我及时更正
>
