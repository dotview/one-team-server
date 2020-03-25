import { Email } from 'one-util'
import forum from '../services/forum'
import Enum from '../libs/enum'
import template from '../libs/template'

export default function(agenda) {
    agenda.define(Enum.FORUMWEEKLYNOTIFY, { priority: 'high', concurrency: 10 }, async function(job, done) {
        let userInfo = await forum.findNoForumUsers()
        // 无人未写时不执行
        if (userInfo.length) {
            let emails = []
            for (let user of userInfo) {
                emails.push(user.eMail)
            }

            let content = template.compile('forum.html', {to: emails.join(',')})
            let email = new Email()
            await email.sendEmail({
                to: emails.join(','),
                subject: '分享提醒',
                content: content
            })

            done()
        }
    })
}
