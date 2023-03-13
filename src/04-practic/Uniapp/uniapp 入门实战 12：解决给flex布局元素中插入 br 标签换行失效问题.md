# uniapp 入门实战 12：解决给 flex 布局元素中插入<br/>标签换行失效问题

---

# 情境

- 实际效果

  ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211229.png)

- 正常效果

  ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211239.png)

- 代码

  ```html
  <template>
    <view class="item__header">
      ...
      <view class="item__name">{{ name }}</view>
      <br />
      <text class="item__phone">{{ phone }}</text>
      ...
    </view>
  </template>

  ...

  <style lang="scss" scoped>
    &__header {
      display: flex;
      align-items: center;
      position: relative;
    }

    &__name {
      font-size: $text-size-18;
      color: $text-main-color;
      font-weight: bold;
      margin-bottom: 12rpx;
    }

    &__phone {
      font-size: $text-size-14;
      color: $text-grey-color;
    }
  </style>
  ```

# 原因

> flex 的设置的按行排列，此时又给其子元素间添加 br 让其换行，flex 要按行排，br 又让换行，br 的作用与 flex 布局冲突，所以 br 就失效

知道这个原因就不难想到，常用的解决办法：给需要换行的多个元素用 view 包裹一层，然后再使用 br 即可

# 解决方法

```html
<view class="item__header">
  ...
  <view class="item__name">
    {{ name }}
    <br />
    <text class="item__phone">{{ phone }}</text>
  </view>
  ...
</view>

<style lang="scss" scoped>
  &__header {
    display: flex;
    align-items: center;
    position: relative;
  }

  &__name {
    font-size: $text-size-18;
    color: $text-main-color;
    font-weight: bold;
    margin-bottom: 12rpx;
  }

  &__phone {
    font-size: $text-size-14;
    color: $text-grey-color;
  }
</style>
```

# 总结

- 很多时候添加代码不起作用，需要想想各知识点的作用，是不是使用不当导致

# 参考文献

- [https://stackoverflow.com/questions/45087054/br-is-not-friendly-with-the-flexbox](https://stackoverflow.com/questions/45087054/br-is-not-friendly-with-the-flexbox)


