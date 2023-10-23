# 文件寄存系统

## 项目说明

该项目类似于现实中的箱子与钥匙的概念。任何人只要通过相应的钥匙，就能进入相应的箱子，进行物品的增添，移除，查看。目的在于解决文件的传输，存放，绕不开用户的登录，身份的验证等繁琐操作。

> 技术栈：Vue.js/Element/Axios，Node.js/Express，MongoDB,  Docker/Docker Compose

### 数据库设计

每个code即箱子所对应的钥匙，都创建一个collection，表结构如下：

| 键      | 值                                |
| ------- | --------------------------------- |
| _id     | id object                         |
| type    | 文本/文件                         |
| content | url编码后的（文本内容\|文件地址） |
| time    | 存放时间                          |
| name    | 文本名/文件名                     |
| size    | 文本字数/文件大小                 |

### web页面设计

  ![mainPage2](/doc/mainPage2.png)
  ![mainPage1](/doc/mainPage1.png)

### 使用方法

  #### 1. 本地启动

  首先先保证安装了mongodb并且创建了用户root，密码example。可自行到server文件夹中的Database.js修改用户名密码。

其次安装node环境，分别到client与server中进行包依赖安装（`npm install`）。依赖完成后，修改源码前后端请求地址，分别启动。

`client:npm run serve` 

`server:node main`

#### 2. docker-compose

​	改源码前后端请求地址，`docker-compose up --build -d`启动。

