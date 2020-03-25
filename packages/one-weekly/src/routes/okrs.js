/*
 * @Description: okr列表接口
 * @Author: 沈浩
 */
import Okrs from '../controllers/okrs'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/api/v1/okrs', Okrs.getList)
router.post('/api/v1/okrs', Okrs.save)
router.delete('/api/v1/okrs', Okrs.delete)
router.get('/api/v1/okrs/detail', Okrs.getDetail)
router.put('/api/v1/okrs', Okrs.update)

export default router
