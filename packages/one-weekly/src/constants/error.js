'use strict'

/**
 * Client Failures
 */
module.exports.UNKNOWN_ENDPOINT = {
    code: 'UNKNOWN_ENDPOINT',
    message: '404资源不存在'
}

module.exports.INVALID_REQUEST = {
    code: 'INVALID_REQUEST',
    message: '非法请求'
}

/**
 * Server Errors
 */
module.exports.INTERNAL_ERROR = {
    code: 'INTERNAL_ERROR',
    message: '内部服务器错误'
}

module.exports.UNKNOWN_ERROR = {
    code: 'UNKNOWN_ERROR',
    message: '服务器异常，请稍后再试'
}
