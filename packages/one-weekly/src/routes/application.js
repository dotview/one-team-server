import Application from '../controllers/application'
import User from '../controllers/user'
import koaRouter from 'koa-router'

const router = koaRouter()

router.post('/api/v1/application', Application.signIn)
router.delete('/api/v1/application', Application.signOut)
router.post('/api/v1/user', User.add)

export default router
