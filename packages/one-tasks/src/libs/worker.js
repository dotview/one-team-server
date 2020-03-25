import setenv from './setenv'
import agenda from './agenda'
import Enum from './enum'
/**
 * '0,30 16,17 * * 5' cron表达式
 * @return {[type]} [description]
 */
agenda.on('ready', function() {
    if (process.env.NODE_ENV === 'production') {
        agenda.every('0 0 16,17 * * 5', Enum.WEEKLYNOTIFY, {
            timezone: 'Asia/Shanghai'
        })

        agenda.every('30 10,11 * * 1', Enum.LASTWEEKLYNOTIFY, {
            timezone: 'Asia/Shanghai'
        })

        agenda.every('0 0 15,17 * * 2,4', Enum.FORUMWEEKLYNOTIFY, {
            timezone: 'Asia/Shanghai'
        })
    } else {
        // 本地调试周报邮件开启
        // agenda.now(Enum.LASTWEEKLYNOTIFY)
        // 本地调试分享邮件开启
        // agenda.now(Enum.FORUMWEEKLYNOTIFY)
    }
    agenda.start()
})

agenda.on('complete', job => {
    console.log(`Job ${job.attrs.name} finished`, new Date())
})
