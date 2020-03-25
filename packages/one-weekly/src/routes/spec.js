import Spec from '../controllers/spec'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/spec', Spec.showSwaggerSpec)

module.exports = router
