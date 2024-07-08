# TypeStript 入门 - 10：模块与命名空间

---

title: TypeStript 入门 - 10：模块与命名空间
author: Potter
date: 2022-11-28 21:00

tags:

- TypeScript

categories:

- TypeScript 入门

...

## 模块

- 导出

    ```tsx
    //默认导出
    export default 'pt'
    ```

- 导入

    ```tsx
    //导入
    import name from './a'
    
    console.log(name);
    ```

## 命名空间

> 命名空间：可以用于组织代码，避免文件内命名冲突
>
- 基本使用

    ```tsx
    //!命名空间的基本使用
    export namespace zoo {
     export class Dog { eat() { console.log('zoo dog'); } }
    }
    export namespace home {
     export class Dog { eat() { console.log('home dog'); } }
    }
    
    //分别zoo和home命名空间的Dog是不会冲突的，类似C#和C++中的命名空间
    let dog_of_zoo = new zoo.Dog();
    dog_of_zoo.eat();
    
    let dog_of_home = new home.Dog();
    dog_of_home.eat();
    ```

- 嵌套使用

    ```tsx
    //!命名空间的嵌套使用，可以无限制的嵌套
    export namespace zoo {
     export class Pig { eat() { console.log('zoo pig'); } }
     export namespace bear {
      export const name = '熊'
     }
    }
    console.log(zoo.bear.name);
    ```
