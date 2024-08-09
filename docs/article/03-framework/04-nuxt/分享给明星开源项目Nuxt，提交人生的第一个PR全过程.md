---

id: y605zk0s
title: 分享给明星开源项目Nuxt，提交人生的第一个PR全过程
author: Potter
date: 2024-08-09 10:09
tags:

- Nuxt
- PR
- cookie-es
- github
- 开源

categories:

- Nuxt

---

# 分享给明星开源项目Nuxt，提交人生的第一个PR全过程

整个过程经历了2个半月，这是非常漫长的一个过程，可能你会因此而放弃，但是我还是坚持下来了，接下来就让我来分享一下我这段PR经历吧。

## 背景

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180087602.png)

**issue：**[Decode function for useCookie called for every cookie present](https://github.com/nuxt/nuxt/issues/27246)

你可能会问：为什么偏偏调选解决这个问题呢？难道这个问题有什么特别之处吗？解释一下原因:

1. 问题描述清晰
2. 有复现步骤
3. 有最小复现代码Reproduction

> tips: 大家提交issue时想要你的问题得到解决，就得学会换位思考，假如你是维护者，你会希望issue提供哪些关键信息？具备以上3点你可能才有兴趣去解决这个问题，不具备的话估计就看一下，如果你很懂这个问题，可能会去解决，不太理解也就直接跳过了，那么你的issue就可能一直会被忽略。这也就是为什么很多项目都需要提供reproduction，如果没有提供reproduction，issue直接被关闭了。

咋们根据issue来复现一下，看看问题到底是什么?

- code:

```html
<script setup lang="ts">
  const fooCookie = useCookie('foo', {
    default: () => 'FOO'
  })
  const barCookie = useCookie('bar', {
    default: () => 'BAR',
    decode(value) {
      console.log({action: 'decode', baz: value, source: 'bar'})
      return value
    },
  })
  const bazCookie = useCookie('baz', {
    decode(value) {
      console.log({action: 'decode', baz: value, source: 'baz'})
      return value
    },
    encode(value) {
      console.log({action: 'encode', baz: value})
      return value
    },
  })
  onMounted(() => {
    console.log(`All cookies: ${document.cookie}`)
  })
</script>
<template>
  <div>
    <h1>Coookies</h1>
    <div>
      <p>Foo: "{{ fooCookie }}"</p>
      <p>Bar: "{{ barCookie }}"</p>
      <p>Baz: "{{ bazCookie}}"</p>
    </div>
  </div>
</template>
```

- 输出结果：
  ![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180088999.png)

为什么出现了4次decode呢？foo、bar的decode分别被调用了2次。barCookie的decode和bazCookie的decode都应该只被调用了1次，也就是自己的cookie才会被调用。

这就是提交issuse的问题描述
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180089942.png)

搞懂问题后，接下来就看思考如何解决这个问题了

## 调试问题，查找具体原因

直接在decode的地方加个debugger，然后看调用栈，看看是谁调用的
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180090763.png)
此时看不出什么问题，我们往回到至readRawCookies，此时传进去就是document.cookie的值
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180091796.png)
看看parse如何解析的
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180092610.png)
由此可以看出，cookie就是有key=value然后加分号拼接起来的，那么解析也用这种方式解析，再来看下tryDecode干了什么

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180093580.png)

最后就到了barCookie的decode，此时我们就知道为什么不属于自己cookie名字的cookie也会被调用，因为压根就没有做过滤呀，所以才会导致这个问题。

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180094442.png)

## 解决问题

### 第1次PR (关闭：5-22)

上面的这个问题源于cookie-es库，我想的第一个方案，将key返回给上层，然后让上层自己决定是否decode。

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180099951.png)
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180101269.png)

相关PR: [feat: decode callback parameter adds key](https://github.com/unjs/cookie-es/pull/32)

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180102202.png)

pi0说的比较含蓄，有点尴尬😅

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180103454.png)

这句话我是故意套他方案的，哈哈

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180104690.png)

