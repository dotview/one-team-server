import Msgbox from '../controllers/msgbox'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/api/v1/msgbox', Msgbox.getList)
router.put('/api/v1/msgbox', Msgbox.update)

export default router
