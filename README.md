﻿# hapi-shopping
基于hapi的Node.js小程序后端

```
安装依赖
npm install

开启服务
node app.js

监测代码改动自动重启
supervisor app.js
```

---

hapi的原始版本使用Express框架。是一个用来构建基于Node.js的应用和服务的富框架，能够帮助我们把关注重点放在高可用的应用业务逻辑层而不是构建架构。hapi的官方GitHub Reposutories中，提供了大量的常用高质量插件，基本覆盖Web应用开发常用的功能，比如输入验证、缓存、认证等。这里使用hapi的v16版本。

## 环境配置
在项目的实践过程中，需要和一些敏感的数据信息打交道，比如数据库的连接用户名、密码、第三方SDK的secret等。这些参数的配置信息，原则上是禁止进入git版本仓库的。于是考虑引入一个被.gitgnore的.env文件，以key-value的方式，记录系统中所需要的可配置环境参数。并同时配置一个.env.example的示例配置文件用来放置占位，.env.example可以放心地进入git版本仓库。Node.js可以通过env2的插件读取.env配置文件，加载后的环境配置参数，可以通过如process.env.PORT来读取端口信息。

## Swagger && Joi
Swagger是一种与语言无关的接口描述，帮助我们在看不到具体源码的情况下能发现和理解各种服务的功能。并通过Swagger-ui的网页输出，形成一套美观简介的可视化文档。Joi是一个验证模块，因其丰富的功能，使得验证数据结构与数值的合规变得格外容易。这里，使用hapi-swagger插件用于生成接口文档，Joi用于校验数据结构。运行程序后，可以通过访问：http://127.0.0.1:3000/documentation 查看暴露接口的Swagger文档。

## MySQL && Sequelize
这里，使用的数据库为MySQL 5.6。Sequelize是Node.js生态中一款基于Promise数据库PRM插件，提供了大量常用数据库增删改查的函数式API，帮助我们在实际开发中，减少书写大量冗长的基础数据库查询语句。Sequelize支持的数据库有：PostgreSQL、MySQL、MariaDB、SQLite和MSSQL。在使用不同数据库时候，需要额外安装不同的对应数据库驱动，这里依赖插件mysql。

```
完成数据库的创建
node_modules/.bin/sequelize db:create

创建一个迁移文件
node_modules/.bin/sequelize migration:create --name create-XXXXX-table

将migrations目录下的迁移行为定义，进行自动化创建
node_modules/.bin/sequelize db:migrate

按照down方法中定义的规则回退
node_modules/.bin/sequelize db:migrate:undo

向表中追加字段
node_modules/.bin/sequelize migration:create --name add-columns-to-shops-table

在seeders文件夹中创建一个种子文件
node_modules/.bin/sequelize seed:create --name init-shops

向数据库填充seeders目录中所有up方法所定义的数据
node_modules/.bin/sequelize db:seed:all
```
## 使用JWT进行身份验证 （JSON Web Token）
### 传统的身份验证
前端登录，后端根据用户信息生成一个token,并保存这个token和对应的用户ID到数据库或session中，接着把token传给用户，存入浏览器Cookie，之后浏览器请求带上这个Cookie，后端根据Cookie中的session信息来查询用户，验证是否过期。基于Cookie的解决方案，会对token加以HttpOnly处理，防止前端客户端直接获取token，能有效避免XSS攻击。
### 基于JWT的身份验证
JWT具有紧凑与自包含的两大特点：
* 紧凑：由于JWT自身体积较小，可以通过HTTP请求的header中（身份验证时一般放在Authorization字段里）传递，或者通过URL传递（少数情况的一次性JWT等）。较小的体积带了了较好的网络传输速度。
* 自包含：JWT的payload中能够包含系统所需要的非敏感性关键业务数据，比如用户ID，避免频繁查询数据库。
JWT由header、payload、signature三部分组成，使用点号.分割。
```
# header：指定该JWT使用的签名算法
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
# payload：包含了该JWT的签发内容信息
eyJ1c2VySWQiOjEsImV4cCI6MTUzNTMyMjc0NSwiaWF0IjoxNTM0NzE3OTQ1fQ.
# signature：验证签发数据的合法性，是否存在第三方篡改伪造行为
6tOdn2R82bxJbXjAnwU5g4g9EKqGNe-qo4qCo6UZnQ4...
```

该案例参考自掘金小册：[基于hapi的Node.js小程序后端开发实践指南](https://juejin.im/book/5b63fdba6fb9a04fde5ae6d0)