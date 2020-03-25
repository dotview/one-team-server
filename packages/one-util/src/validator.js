/**
 * 全局校验类
 */

// 校验团队名称
export function checkTeamName(str) {
    return /[\u4e00-\u9fa5A-Za-z0-9-_]{2,12}$/.test(str)
}

// 校验昵称
export function checkNickName(str) {
    return /^[\u4e00-\u9fa5A-Za-z0-9-_]{2,12}$/.test(str)
}

// 校验密码(6-12位字母数字符号组合)
export function checkPwd(str) {
    return /^(?=.*\d)(?=.*[A-Za-z]).{8,16}$/g.test(str)
    // return str && /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,12}/.test(str)
}

// 校验邮箱
export function checkEmail(str) {
    return str && /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(str)
}

// 校验手机号
export function checkPhoneNum(str) {
    return str && /^1\d{10}$/.test(str)
}

// 校验QQ号
export function checkQqNum(str) {
    return /^[1-9][0-9]{4,9}$/.test(str)
}
// 校验验证码
export function checkCode(str) {
    return /^\d{6}$/.test(str)
}
