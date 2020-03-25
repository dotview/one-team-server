import crypto from 'crypto'
import moment from 'moment'

export function encrypt(data) {
    // 密码加密
    let key = 'oneteam'
    let cipher = crypto.createCipher('bf', key)
    let newPsd = cipher.update(data, 'utf8', 'hex')
    newPsd += cipher.final('hex')
    return newPsd
}

export function sendErrMsg(ctx, errMsg = '系统错误') {
    // 错误返回
    ctx.response.body = {
        success: false,
        error: errMsg
    }
}

// 返回数据格式初始化
export function initRes() {
    return {
        result: {},
        success: false
    }
}

export function getCookie(req, str) {
    if (req.header.cookie) {
        let arr = req.header.cookie.split('; ')
        let res = ''
        arr.forEach(item => {
            let arrName = item.split('=')
            if (arrName[0] === str) {
                res = arrName[1]
            }
        })
        return res
    }
}

export function getDayOfWeek(date, targetDay) {
    return moment(date).add(targetDay, 'd').format()
}

export function getFirstDayOfWeek(date) {
    return moment(date).startOf('week').format()
}
export function getLastDayOfWeek(date) {
    return moment(date).endOf('week').format()
}

// 获取第几周
export function getYearWeek(date) {
    let a = date.getFullYear(),
        b = date.getMonth(),
        c = dataNow.getDate()
    let date1 = new Date(a, parseInt(b), c),
        date2 = new Date(a, 0, 1)
    let d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
    return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7)
}

export function getDate(date) {
    return moment(date).toDate()
}
