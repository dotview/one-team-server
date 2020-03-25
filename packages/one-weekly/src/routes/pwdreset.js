import User from '../controllers/user'
import koaRouter from 'koa-router'

const router = koaRouter()
router.post('/api/v1/user/emailCode', User.emailCode)
router.get('/api/v1/user/checkEmailCode', User.verifyEmailCode)
router.post('/api/v1/user/setPassPwd', User.setPassPwd)

export default router
