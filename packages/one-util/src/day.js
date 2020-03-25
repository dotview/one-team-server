import moment from 'moment'

moment.locale('zh-cn', {
    week: {
        dow: 1 // Monday is the first day of the week
    }
})
// console.log(moment('2019-01-13').startOf('week').format('YYYY-MM-DD'))
// 日期格式化
export const dateFormat = (date = throwIfMissing(), format = 'YYYY-MM-DD') => {
    return moment(date).format(format)
}
// 日期格式化为月日
export const dateFormatCN = (date = throwIfMissing()) => {
    return `${getMonth(date, 'M')}月${getDay(date, 'D')}日`
}
// 获取日期的年份
export const getYear = date => {
    return moment(date).year()
}
// 获取日期的月份
export const getMonth = (date, format = 'MM') => {
    let month = moment(date).month() + 1
    if (format === 'M') {
        return month
    } else if (format === 'MM') {
        if (month <= 9) {
            month = '0' + month
        }
        return month
    }
}
// 获取日期的星期
export const getWeek = date => {
    return moment(date).day()
}
// 获取日期的天份
export const getDay = (date, format = 'DD') => {
    let day = moment(date).date()
    if (format === 'D') {
        return day
    } else if (format === 'DD') {
        if (day <= 9) {
            day = '0' + day
        }
        return day
    }
}
// 获取日期是一年的第几周
export const getWeekOfYear = date => {
    return moment(date).week()
}
// 获取日期所在周的第一天
export const getFirstDayOfWeek = (date = new Date(), format = 'YYYY-MM-DD') => {
    if (format === 'timestamp') {
        return moment(date).startOf('week').valueOf()
    } else if (format === 'object') {
        return new Date(moment(date).startOf('week').format('YYYY-MM-DD'))
    } else {
        return moment(date).startOf('week').format(format)
    }
}
// 获取日期所在周的最后一天
export const getLastDayOfWeek = (date = new Date(), format = 'YYYY-MM-DD') => {
    if (format === 'timestamp') {
        return moment(date).endOf('week').valueOf()
    } else if (format === 'object') {
        return new Date(moment(date).endOf('week').format('YYYY-MM-DD'))
    } else {
        return moment(date).endOf('week').format(format)
    }
}
// 获取日期对应的下一周的日期
export const getDayOfNextWeek = (date = new Date(), format = 'YYYY-MM-DD') => {
    if (format === 'timestamp') {
        return moment(date).add(7, 'day').valueOf()
    } else if (format === 'object') {
        return new Date(moment(date).add(7, 'day').format('YYYY-MM-DD'))
    } else {
        return moment(date).add(7, 'day').format(format)
    }
}
// 获取日期对应的上一周的日期
export const getDayOfPrevWeek = (date = new Date(), format = 'YYYY-MM-DD') => {
    if (format === 'timestamp') {
        return moment(date).subtract(7, 'day').valueOf()
    } else if (format === 'object') {
        return new Date(moment(date).subtract(7, 'day').format('YYYY-MM-DD'))
    } else {
        return moment(date).subtract(7, 'day').format(format)
    }
}
// 判断两个日期是否在同一周
export const isSameWeek = (date1 = throwIfMissing(), date2 = throwIfMissing()) => {
    return getFirstDayOfWeek(date1) === getFirstDayOfWeek(date2)
}
// 判断两个日期相差多少周（包括两个日期所在周）
export const differWeek = (date1 = throwIfMissing(), date2 = throwIfMissing()) => {
    let firstDayOfWeek = moment(date1).startOf('week')
    let lastDayOfWeek = moment(date2).endOf('week')
    return lastDayOfWeek.diff(firstDayOfWeek, 'week') + 1
}

function throwIfMissing() {
    throw new Error('function missing parameter')
}
