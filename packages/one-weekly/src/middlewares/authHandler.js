import jwt from 'jsonwebtoken'
import { secret } from '../constants/enum'
export default {
    // 获取用户状态
    getStatus: function(ctx, tocken) {
        try {
            let authorization = tocken || ctx.request.header.authorization.split(' ')[1]
            let jwtData = jwt.verify(authorization, secret)
            return jwtData.id
        } catch (error) {
            console.log(error)
            return false
        }
    },
    jwtInvalid: function(ctx, next) {
        return (ctx, next) => {
            let authorization = ctx.request.header.authorization.split(' ')[1]
            let jwtData = jwt.verify(authorization, secret)
            ctx['reqId'] = jwtData.id
            return next().catch(err => {
                if (err.status === 401) {
                    ctx.response.body = {
                        code: '-1999',
                        des: 'token校验失败'
                    }
                } else {
                    throw err
                }
            })
        }
    }
}
