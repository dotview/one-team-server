import User from '../controllers/user'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/api/v1/user', User.getInfo)
router.patch('/api/v1/user', User.update)
router.delete('/api/v1/user', User.delete)

export default router
