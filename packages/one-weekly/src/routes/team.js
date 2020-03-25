import Team from '../controllers/team'
import koaRouter from 'koa-router'

const router = koaRouter()

// 新建/修改团队
router.post('/api/v1/team/team', Team.updateTeam)
// 删除团队
router.delete('/api/v1/team/team', Team.deleteTeam)

// 获得团队成员
router.get('/api/v1/team/members', Team.getMembers)
// 更新团队成员
router.put('/api/v1/team/members', Team.updateMembers)
// 新增团队成员
router.post('/api/v1/team/members', Team.addMembers)

// 获取团队邀请链接
router.get('/api/v1/team/joinUrl', Team.joinUrl)
// 获取小组
router.get('/api/v1/team/groups', Team.getGroups)
/* =============to do============== */
router.get('/api/team/teamList', Team.getTeamList)
router.get('/api/team/permissionTeamList', Team.getPermissionTeamList)
router.delete('/api/team/team', Team.deleteTeam)
router.post('/api/team/mem2Team', Team.addMem2Team)
router.get('/api/team/childTeamInfo', Team.getChildTeamInfo)

export default router
