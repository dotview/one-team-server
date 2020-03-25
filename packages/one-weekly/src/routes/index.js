/*
 * @Description: In User Settings Edit
 * @Author: 沈浩
 * @Date: 2018-12-27 10:03:29
 * @LastEditTime: 2019-08-20 20:43:57
 * @LastEditors: Please set LastEditors
 */
import Router from 'koa-router'
import jwt from 'koa-jwt'
import { secret } from '../constants/enum'

import compose from 'koa-compose'
import applicationRouter from './application.js'
import commonRouter from './common.js'
import userRouter from './user.js'
import pwdresetRoter from './pwdreset.js'
import subscriptRouter from './subscript.js'
import teamRouter from './team.js'
import utilRouter from './util.js'
import reportRouter from './report.js'
import specRouter from './spec.js'
import answerRouter from './answer.js'
import msgboxRouter from './msgbox.js'
import forumRouter from './forum.js'
import okrsRouter from './okrs.js'

// 待更换成restful接口
const router = new Router()

const routes = compose([
    applicationRouter.routes(),
    commonRouter.routes(),
    utilRouter.routes(),
    pwdresetRoter.routes(),
    jwt({ secret }).unless({ path: [/styles/, /scripts/, /docs/] }),
    userRouter.routes(),
    specRouter.routes(),
    subscriptRouter.routes(),
    teamRouter.routes(),
    reportRouter.routes(),
    answerRouter.routes(),
    msgboxRouter.routes(),
    forumRouter.routes(),
    okrsRouter.routes(),
    router.routes()
])

export default routes
