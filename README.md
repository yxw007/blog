# blog

个人博客项目

## 创作

1. 在studio的draft目录下，新建一个md文件，然后在这个文件中写作。
2. 文章引用的图片，放在draft目录下即可，然后在文章中引用即可。
3. pnpm push： 会提示选择文章要发布到的目录，选择docs/article下的一个目录即可（分发至个人blog平台），接下来就会进行下面的自动化处理流程
   - 压缩图片
   - 自动上传github图床
   - 生成缓存资源映射文件
   - 将草稿生成成文章，存一份至studio/article目录（方便国内平台分享）
   - 将文章分发至notion,dev 平台
   - 自动提交代码至远程仓库
   - github action 会自动部署到github pages
