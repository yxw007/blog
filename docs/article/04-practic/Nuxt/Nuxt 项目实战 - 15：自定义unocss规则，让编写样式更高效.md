## 与UI设计师约定颜色命名规则

---

title: Nuxt 项目实战 - 15：自定义unocss规则，让编写样式更高效

tags:

- Nuxt
- unocss

categories:

- Nuxt 项目实战

...

![Untitled](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1717412867065.png)

## 配置color变量

- color.scss

    ```sass
    $colors: (
     (
      #ffffff,
      #f8f8f8,
      #ebebeb,
      #dbdbdb,
      #cccccc,
      #999999,
      #666666,
      #333333,
      #000000
     ),
     (#daf6ef, #b4ecde, #08c193, #228f73, #43d7b2),
     (#f62f3b, #edc9c9, #f0e2e2, #ffecea, #f78185),
     (#f2f5f8, #e3e8eb, #c3cace, #a0a6a9),
     (#ffb739, #dc9e40, #fff5e4),
     (#fffaf7, #f3cfb9, #debca1, #bd835e, #6b2d00)
    );
    
    @function pad-zero($number) {
     @if $number < 10 {
      @return "0#{$number}";
     } @else {
      @return $number;
     }
    }
    
    // 生成ui设计师颜色命名规则: c-xx-xx
    @function generate-colors() {
     $color-map: ();
    
     @for $i from 1 through length($colors) {
      @for $j from 1 through length(nth($colors, $i)) {
       $var-name: --c-#{pad-zero($i)}-#{pad-zero($j)};
       $var-value: nth(nth($colors, $i), $j);
       $color-map: map-merge(
        $color-map,
        (
         $var-name: $var-value,
        )
       );
      }
     }
    
     @return $color-map;
    }
    
    ```

- var.scss

    ```tsx
    @use "./color.scss" as *;
    
    :root {
     ...
    
     @each $key, $value in generate-colors() {
      #{$key}: $value;
     }
    }
    ```

## 配置unocss rule规则

- uno.config.ts

    ```tsx
    // uno.config.ts
    import {
     defineConfig,
     presetAttributify,
     presetIcons,
     presetTypography,
     presetUno,
     presetWebFonts,
     transformerDirectives,
     transformerVariantGroup
    } from 'unocss'
    
    import { processCss } from "./utils";
    
    export default defineConfig({
     presets: [
      presetUno(),
      presetAttributify(),
      presetIcons(),
      presetTypography(),
      presetWebFonts({
       fonts: {
        // ...
       }
      })
     ],
     shortcuts: [
       ...
      //layout
      {
       "full-screen-w": "w-100vw ml-[calc(-50vw+50%)]",
      },
      //position
      {
       "absolute-h-center": "absolute left-50% -translate-x-50%",
       "absolute-v-center": "absolute top-50% -translate-y-50%",
       "absolute-vh-center": "absolute-h-center absolute-v-center"
      },
      //pop
      {
       "pop-layer": "fixed top-0 left-0 size-auto"
      }
     ],
     rules: [
      [/^(text|bg|border)(-.+)?-c-(\d+)-(\d+)$/, ([val, type, g1, g2, g3]) => {
       switch (type) {
        case 'text': {
         return { color: `var(--c-${g2}-${g3})` };
        }
        case 'bg': {
         return { 'background-color': `var(--c-${g2}-${g3})` };
        }
        case 'border': {
         return { 'border-color': `var(--c-${g2}-${g3})` };
        }
        default: {
         return {}
        }
       }
      }],
     ],
     theme: {
      breakpoints: {
       sm: '640px',
       md: '768px',
       lg: '1024px',
       xl: '1200px',
       xxl: '1680px',
      },
      colors: {
       primary: {
        DEFAULT: 'var(--c-primary)',
        active: 'var(--c-primary-active)',
       },
       minor: {
        DEFAULT: "var(--c-minor)",
        active: "var(--c-minor-active)"
       }
      },
     },
     //! 说明：由于unocss无法识别动态class,所以需要配置出来
     safelist: [
      ...Array.from({ length: 1920 }, (_, i) => `w-${i + 1}px`),
      ...Array.from({ length: 1080 }, (_, i) => `h-${i + 1}px`),
     ],
     transformers: [
      transformerDirectives(),
      transformerVariantGroup()
     ],
     postprocess: [
      (util) => {
       util.entries.forEach((entry) => {
        entry[1] = processCss(entry[1]?.toString());
       });
      }
     ]
    })
    
    ```

## 如何使用

```tsx
<div class="bg-c-01-02 border-c-03-01 text-c-01-02"></div>
```

![Untitled](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1717412868089.gif)

## 存在的问题

```tsx
<div class="bg-c-01-02/.5"></div>
// 如果要给背景色添加一个透明度，这种情况是不支持的，那么如何变得支持呢?
```

![3.gif](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1717412868834.gif)

> 说明：你可能会想到改unocss的规则，那么我们来试下
>

```tsx
rules: [
  [/^(text|bg|border)(-.+)?-c-(\d+)-(\d+)\/?(.+)?$/, ([val, type, g1, g2, g3, g4]) => {
   switch (type) {
    case 'text': {
     return { color: `var(--c-${g2}-${g3})` };
    }
    case 'bg': {
     return { 'background-color': `rgba(var(--c-${g2}-${g3}),${g4})` };
    }
    case 'border': {
     return { 'border-color': `var(--c-${g2}-${g3})` };
    }
    default: {
     return {}
    }
   }
  }],
 ],
```

![Untitled](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1717412869561.png)

> 说明：好些还可以，我们看下真是效果
>

![Untitled](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1717412870328.png)

看到这个你发现问题了，由于我们颜色变量引用的是16进制颜色值，然后rgba的参数是4个，而且是用逗号隔开。可能你会想编译后改样式，类似webpack的css loader一样，但是我们会失去unocss的提示，在开发的时候还是很不方便。所以我想到一个办法，就是把颜色变量变成red,green,blue 最后在规则中拼一个,alpha 值。

```sass
$colors: (
 (
  255,255,255,
 )
);
//这个弄是有问题的，因为逗号sass会把数字分割成3个变量,可能你会想成这样

$colors: (
 (
  "255,255,255",
 )
);

//说明：这样最终使用的也不符合rgba参数, 最终改成这样就可以了。unquote 函数会自动把引号去掉
$colors: (
 (
  unquote('255,255,255'),
 )
);
```

最后的unocss.config.ts 的规则

```tsx
...
rules: [
  [/^(text|bg|border)(-.+)?-c-(\d+)-(\d+)\/?(.+)?$/, ([val, type, g1, g2, g3, g4]) => {
   switch (type) {
    case 'text': {
     return { color: `rgba(var(--c-${g2}-${g3}))` };
    }
    case 'bg': {
     return {
      'background-color': g4 ? `rgba(var(--c-${g2}-${g3}),${g4})` : `rgba(var(--c-${g2}-${g3}))`
     };
    }
    case 'border': {
     return { 'border-color': `rgba(var(--c-${g2}-${g3}))` };
    }
    default: {
     return {}
    }
   }
  }],
 ],
 ...
```

## 测试最终效果

![Untitled](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1717412871017.png)

![Untitled](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1717412871706.png)

完美实现我们想要的效果，这样就可以更开心的写样式了。
