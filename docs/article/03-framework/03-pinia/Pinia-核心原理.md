---
title: Pinia-核心原理
author: Potter
date: 2022-04-05 14:24

tags:

- pinia
- 状态管理

categories:

- pinia
---

# Pinia



## 流程图

![https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220414113917.jpg](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220414113917.jpg)
地址：https://drive.google.com/file/d/1ELfAkS9kyDyGLA9U5lbooVqEwne2xK8G/view?usp=sharing


## 工作流程

1. 第一阶段：注册 + 初始化pina和plugin
2. 第二阶段：预设store配置，返回useStore函数
3. 第三阶段：使用store，驱动store的初始化流程
    1. 创建Store：使用reactive({}) 创建一个响应式对象
    2. 执行setup：
        1. state：全部转为Ref，让计算属性跟踪state中值的变化
        2. 合并state、actions 至store中
        3. 遍历getters，将其用computed包裹一层，调用并返回
        4. 合并getters 至store中
    3. 合并公共接口($patch\$state\$reset\$subscribe\$onAction\$dispose)至store中
    4. 返回store，并将其store缓存至存储所有storepinia._s() 中

## 功能剖析

### 1. $dispose：其实就是调用store的scopeEffect.stop 停止所有关联的effect 属性(getters)

```jsx
//1. 使用
store.$dispose();

//2. 实现逻辑
$dispose: () => {
			scope.stop();
			actionSubscribes = [];
			pinia._s.delete(id); // 删除store, 数据变化了不会在更新视图
}
```

### 2. $onAction：捕获所有的action操作（典型的发布订阅模式）

- 使用
    
    ```jsx
    const { increment } = store;
    
    const handleClick = () => {
      //1.触发action
    	increment();
    };
    
    //2. 订阅回调
    store.$onAction(({ after, onError, name }) => {
    	console.log("action执行了", name);
    
    	after((result) => {
    		console.log("状态已经更新完毕了", result);
    	});
    
    	onError(() => {
    		console.log("出错");
    	});
    });
    ```
    
    ```jsx
    <button @click="handleClick">点击增加</button>
    ```
    
- 实现原理
    1. 收集订阅
        
        ```jsx
        let actionSubscribes = []
        const store = {
        	  ...
            //1. 收集订阅
        		$onAction: addSubscription.bind(null, actionSubscribes),
        }
        ```
        
        ```jsx
        //订阅
        export function addSubscription(subscriptions, cb) {
        	subscriptions.push(cb);
        	return function reomveSubscription() {
        		const idx = subscriptions.indexOf(cb);
        		if (idx > -1) {
        			subscriptions.splice(idx, 1);
        		}
        	}
        }
        
        //发布
        export function triggerSubscription(subscriptions, ...args) {
        	subscriptions.forEach(cb => cb(...args));
        }
        ```
        
    2. 包裹action一层，让action调用时触发发布动作
        
        ```jsx
        ...
        for (let key in store) {
        		const prop = store[key]; 
        		if (typeof prop === 'function') {// 对action可以进行扩展 aop思想
        			store[key] = wrapAction(key, prop);
        		}
        }
        
        function wrapAction(name, action) {
        		return function () {
        			const afterCallbackList = [];
        			const onErrorCallbackList = [];
        
        			function after(callback) {
        				afterCallbackList.push(callback)
        			}
        
        			function onError(callback) {
        				onErrorCallbackList.push(callback)
        			}
        			
        		  //发布
        			triggerSubscription(actionSubscribes, { after, onError, store, name }); 
        
        			let ret
        			try {
        				ret = action.apply(store, arguments); 
        			} catch (error) {
        				triggerSubscription(onErrorCallbackList, error)
        			}
        
        			if (ret instanceof Promise) {
        				return ret.then((value) => {
        					triggerSubscription(afterCallbackList, value)
        				}).catch(error => {
        					triggerSubscription(onErrorCallbackList, error);
        					return Promise.reject(error)
        				})
        			} else {
        				triggerSubscription(afterCallbackList, ret)
        			}
        
        			return ret;
        		}
        	}
        ```
        

### 3. $subscribe：利用watch包裹store.state 一层，做到监控所有的state变化，然后发布即可

- 使用
    
    ```jsx
    const store = useCounterStore();
    store.$subscribe((dispatchInfo, state) => {
    	console.log("数据变化 dispatchInfo:", dispatchInfo);
    	console.log("数据变化 state:", state);
    });
    
    const { increment } = store;
    const handleClick = () => {
    	increment();
    };
    ```
    
    ```jsx
    <button @click="handleClick">点击增加</button>
    ```
    
- 触发效果
    
	![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/202303191753123.png)
    
- 实现原理
    
    ```jsx
    const store = {
    	  ...
    		$subscribe(callback, options) {  
    			scope.run(() => watch(pinia.state.value[id], state => { // 监控状态变化
    				callback({ type: 'dirct' }, state);
    			}, options))
    		}
    }
    ```
    

### 4. $patch：批量更新，避免性能消耗

