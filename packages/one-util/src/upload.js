const co = require('co')
const OSS = require('ali-oss')
const dateformat = require('dateformat')
const path = require('path')

const client = new OSS({
    region: process.env['oss.region'] || 'xxx',
    accessKeyId: process.env['oss.accessKeyId'] || 'xxx',
    accessKeySecret: process.env['oss.accessKeySecret'] || 'xxx',
    bucket: 'img'
})

const dateStr = dateformat(new Date(), 'yyyymm')
const uploadDir = `static/img/${dateStr}/`
const uploadDir2 = 'static/'

module.exports = {
    config(accessKeyId, accessKeySecret) {
        client.options.accessKeyId = accessKeyId
        client.options.accessKeySecret = accessKeySecret
    },
    upload: co.wrap(function* (local, destName, reName = true) {
        if (reName) {
            const filePrex = dateformat(new Date(), 'ddHHMMssl')
            destName = uploadDir + filePrex + path.extname(destName)
        } else {
            destName = uploadDir2 + destName
        }
        const result = yield client.put(destName, local)
        return yield Promise.resolve(result)
    })
}
