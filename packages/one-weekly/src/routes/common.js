import multer from 'koa-multer'
import koaRouter from 'koa-router'

const router = koaRouter()
const upload = multer({ dest: 'uploads/' })

router.post('api/v1/picture', upload.single('avatar'), async(ctx, next) => {
    console.log(ctx)
    let result = {
        result: {
            filename: ctx
        },
        success: true
    }

    ctx.response.body = result
})

export default router
