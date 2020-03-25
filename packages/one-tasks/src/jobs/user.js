import { Email } from 'one-util'
import report from '../services/report'
import Enum from '../libs/enum'

export default function(agenda) {
    agenda.define(Enum.SENDEMAIL, async function(job, done) {
        var data = job.attrs.data

        let email = new Email()
        await email.sendEmail({
            to: data.to,
            subject: data.subject,
            content: data.content
        })

        done()
    })
    agenda.define(Enum.REGISTEREMAIL, async function(job, done) {
        var data = job.attrs.data
        let userInfo = await report.findUserById(data.userId)
        // console.log(userInfo)

        let email = new Email()
        await email.sendEmail({
            to: userInfo.eMail,
            subject: 'Thanks for registering',
            content: 'Thanks for registering'
        })
        done()
    })
}
