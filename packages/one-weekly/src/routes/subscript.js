import Subscript from '../controllers/subscript'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/api/v1/record', Subscript.getRecordList)
router.post('/api/v1/record', Subscript.addRecord)
router.delete('/api/v1/record', Subscript.deleteRecord)
router.get('/api/v1/user/name', Subscript.getUserByName)

export default router
