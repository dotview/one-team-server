import Report from '../controllers/report'
import ReportConfig from '../controllers/reportConfig'
import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/api/v1/report', Report.getList)
router.delete('/api/v1/report', Report.delete)
router.get('/api/v1/report/detail', Report.getDetail)
router.post('/api/v1/report/detail', Report.saveDetail)

router.get('/api/v1/report/config', ReportConfig.getConfig)
router.post('/api/v1/report/template', ReportConfig.saveTemplate)

router.get('/api/v1/report/group', Report.getReportByGroup)

export default router
