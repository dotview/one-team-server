## [1.4.2](/one-team-server/compare/v1.4.0...v1.4.2) (2019-11-25)


### Bug Fixes

* **db:** 修改线上/测试地址 ([5af4995](/one-team-server/commit/5af4995))
* **okr:** 解决分页过滤出错的问题 ([5ef6591](/one-team-server/commit/5ef6591))



# [1.4.0](/one-team-server/compare/v1.3.5...v1.4.0) (2019-11-25)


### Features

* **okr:** okr 初步交互完成 ([44c54ce](/one-team-server/commit/44c54ce))



## [1.3.5](/one-team-server/compare/v1.3.4...v1.3.5) (2019-10-14)


### Features

* **forum:** 调整周报和论帖邮件提醒时间 ([60c81c9](/one-team-server/commit/60c81c9))
* **forum:** 设置白名单的成员同时忽略分享邮件提醒 ([f093dbf](/one-team-server/commit/f093dbf))



## [1.3.4](/one-team-server/compare/v1.3.3...v1.3.4) (2019-09-24)


### Bug Fixes

* add apollo config && fixed email task ([9935d69](/one-team-server/commit/9935d69))
* apollo only has dev env ([4620e55](/one-team-server/commit/4620e55))
* no user report fixed ([f146896](/one-team-server/commit/f146896))


### Features

* **forum:** 论坛列表按时间早晚进行排序 ([fde6b2b](/one-team-server/commit/fde6b2b))
* **forum:** 论坛模块显示未写论帖的成员 ([ebcc3f2](/one-team-server/commit/ebcc3f2))
* **forum:** 论坛填写邮件提醒 ([268dd98](/one-team-server/commit/268dd98))



## [1.3.3](/one-team-server/compare/v1.3.2...v1.3.3) (2019-09-05)


### Features

* **forum:** 列表页显示评论数 ([2443b07](/one-team-server/commit/2443b07))



## [1.3.2](/one-team-server/compare/v1.3.1...v1.3.2) (2019-09-04)


### Features

* **forum:** 成员可在一周内发布多条论帖 ([4f1c766](/one-team-server/commit/4f1c766))
* **forum:** 论坛内容划分小组显示 ([06d36c7](/one-team-server/commit/06d36c7))
* **forum:** 实名显示点赞 ([27d405b](/one-team-server/commit/27d405b))



## [1.3.1](/one-team-server/compare/v1.3.0...v1.3.1) (2019-08-29)


### Bug Fixes

* **dburl:** 恢复moongoDB链接地址 ([e097af0](/one-team-server/commit/e097af0))
* **dburl:** 修改moongodb地址 ([687515d](/one-team-server/commit/687515d))
* **url:** 尝试将url写死 ([b544e2b](/one-team-server/commit/b544e2b))


### Features

* **forum:** 上线点赞功能 ([a56bde9](/one-team-server/commit/a56bde9))



# [1.3.0](/one-team-server/compare/v1.2.0...v1.3.0) (2019-08-23)


### Features

* **forum:** 新增论坛模块 ([6ddea0d](/one-team-server/commit/6ddea0d))
* **report:** 所有成员周报由之前的分页加载改成滚动懒加载 ([abecbb6](/one-team-server/commit/abecbb6))



# [1.2.0](/one-team-server/compare/v1.1.0...v1.2.0) (2019-07-11)


### Features

* **team:** 增加[邮件白名单]功能 ([e847e3e](/one-team-server/commit/e847e3e))



# [1.1.0](/one-team-server/compare/v1.0.9...v1.1.0) (2019-07-08)


### Bug Fixes

* **member:** 修复删除成员报错的问题 ([04f83cc](/one-team-server/commit/04f83cc))
* **report:** 大管理员默认看到的周报以分页的形式展示 ([2692047](/one-team-server/commit/2692047))
* **report:** 兼容小程序获取所有周报接口 ([11f52b5](/one-team-server/commit/11f52b5))
* **report:** 兼容小程序接口改造 ([2082aa9](/one-team-server/commit/2082aa9))
* **report:** sorry,忘把一段代码放开了 ([771d71b](/one-team-server/commit/771d71b))


### Features

* **answer:** delete ([74a53db](/one-team-server/commit/74a53db))
* **pagination:** 添加分页功能 ([0addf43](/one-team-server/commit/0addf43))
* **team:** 暂且规定成员只能属于一个组,不能属于多个组 ([7f7cc2e](/one-team-server/commit/7f7cc2e))


