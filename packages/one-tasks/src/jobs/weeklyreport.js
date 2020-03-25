import { Email } from 'one-util'
import report from '../services/report'
import Enum from '../libs/enum'
import template from '../libs/template'

export default function(agenda) {
    agenda.define(Enum.WEEKLYNOTIFY, { priority: 'high', concurrency: 10 }, async function(job, done) {
        let userInfo = await report.findNoReportsUsers()
        // 无人未写时不执行
        if (userInfo.length) {
            let emails = []
            for (let user of userInfo) {
                emails.push(user.eMail)
            }

            let content = template.compile('weekly.html', {to: emails.join(',')})
            let email = new Email()
            await email.sendEmail({
                to: emails.join(','),
                subject: '周报提醒',
                content: content
            })

            done()
        }
    })
    agenda.define(Enum.LASTWEEKLYNOTIFY, { priority: 'high', concurrency: 10 }, async function(job, done) {
        let userInfo = await report.findNoReportsUsers(true)
        // 无人未写时不执行
        if (userInfo.length) {
            let emails = []
            for (let user of userInfo) {
                emails.push(user.eMail)
            }

            let content = template.compile('lastweekly.html', {to: emails.join(',')})
            let email = new Email()
            await email.sendEmail({
                to: emails.join(','),
                subject: '上周周报提醒',
                content: content
            })

            done()
        }
    })
}
