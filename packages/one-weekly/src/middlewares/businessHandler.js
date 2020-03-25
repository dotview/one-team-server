'use strict'
// const { INVALID_REQUEST, UNKNOWN_ERROR } = require('../constants/error')

/**
 * HTTP Status codes
 */
const statusCodes = {
    PARAMES_NEEDED: -2,
    LOGIN_NEEDED: -99
}
function businessHandler() {
    return async (ctx, next) => {
        ctx.res.msg = (message = null) => {
            ctx.body = {
                status: 'fail',
                code: statusCodes.PARAMES_NEEDED,
                message
            }
        }

        ctx.res.needlogin = (message = null) => {
            ctx.body = {
                status: 'fail',
                code: statusCodes.LOGIN_NEEDED,
                message
            }
        }
        await next()
    }
}

module.exports = businessHandler