### Performance Improvements

* **report:** 将服务端一周的开始时间统一为周一 ([abd681e](/one-team-server/commit/abd681e))
* **report:** 将获取全部成员周报数据和小组成员周报数据放在一个接口逻辑 ([24ffc3a](/one-team-server/commit/24ffc3a))


### BREAKING CHANGES

* **pagination:** 可能会影响到小程序
* **report:** 可能会影响到之前的周报的获取



## [1.0.9](/one-team-server/compare/v1.0.8...v1.0.9) (2019-01-15)


### Bug Fixes

* **test:** re ([22eaa6a](/one-team-server/commit/22eaa6a))
* **test:** report ([7b8a757](/one-team-server/commit/7b8a757))


### Features

* **test:** bug ([6db878d](/one-team-server/commit/6db878d))



## [1.0.8](/one-team-server/compare/v1.0.7...v1.0.8) (2019-01-07)


### Bug Fixes

* **model:** address ([2a57766](/one-team-server/commit/2a57766))
* **package:** env ([c934bb2](/one-team-server/commit/c934bb2))
* **test:** test ([84a2b00](/one-team-server/commit/84a2b00))
* **test:** test ([58fd910](/one-team-server/commit/58fd910))
* **test:** test1 ([aac9520](/one-team-server/commit/aac9520))


### Features

* **test:** bug ([fb2435e](/one-team-server/commit/fb2435e))


### Performance Improvements

* **report:** 接口兼容小程序 ([06b5ded](/one-team-server/commit/06b5ded))



## [1.0.7](/one-team-server/compare/v1.0.6...v1.0.7) (2019-01-04)


### Bug Fixes

* **msgbox:** 兼容微信小程序不支持patch ([01a4475](/one-team-server/commit/01a4475))


### Performance Improvements

* **report:** 设置默认endDate ([7ecee2d](/one-team-server/commit/7ecee2d))



## [1.0.6](/one-team-server/compare/v1.0.5...v1.0.6) (2019-01-03)


### Bug Fixes

* **report:** 评论条数错误 ([a18adc6](/one-team-server/commit/a18adc6))


### Features

* **env:** add development ([83c135b](/one-team-server/commit/83c135b))
* **report:** 个人中心 ([15959fb](/one-team-server/commit/15959fb))


### Performance Improvements

* **report:** 修改获取周报详情的参数 ([50e0ea3](/one-team-server/commit/50e0ea3))



## [1.0.5](/one-team-server/compare/v1.0.4...v1.0.5) (2018-12-25)


### Bug Fixes

* 兼容小程序 ([ef61ed2](/one-team-server/commit/ef61ed2))



## [1.0.4](/one-team-server/compare/v1.0.3...v1.0.4) (2018-12-19)


### Performance Improvements

* **db:** test ([a7928a3](/one-team-server/commit/a7928a3))



## [1.0.3](/one-team-server/compare/v1.0.2...v1.0.3) (2018-12-12)


### Bug Fixes

*  remove test file ([5865115](/one-team-server/commit/5865115))
*  remove test file ([9ce126a](/one-team-server/commit/9ce126a))
*  remove test file ([b2b9754](/one-team-server/commit/b2b9754))
* 静态文件绕过jwt ([e709d37](/one-team-server/commit/e709d37))
* 静态文件绕过jwt smallcase ([3cf1ba6](/one-team-server/commit/3cf1ba6))
* **msgbox:** 重复通知 ([ad7d607](/one-team-server/commit/ad7d607))


### Features

* update docs path ([4d20a14](/one-team-server/commit/4d20a14))
* **msgbox:** 评论回复通知上家 ([aa17094](/one-team-server/commit/aa17094))
* 更新dockerfile ([ebbc8bc](/one-team-server/commit/ebbc8bc))
* 关注优化 ([e411dd6](/one-team-server/commit/e411dd6))
* 修改定时任务时间为中国时区 ([cf32875](/one-team-server/commit/cf32875))



## [1.0.2](/one-team-server/compare/30ec46b...v1.0.2) (2018-12-03)


### Bug Fixes

* **msgbox:** 全部标记已读 ([258aa40](/one-team-server/commit/258aa40))


### Features

* **cc:** 添加commit check 工具 ([30ec46b](/one-team-server/commit/30ec46b))