- 使用
    
    ```jsx
    const store = useCounterStore();
    
    function patchUpdate(){
    	//方式一：传方法
       store.$patch(() => {
    		store.count++;
    		store.fruits.push("橘子");
    	});
    	
    	//方式二：传属性
    	/* let fruits = [...store.fruits, "橘子"];
    		store.$patch({
    			count: ++store.count,
    			fruits,
    		}); */
    }
    ```
    
    ```jsx
    <button @click="patchUpdate">批量更新</button>
    ```
    
- 实现原理
    
    ```jsx
    const Store = {
      ...
      $patch
    }
    
    function $patch(partialStateOrMutation) {
    		if (typeof partialStateOrMutation === 'function') { // 这个方法一般用的比较少
    			partialStateOrMutation(store);
    		} else {
    			//递归深度合并对象
    			mergeReactiveObject(store, partialStateOrMutation);
    		}
    }
    
    function mergeReactiveObject(target, partialState) { // 递归
    	for (let key in partialState) {
    		if (!partialState.hasOwnProperty(key)) continue; // 如果是原型上的不考虑
    		const oldValue = target[key];
    		const newValue = partialState[key];
    		
    		if (isObject(oldValue) && isObject(newValue) && !isRef(newValue) && !isReactive(newValue)) {
    			target[key] = mergeReactiveObject(oldValue, newValue)
    		} else {
    			target[key] = newValue;
    		}
    	}
    	return target
    }
    ```
    

### 5. $reset：重置state

- 使用
    
    ```jsx
    store.$reset();
    ```
    
- 实现原理
    
    ```jsx
    let { state, getters, actions } = options;
    // 注意： reset 不能在setupStore 方式创建的store中使用 原因：无法获取到初始状态
    store.$reset = function () { 
    		const newState = state ? state() : {};
    		store.$patch((oldState) => {
    			Object.assign(oldState, newState);
    		})
    }
    ```
    

### 6. $state: 重新赋值state

> ***注意：原来的state还会遗漏在state中，因为底层采用Object.assign合并的***
> 
- 使用
    
    ```jsx
    store.$state = { count: 100, fruits: [] };
    ```
    
- 实现原理：将新状态state合并至老store中
    
    ```jsx
    Object.defineProperty(store, '$state', {
    		get: () => {
    			// 只要状态
    			return pinia.state.value[id];
    		}, 
    		set: (state) => {
    			return $patch(oldStore => Object.assign(oldStore, state));
    		},
    })
    
    function $patch(partialStateOrMutation) {
    		if (typeof partialStateOrMutation === 'function') { // 这个方法一般用的比较少
    			partialStateOrMutation(store);
    		} 
        ...
    }
    ```
    

### 7. mapActions：映射store中的方法

- 使用
    
    ```jsx
    import { useCounterStore } from "../stores/counter";
    import { mapActions, mapState } from "@/pinia";
    export default {
    	methods: {
    		...mapActions(useCounterStore, ["increment"]),
    	},
    };
    ```
    
- 实现原理：利用function将action将store中的方法包裹一层
    
    ```jsx
    export function mapActions(useStore, keysOrMapper) {
    	return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
    		//说明：利用function包裹一层
    		reduced[key] = function (...args) {
    			return useStore()[key](...args);
    		}
    		return reduced
    		// {count:function(){ useStore()['count']}}
    	}, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
    		reduced[key] = function (...args) {
    			const store = useStore();
    			const storeKey = keysOrMapper[key];
    			return store[storeKey](...args)
    		}
    		return reduced
    	}, {})
    }
    ```
    

### 8. mapState：映射store中的state的方法

- 使用
    
    ```jsx
    import { useCounterStore } from "../stores/counter";
    import { mapActions, mapState } from "@/pinia";
    export default {
    	computed: {
    		...mapState(useCounterStore, ["count"]), 
    	}
    };
    ```
    
- 实现原理：   利用function包裹一层，然后映射到store属性上
    
    ```jsx
    export function mapState(useStore, keysOrMapper) {
    	const store = useStore();
    	return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
        //说明：利用function包裹一层，然后映射到store属性上
    		reduced[key] = function () {
    			return store[key];
    		}
    		return reduced
    	}, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
    		reduced[key] = function () {
    			const storeKey = keysOrMapper[key];
    			return store[storeKey]
    		}
    		return reduced
    	}, {})
    }
    ```
    

### 9. mapWritableState：映射store中state 可读可写的方法

- 使用
    
    ```jsx
    import { useCounterStore } from "@/stores/counter";
    import { mapActions, mapState, mapWritableState } from "@/pinia";
    export default {
    	computed: {
    		...mapWritableState(useCounterStore, ["count"]), 
    	}
    };
    
    <button @click="count++">点击</button>
    ```
    
- 实现原理：映射成对象，然后利用get set 进行读写
    
    ```jsx
    export function mapWritableState(useStore, keysOrMapper) {
    	const store = useStore();
    	return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
    		reduced[key] = {
    			get() {
    				return store[key];
    			},
    			set(value) {
    				store[key] = value
    			}
    		}
    		return reduced
    	}, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
    		reduced[key] = {
    			get() {
    				const storeKey = keysOrMapper[key];
    				return store[storeKey]
    			},
    			set(value) {
    				const storeKey = keysOrMapper[key];
    				store[storeKey] = value
    			}
    		}
    		return reduced
    	}, {})
    }
    ```
