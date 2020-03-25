/*
 * @Description: 论坛接口
 * @Author: 沈浩
 * @Date: 2019-08-20 17:23:02
 * @LastEditTime: 2019-08-20 17:33:48
 * @LastEditors: Please set LastEditors
 */
import Forum from '../controllers/forum'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/api/v1/forum', Forum.getList)
router.delete('/api/v1/forum', Forum.delete)
router.get('/api/v1/forum/detail', Forum.getDetail)
router.post('/api/v1/forum/detail', Forum.save)
router.put('/api/v1/forum/detail', Forum.update)
router.post('/api/v1/forum/like', Forum.like)

export default router
