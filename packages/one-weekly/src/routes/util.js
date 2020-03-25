import User from '../controllers/user'
import { serviceUtil, uploadUtil } from 'one-util'
import businessUtil from '../util/business'
import koaRouter from 'koa-router'
import multer from 'koa-multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    // 文件保存路径
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../static'))
        // cb(null, './')
    },
    // 修改文件名称
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split('.')
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
})
// 加载配置
var upload = multer({storage: storage})

const router = koaRouter()

router.post('/api/v1/file/user', upload.single('file'), (ctx, res, next) => {
    ctx.response.body = {success: true}
    let filename = ctx.req.file.filename
    let localPath = path.join(__dirname, '../../static/' + filename)
    uploadUtil.upload(localPath, filename).then((val) => {
        fs.unlinkSync(localPath)
        if (val.res && val.res.status === 200) {
            let url = val.url
            let token = serviceUtil.getCookie(ctx, 'token')
            let userId = businessUtil.getStatus(ctx, token)
            // let urlParam = ctx.request.url.split('/')
            // let type = urlParam[urlParam.length - 1]
            // if (type === 'user') {
            User.updateHead(userId, url)
            // }
        }
    }).catch((res) => {
        ctx.res.fail({message: res})
    })
})

export default router
