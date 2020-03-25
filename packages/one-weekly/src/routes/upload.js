import Util from '../controllers/util'
import koaRouter from 'koa-router'

const router = koaRouter()

router.post('/api/v1/file/user', Util.uploadImg)
export default router
