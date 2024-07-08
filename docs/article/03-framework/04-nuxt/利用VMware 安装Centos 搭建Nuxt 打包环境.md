# 利用VMware 安装Centos 搭建Nuxt 打包环境

---

title: 利用VMware 安装Centos 搭建Nuxt 打包环境
author: Potter
date: 2023-7-13 11:56

tags:

- Nuxt
- Centos
- VMware

categories:

- Nuxt

...

VMware 安装Centos 网上教程一大把，我就不在这里赘述了。

## Centos 环境搭建

### 重置Centos Root 密码

[重置Centos Root 密码](https://linuxhint.com/recover_root_password_centos/)

更多操作：切换至root角色命令

```bash
//进入root 角色
su
输入root密码
```

### 自动以root 身份登录

免得每次都需要切换成root角色才能操作

```bash
vim **/etc/gdm/custom.conf
找到[daemon]部分

添加一下两句(注意：如果存在对应预计，对应着修改)
AutomaticLoginEnable=True
AutomaticLogin=root

退出reboot即可**
```

### 配置虚拟机网络

由于需要外部可以访问虚拟机服务，所以我们选择桥接模式。[相关资料](https://blog.csdn.net/zhangxm_qz/article/details/122612605)

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710175240.png)

> 注意：确保主机和虚拟机的ip地址在同一个网段，然后网关和子网掩码跟主机的是一样的。打开虚拟机Centos 配置文件
>

```bash
vim /etc/sysconfig/network-scripts/ifcfg-ens160
添加以下图示内容
```

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710175431.png)

### 开放22和3000端口

由于centos 8开始都采用firewalld来管理端口，所以用firewalld开配置策略

```bash
# add open port
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=22/tcp

# reload
sudo firewall-cmd --reload

# firewalld port status
sudo firewall-cmd --list-all
```

![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710175459.png)

### Centos 磁盘空间不足，拓展磁盘

如果你磁盘空间设置的够用，可以跳过此段内容

操作步骤：

1. 关闭虚拟机，调整磁盘空间大小

   ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710175536.png)

2. 创建挂载点：选择一个目录作为您的挂载点。例如，您可以在 **`/mnt`** 目录下创建一个新的目录，例如 **`/mnt/mydisk`**：

    ```bash
    sudo mkdir /mnt/mydisk
    ```

3. 挂载分区：使用以下命令将分区挂载到先前创建的挂载点上。将 **`<partition>`** 替换为您要挂载的分区设备名称，例如  **/dev/nvme0n1p4**，将 **`<mount_point>`** 替换为先前创建的挂载点路径：

    ```bash
    sudo mount <partition> <mount_point>
    ```

    例如：

    ```bash
    sudo mount **/dev/nvme0n1p4** /mnt/mydisk
    ```

4. 检查挂载：运行 **`df -h`** 命令，您应该能够看到新挂载的分区，并在挂载点处显示其容量信息。

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710175804.png)

    > 说明：看到**/dev/nvme0n1p4，**说明成功了

### yum install 安装报错：`[Failed to download metadata for repo 'AppStream'](https://techglimpse.com/failed-metadata-repo-appstream-centos-8/)`

Centos 8 2021年12月31 停止维护，Centos 8 不在从官方Centos 获取开发资源。所以修改镜像资源路径

解决方法

1. `cd /etc/yum.repos.d/`
2. 运行以下2条命令

    ```bash
    sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
    ```

3. `yum update -y`

## 安装Node 环境

由于在日后的开发中，肯定会碰到不同的项目需要的node项目版本不一样，所以我们用NVM来管理node 将会使日后开发非常方便

### 安装NVM

1. `sudo yum install curl -y`
2. `curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash`
3. `source ~/.bashrc`
4. nvm install node-version-num  比如：nvm install 16.15.1

    > 说明：如何你不知道有哪些那边，可通过nvm ls-remote 查看
    >

