import nodemailer from 'nodemailer'

class Email {
    constructor() {
        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
            host: process.env['email.host'] || 'smtp.exmail.qq.com',
            port: 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: process.env['email.user'],
                pass: process.env['email.pass']
            }
        })
    }

    async sendEmail(option) {
        let to = process.env.NODE_ENV === 'production' ? process.env['email.to'] + ',' + option.to : process.env['email.to']
        let content = option.content
        let mailOptions = {
            from: process.env['email.from'], // 发送者
            to: to, // 接受者,可以同时发送多个,以逗号隔开
            subject: option.subject, // 标题
            html: content
        }

        let ret
        try {
            ret = await this.transporter.sendMail(mailOptions)
        } catch (e) {
            console.log(e)
        }
        // console.log('Mail result:--------', ret)
        return ret
    }
}

export default Email
