---
title: Nuxt 入门实战 - 13：docker 打包部署
author: Potter
date: 2023-07-02 11:45:23

tags:

- Nuxt

categories:

- Nuxt 入门实战
---

# Nuxt 入门实战 - 13：docker 打包部署


## 编写打包配置Dockerfile

> 说明：Dockerfile 放置在项目根目录下
>

```tsx
# use node 16 alpine image
FROM node:16-alpine as builder

# create work directory in app folder
WORKDIR /app

# install required packages for node image
RUN apk --no-cache add openssh g++ make python3 git

# change time zone
ENV TZ=Asia/Shanghai \ DEBIAN_FRONTEND=noninteractive
RUN apk add --no-cache tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# copy over package.json files
COPY package.json /app/
COPY pnpm-lock.yaml /app/

# install pnpm
RUN npm install -g pnpm

# install all depencies
RUN npx pnpm i && pnpm store prune
#RUN npx npm install

# copy over all files to the work directory
ADD . /app

# build the project
RUN npx pnpm build

# start final image
FROM node:16-alpine

WORKDIR /app

# copy over build files from builder step
COPY --from=builder /app  /app

# expose the host and port 3000 to the server
ENV HOST 0.0.0.0
EXPOSE 3000

# run the build project with node
ENTRYPOINT ["node", ".output/server/index.mjs"]
```

## 打包

```bash
docker build -t project_name:[tag] .

# example
docker build -t nuxt_demo:0.0.1 .
```

由于打出来是一个镜像，我们需要推送至远程镜像仓库，方便在服务器通过pull拉取镜像文件，所以我们创建阿里云镜像仓库（为啥不用hub.docker，因为根本没法用，经常登录不上）

## 阿里云创建镜像仓库

- 创建仓库

  ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240507114910.png)

   ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240507114926.png)

   ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20240507114940.png)

## 推送镜像至仓库

```bash
# 1. login mirror repository
docker login --username=username registry.cn-shenzhen.aliyuncs.com
# 2. create tag
docker tag [ImageId] registry.cn-shenzhen.aliyuncs.com/xxx/nuxt_demo:[镜像版本号]
# 3. docker push 
docker push registry.cn-shenzhen.aliyuncs.com/xxx/nuxt_demo:[镜像版本号]

# 说明：xxx 是镜像仓库的命名空间
```

## 启动服务

```bash
# docker pull 
docker pull registry.cn-shenzhen.aliyuncs.com/xxx/nuxt_demo:latest

# docker start
docker run -itd -p 9001:3000 imageid
```

## 自动化脚本

- build.sh

    ```bash
    #!/bin/bash
    
    echo "welcome to local-ubuntu"
    
    cd /home/potter/nuxt-demo
    
    # 拉取最新代码
    git pull
    
    # 修改 .npmrc 文件，让其自动确认避免提示确认选择
    echo "yes=true" >> ~/.npmrc
    
    # install pnpm
    npm install pnpm -g 
    
    # install dependency
    pnpm install --force
    
    # 步骤 1: 打包镜像
    docker build -t nuxt-demo .
    if [ $? -eq 0 ]; then
       echo "打包成功！"
      else
         echo "打包失败，请检查输入的信息。"
           exit 1
    fi
    
    # 提供Docker镜像仓库地址、用户名和密码
    registry="registry.cn-shenzhen.aliyuncs.com"
    username="xxx"
    password="xxx"
    
    # 使用expect来实现自动登录
    expect -c "
    spawn docker login $registry
    expect \"Username: \"
    send \"$username\n\"
    expect \"Password: \"
    send \"$password\n\"
    expect \"Login Succeeded\"
    "
    
    # 检查登录是否成功
    if [ $? -eq 0 ]; then
       echo "登录成功！"
      else
         echo "登录失败，请检查输入的信息。"
           exit 1
    fi
    
    # 给镜像打标签
    new_image_id=$(docker images -q nuxt-demo)
    docker tag $new_image_id registry.cn-shenzhen.aliyuncs.com/e7show/nuxt-demo
    
    # 检查标签是否成功
    if [ $? -eq 0 ]; then
       echo "Docker镜像标签成功！"
      else
         echo "Docker镜像标签失败。"
           exit 1
    fi
    
    # 推送镜像到远程仓库
    docker push registry.cn-shenzhen.aliyuncs.com/e7show/nuxt-demo:latest
    
    # 检查推送是否成功
    if [ $? -eq 0 ]; then
       echo "Docker镜像推送成功！"
      else
         echo "Docker镜像推送失败。"
           exit 1
    fi
    
    echo "全部操作完成。"
    ```

- restart.sh

    ```bash
    echo "welcome 243"
    
    # 步骤 1: pull 最新镜像
    docker pull registry.cn-shenzhen.aliyuncs.com/e7show/nuxt-demo:latest
    
    # 步骤 2: 查询并停止旧容器
    container_name="nuxt-demo"
    container_id=$(docker ps -aqf "name=$container_name")
    
    if [ -n "$container_id" ]; then
        echo "Stopping the existing container: $container_name"
        docker stop $container_id
        docker rm $container_id
    fi
    
    # 步骤 3: 启动容器
    image_id=$(docker images | grep $container_name | sort -k5,5 -r | head -n 1 | awk '{print $3}')
    if [ -n "$image_id" ]; then
        echo "Starting a new container from image: $image_id"
        docker run --name $container_name -itd -p 9001:3000 $image_id
    else
        echo "No image found. Build the image first."
    fi
    ```

- clean.sh

    ```bash
    #!/bin/bash
    
    # 定义要清理的镜像名称
    image_name="registry.cn-shenzhen.aliyuncs.com/e7show/nuxt-demo"
    
    # 获取所有的镜像 ID，根据创建时间进行排序
    image_ids=$(docker images | grep "$image_name" | sort -k5,5 -r | awk '{print $3}')
    
    # 获取镜像数量
    image_count=$(echo "$image_ids" | wc -l)
    
    # 保留的镜像数
    keep_count=1
    
    # 开始清理镜像
    if [ $image_count -gt $keep_count ]; then
      images_to_remove=$(echo "$image_ids" | tail -n +$((keep_count + 1)))
      echo "delete count: $images_to_remove" 
    
      echo "Cleaning up old $image_name images..."
           
      for image_id in $images_to_remove; do
        #docker rmi -f $image_id
        echo "remove $image_id success"
      done
    
      echo "Cleanup complete."
    
    else
          echo "No old $image_name images to clean up."
    fi
    ```

## 参考文献

- [https://cr.console.aliyun.com/cn-shenzhen/instance/repositories](https://cr.console.aliyun.com/cn-shenzhen/instance/repositories)
- **[在生产环境中使用Docker注入变量时，Nuxt3的环境变量为空](https://www.volcengine.com/theme/4033885-Z-7-1)**
- **[Guide: fix all time and timezone problems in Docker](https://hoa.ro/blog/2020-12-08-draft-docker-time-timezone/)**
- [Docker 时区调整方案-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1626811)
