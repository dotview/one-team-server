import Answer from '../controllers/answer'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/api/v1/answer', Answer.getList)
router.post('/api/v1/answer', Answer.save)
router.delete('/api/v1/answer', Answer.delete)

export default router