相关资料：****[How To Install NVM on CentOS/RHEL 7](https://tecadmin.net/how-to-install-nvm-on-centos-7/)****

如果通过nvm 安装node，无论安装什么node版本都是，找不到对应版本信息：Version 'node' not found。[相关资料](https://stackoverflow.com/questions/26476744/nvm-ls-remote-command-results-in-n-a/36300754)

解决办法：

```bash
changing from
export NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist/
to
export NVM_NODEJS_ORG_MIRROR=https://nodejs.org/dist/
```

## 安装Docker 环境

1. install docker-ce

    ```bash
    sudo dnf install --nobest docker-ce
    ```

    > 说明：—nobest：不适用最佳包，因为安装最佳包可能会失败。
    >
2. 启动Docker 守护进程

    ```bash
    sudo systemctl enable --now docker
    ```

    可以通过以下命令查看是否以及激活和启用

    ```bash
    systemctl is-active docker
    systemctl is-enabled docker
    ```

## Docker 打包和部署

### 安装git

```bash
yum install git
```

### 获取示例代码

```bash
mkdir /Documents/workspace
cd /Documents/workspace

git clone https://github.com/yxw007/Nuxt-started-demo.git

cd Nuxt-started-demo
npm isntall
```

### 创建Dockerfile

> 说明：Dockerfile 配置文件放置在getting-started 项目根目录下
>

```bash
# use node 16 alpine image
FROM node:16-alpine as builder

# create work directory in app folder
WORKDIR /app

# install required packages for node image
RUN apk --no-cache add openssh g++ make python3 git

# copy over package.json files
COPY package.json /app/
COPY package-lock.json /app/

# install all depencies
RUN npx npm ci && npm cache clean --force

# copy over all files to the work directory
ADD . /app

# build the project
RUN npx npm run build

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

## Docker build

```bash
docker build -t dockerHubAccount/Name:Tag .

example:

docker build -t aa4790139/nuxt-started-demo:1.0.1 .
```

## Docker run image

1. docker image ls ，get image id

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710175919.png)

2. docker run -itd -p dockerPort:localPort imageID

    > 注意：一定要加上-itd，否则启动后就是Unable to Connect。 [相关资料](https://blog.csdn.net/weixin_44847332/article/details/123785555)
    >

    ```bash
    docker run -itd -p dockerPort:localPort imageID
    example:
    docker run -itd -p 3000:3000 a4a5e167de0c
    ```

    访问你虚拟机ip和3000端口，效果如下：

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710175950.png)

    如果你看到这个界面，那么恭喜你docker 运行 nuxt app 成功了

由于我们不可能打出来的image仅运行在我们的虚拟机中，我们将包推送至docker hub，然后看看我们的image 有没有问题。

### 推送镜像至docker hub

1. 首先：我们需要登录docker hub 创建对应的仓库

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180002.png)

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180010.png)

2. 其次：设置access token，设置好access token 后才能使我们打出来的image 推送至对应参考

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180024.png)

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180031.png)

3. 然后将image 推送至刚创建的仓库中

    ```bash
    docker push aa4790139/nuxt-started-demo:1.0.1
    ```

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180040.png)

4. 最后：利用docker play 验证，[平台地址](https://labs.play-with-docker.com/)

    ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180048.png)

    - 拉取镜像文件

        ```bash
        docker pull aa4790139/nuxt-started-demo:1.0.1
        
        ```

    - 运行镜像

        ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180100.png)

    - 效果如下：

        ![](https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master//img/20230710180106.png)

        > 提示：**如果看到这个界面，恭喜你成功了**。 🎉🎉🎉🎉
        >

文章内容有点长，希望能帮助到你，感谢你的耐心阅读，当然也非常感谢文章外链文章作者，没有他们帮助我不可能成功。

## 参考文献

- [https://answers.netlify.com/t/nuxt-3-deploy-failed-rollup-failed-to-resolve-import-vue/77680/26](https://answers.netlify.com/t/nuxt-3-deploy-failed-rollup-failed-to-resolve-import-vue/77680/26)
- [https://linuxconfig.org/how-to-install-docker-in-rhel-8](https://linuxconfig.org/how-to-install-docker-in-rhel-8)
- [https://dev.to/rafaelmagalhaes/docker-and-nuxt-3-18nm](https://dev.to/rafaelmagalhaes/docker-and-nuxt-3-18nm)
