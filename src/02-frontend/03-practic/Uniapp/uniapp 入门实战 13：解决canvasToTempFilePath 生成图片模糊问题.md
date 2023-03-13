# uniapp 入门实战 13：解决 canvasToTempFilePath 生成图片模糊问题

---

# 情境

- 对比效果
  ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20220616211338.png)
  > 为啥看不清我女朋友… (开玩笑)
- 代码

  ```jsx

  ...
  const expWidth = this.eW || width;
  const expHeight = this.eH || height;
  ...
  const commonParams = {
  		x: x,
  		y: y,
  		width: width,
  		height: height,
  		destWidth: expWidth,
  		destHeight: expHeight,
  		fileType: this.fType,
  		quality: Number(this.qlty),
  	};

  uni.canvasToTempFilePath(
  		Object.assign(commonParams, {
  			canvasId: "avatar-canvas",
  			success: (r) => {
  				...
  			},
  			fail: (res) => {
  				triggerFail(res.errMsg);
  			},
  			complete: () => {
  				triggerFinish();
  			},
  		}),
  		this
  	);
  ```

# 原因

截图的尺寸宽高固定值，而没有根据设备的像素比来动态设置，自然在高分辨率下截图出一个小尺寸图片，然后将其拉伸到大一点的尺寸显示就变得模糊了

# 解决方法

```jsx
const commonParams = {
		x: x,
		y: y,
		width: width,
		height: height,
		destWidth: expWidth,
		destHeight: expHeight,
		fileType: this.fType,
		quality: Number(this.qlty),
	};

const sysInfo = uni.getSystemInfoSync();
this.pixelRatio = sysInfo.pixelRatio;

//说明：根据像素比来截去图片,避免高分辨率查看图片模块的情况
const expWidth = (this.eW || width) * this.pixelRatio;
const expHeight = (this.eH || height) * this.pixelRatio;

uni.canvasToTempFilePath(
		Object.assign(commonParams, {
			canvasId: "avatar-canvas",
			success: (r) => {
				...
			},
			fail: (res) => {
				triggerFail(res.errMsg);
			},
			complete: () => {
				triggerFinish();
			},
		}),
		this
	);
```

# 参考文献

- [https://stackoverflow.com/questions/45087054/br-is-not-friendly-with-the-flexbox](https://stackoverflow.com/questions/45087054/br-is-not-friendly-with-the-flexbox)

> 以上：如发现有问题，欢迎留言指出，我及时更正