他明确告诉我在第52行加个判断就可以了
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180105512.png)

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180106912.png)

说明：filter最好采用行业标准的写法，这样别人看一眼就知道什么意思，而不是使用者等到报错的时候，才发现条件写反了。

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180107698.png)

### 第2次PR (合并: 5-22)

按第1次pr的修改建议，重新提了这个PR.

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180108700.png)

相关PR: [feat(parse): support filter option for key filtering](https://github.com/unjs/cookie-es/pull/35)

接下来就是漫长的等待，等待pi0发布新包，我才能把nuxt对应的那个issue改完再提PR

## 等待cookie-es发布新包

### cookie-es发布新包 (7-19)

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180109613.png)

此时：开心又郁闷，赶紧把代码修改提PR

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180110408.png)

结果测试一看，发现我的代码根本就没有，看提交记录发现pi0把我代码搞丢了，好不容易提了个PR，结果还没了，郁闷，那就再提一个吧

### 第3次PR (合并: 7-25)

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180111439.png)

由于第1次提pr等待太久了，结果还把代码给搞丢了，所以这次我提完pr就留言让他发布新包，不然又不知道等待什么时候才能把Nuxt上那个bug修复。
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180112596.png)

这次很快得到响应，pi0就更新发布了新包，这下我又可以继续修复最初的issue了

## 给Nuxt提交PR

### 第1次PR (7-22)

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180113675.png)

发现测试通过了，但是未测试新加的filter选项，所以就是一波修改测试，最终PR合并了

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180114560.png)

相关PR: [perf(nuxt): call cookie decode function only for named cookie #28215](https://github.com/nuxt/nuxt/pull/28215)

相关issue：
![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180115703.png)

### 中途遇到的问题

1. 添加的测试用例，无法用vitest测试，翻阅官方文档，执行了各种命令都无法运行测试代码
2. vscode vitest
   ![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180116595.png)
   这是个非常坑爹的玩意，根本就没法用，不知道大家跟我是不是一样

   - 问题1：检测不到测试用例，我各种新安装依赖都没用
   - 问题2：一直loading，不知道在搞什么鬼
   - 问题3：中途检测到测试用例，结果还运行不了测试用例，特别恼火

没办法测试，我怎么测试我的代码呢？这个vitest实在用不了，就写playground里面测试，测试通过后再提交PR。
代码提交后发现CI测试未通过了，此时来个灵感，github CI能运行测试，我看一下它执行的命令，岂不是我本地就可以运行测试代码了，果然安装CI工作流执行命令，本地就可以测试了。

> tips: 如果搞不清一个项目该按什么顺序执行命令，然后翻页文档也没有搞清，此时就可以看.github/workflows文件夹下的yml文件，里面就是CI的执行命令，你可以参考这个文件来执行你的命令。

## 收到Nuxt发布邮件

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180117735.png)

![alt text](https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1723180118804.png)

终于看到我了，非常开心😄，这是我第一次给明星项目提交PR，还被发布了，非常开心，也是对我这段时间的努力的肯定，继续加油💪

## 总结

- 提交issue时要提供最小复现代码，方便维护者快速定位问题
- 给明星项目提PR不容易，会有很多的限制，要求也会更高，所以要有耐心，不要放弃
- 有问题就要去调试，找到问题的根源，然后解决问题
- 解决一个问题时要思考更好、更合理的解决方法，而不是只解决当前问题
- 大项目无从下手时，看CI的执行过程来了解项目的执行命令（文档虽然可以，但是有时会出现更新不及时的问题）

## 更多

最近我开源了一个文章助手[artipub](https://github.com/artipub/artipub)，可以帮你一键将markdown发布至多平台，方便大家更好的传播知识和分享你的经验。
官网地址：<https://artipub.github.io/artipub/> (提示：国内访问可能有点慢，翻墙就会很快)

帮忙点个star⭐，让更多人知道这个工具，谢谢大家🙏。如果你有兴趣，欢迎加入你的加入，一起完善这个工具。
