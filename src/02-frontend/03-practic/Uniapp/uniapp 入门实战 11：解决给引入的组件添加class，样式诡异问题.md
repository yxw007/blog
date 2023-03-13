# uniapp 入门实战 11：解决给引入的组件添加 class，样式诡异问题

---

# 情境

- 实际效果

  ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211121.png)

  给 Comp 添加 class，蓝色边框贼诡异，为啥会显示成这个样式?

- 正确效果：[vue demo](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHRlbXBsYXRlPlxuICA8Q29tcCBjbGFzcz1cIkNvbXBcIj48L0NvbXA+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0IHNldHVwPlxuaW1wb3J0IENvbXAgZnJvbSBcIi4vQ29tcC52dWVcIlxuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbi5Db21we1xuICBwYWRkaW5nOjQwcHg7XG4gIGJvcmRlcjo0cHggc29saWQgIzAwMDBmZjtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbjwvc3R5bGU+XG5cbiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDb21wLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgXHQ8ZGl2IGNsYXNzPVwiaXRlbVwiPlxuICAgICAgdGhpcyBpcyBhIGl0ZW1cbiAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0XCI+XG4gICAgXHQgIHRoaXMgaXMgYSBDb21wXG4gICAgXHQ8L2Rpdj5cbiAgXHQ8L2Rpdj5cbiAgXG48L3RlbXBsYXRlPlxuXG48c2NyaXB0IHNldHVwPlxuPC9zY3JpcHQ+XG5cbjxzdHlsZSBzY29wZWQ+XG4gIC5pdGVtIHtcbiAgICBwYWRkaW5nOjIwcHg7XG4gIFx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuICBcbiAgLml0ZW0gLnRleHR7XG4gICAgY29sb3I6IHJlZDtcbiAgICBib3JkZXI6IDFweCBzb2xpZDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICBcbiAgICBiYWNrZ3JvdW5kOiMwMGZmMDA7XG4gIH1cbjwvc3R5bGU+In0=)

  ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211151.png)

# 代码

- Comp.vue

  ```html
  <template>
    <view class="item">
      this is a item
      <view class="text"> this is a Comp </view>
    </view>
  </template>

  <script setup></script>

  <style>
    .item {
      padding: 20px;
      box-sizing: border-box;
    }

    .item .text {
      color: red;
      border: 1px solid;
      text-align: center;

      background: #00ff00;
    }
  </style>
  ```

- index.vue

  ```html
  <template>
    <Comp class="Comp"></Comp>
  </template>

  <script setup>
    import Comp from "./Comp.vue";
  </script>

  <style scoped>
    .Comp {
      display: block;
      padding: 40px;
      border: 4px solid #0000ff;
      box-sizing: border-box;
    }
  </style>
  ```

没有想到为啥，就给 uniapp 提了一个 issues

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211206.png)

# 总结

- 原来是引入组件添加的 class，view 标签默认是未 display 属性，所以只要设置成 block 元素即可

# 参考文献

- [https://github.com/dcloudio/uni-app/issues/3601#issuecomment-1155025002](https://github.com/dcloudio/uni-app/issues/3601#issuecomment-1155025002)

> 以上：如发现有问题，欢迎留言指出，我及时更正
