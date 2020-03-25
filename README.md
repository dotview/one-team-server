# one-team-server node.js server 

[![Build Status](https://travis-ci.org/Aiyoumi-FE/one-team-server.svg?branch=master)](travis-badge-url)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

#### 一. 前期的准备

1. 项目下载地址
    服务端：https://github.com/dotview/one-team-server
    pc端：https://github.com/dotview/one-team-web
    小程序：https://github.com/dotview/one-team-minapp
2. node 版本 8.0.0 以上
3. mongo 数据库
4. 数据库可视化，推荐Robo 3T吧，不是非要本地启起来mongo，Robo 3T才可以连
5. 下载地址：https://robomongo.org/download
6. one-team-server 目录下
```
    npm i lerna -g
    npm run bootstrap
    npm start ➡️
```

#### 二. 项目整体结构
##### lerna
1. 简介：用于管理具有多个包的JavaScript项目的工具。
功能：将大型代码库拆分为单独的独立版本包
```
one-team-server/
  package.json
  packages/
    one-models/
      package.json
    one-tasks/
      package.json
    one-util/
      package.json
    one-weekly/
      package.json
```
2. 项目中用到的命令
```
lerna bootstrap // 把项目的依赖连接在一起
lerna run <script> -- [..args] # runs npm run my-script in all packages that have it
```

##### one-models
mongoDB数据库 mongoose库
1. 简单的概念：
集合（表） 文档（数据） 文档型数据库
2. 常用命令
（1）定义一个集合
```
const Schema = mongoose.Schema

const reportSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' }, // 用户id
    teamId: { type: Schema.Types.ObjectId, ref: 'team' }, // 团队id
    content: { type: String }, // 周报内容
    type: { type: String }, // 周报类型
    beginDate: { type: Date } // 周报开始时间
}, {
    versionKey: false, // 去掉版本锁 _v
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
})
```

（2）插条数据
```
let userReg = new UserModel({
    eMail: formData.eMail,
    nickName: formData.nickName,
    userPassword: formData.userPassword,
    teamId: teamId // 团队id
})
await userReg.save()
```
（3）修改数据
```
await ReportModel.update(oldValue, newData)({
     _id: formData._id
}, {
    $set: { content: formData.content }
})
```
（4）删除数据
```
await ReportModel.remove({ '_id': formData.reportId })
```
（5）populate方法
```
let weeklyList = await ReportModel
    .find({ 'beginDate': { $gte: beginDate, $lte: endDate }, 'teamId': teamId, 'type': type })
    .populate('userId', '_id headPortrait nickName')
    .exec()
```
（6）用mongoose得到的对象不能增加属性
```
  let teamInfo = JSON.parse(JSON.stringify(teamInfoData)
```
##### 登陆
Jwt（JSON Web Token）
- header
- payload
- secret

https://ninghao.net/blog/2834

over