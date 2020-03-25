// 工具库
import { serviceUtil } from 'one-util'
import businessUtil from '../util/business'
// 数据库
import {
    team as TeamModel,
    user as UserModel
} from 'one-models'

class Team {
    /**
     * @Author   dongyusi
     * @DateTime 2018-03-28
     * @des      [获取团队列表]
     * @param    {String}  teamId  [团队ID]
     * @return   {String}  teamInfo  [团队信息]
     */
    async getMembers(ctx, next) {
        let formData = ctx.request.query
        let userId = businessUtil.getStatus(ctx)
        // let teamId = formData.teamId || serviceUtil.getCookie(ctx, 'team')
        let teamId = formData.teamId || (await UserModel
            .findOne({ _id: userId }, 'teamId')
            .exec()).teamId
        let result = serviceUtil.initRes()

        if (teamId) {
            let teamInfo = await TeamModel
                .findOne({ '_id': teamId })
                .populate('memberList')
                .exec()
            let teamGroup = await TeamModel
                .find({ 'pid': teamId }, '_id teamName')
                .exec()
            let res = Object.assign(JSON.parse(JSON.stringify(teamInfo)), {
                isAdmin: userId === teamInfo.administrator.toString(),
                teamGroup
            })
            result.result = res
            result.success = true
        } else {
            result.success = false
            result.error = '未加入团队'
        }
        ctx.response.body = result
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-29
     * @des      [团队成员操作]
     * @param    {String}  teamId  [团队ID]
     * @param    {String}  opera  [操作方式]
     * @param    {String}  userId  [操作对象ID]
     * @return   {Boolean}  success  [操作结果]
     */
    async updateMembers(ctx, next) {
        let formData = ctx.request.body
        let teamId = null
        let groupId = null
        await UserModel.findOne({ _id: formData.userId }, 'teamId groupId', function(err, docs) {
            if (err) {
                throw new Error(err)
            }
            teamId = docs.teamId
            groupId = docs.groupId
        })
        let newTeamValue
        if (formData.opera === 'out') { // 退出
            newTeamValue = { $pull: { memberList: formData.userId } }
            await UserModel.update({ _id: formData.userId }, { $set: { teamId: null } })
            await TeamModel.update({ _id: teamId }, newTeamValue)
            ctx.cookies.set('team', '')
        }
        if (formData.opera === 'del') { // 删除
            newTeamValue = { $pull: { memberList: formData.userId } }
            // 小组和大组中删除成员
            await TeamModel.updateMany({ $or: [{_id: groupId}, {_id: teamId}] }, newTeamValue)
            // 将成员信息中的teamId置为null
            await UserModel.update({ _id: formData.userId }, { $set: { teamId: null } })
        }
        if (formData.opera === 'white') { // 添加白名单
            let white = (await UserModel.findById(formData.userId)).white
            await UserModel.findByIdAndUpdate(formData.userId, { $set: { white: !white } })
        }
        if (formData.opera === 'admin') { // 任职
            newTeamValue = { $set: { administrator: formData.userId } }
            await TeamModel.update({ _id: teamId }, newTeamValue)
        }

        let result = {
            success: true
        }
        ctx.response.body = result
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-29
     * @des      [添加成员]
     * @param    {String}  teamName  [团队名称]
     * @param    {String}  teamId  [团队邀请码（目前为团队ID）]
     * @param    {String}  userId  [操作对象ID]
     * @return   {Boolean}  success  [操作结果]
     */
    async addMembers(ctx, next) {
        let formData = ctx.request.body
        let userId = businessUtil.getStatus(ctx)

        let teamId = formData.teamId

        if (formData.teamName) {
            let Team = new TeamModel({
                teamName: formData.teamName,
                administrator: userId,
                memberList: [userId]
            })
            let teamSave = await Team.save()
            teamId = teamSave._id
            await UserModel.update({ _id: userId }, { $set: { teamId: teamId } })
        }
        if (formData.teamId) {
            let oldTeamValue = { _id: teamId }
            let newTeamData = { $push: { memberList: userId } }
            await TeamModel.update(oldTeamValue, newTeamData)
            await UserModel.update({ _id: userId }, { $set: { teamId: teamId } })
        }

        ctx.cookies.set('team', teamId)
        let result = {
            success: true
        }
        ctx.response.body = result
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-29
     * @des      [获取团队邀请链接]
     * @param    {String}  teamId  [团队ID]
     * @return   {String}  url  [加入链接]
     */
    async joinUrl(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let teamId = (await UserModel
            .findOne({ _id: userId }, 'teamId')
            .exec()).teamId
        let url = `http://${ctx.request.header.host}/page/user/register?id=${teamId}`
        let result = {
            success: true,
            result: {
                url: url
            }
        }
        ctx.response.body = result
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-29
     * @des      [获取小组成员信息]
     * @param    {String}  teamName  [团队名称]
     * @param    {String}  teamId  [团队ID]
     * @return   {Boolean}  success  [操作结果]
     */
    async getGroups(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let teamId = (await UserModel
            .findOne({ _id: userId }, 'teamId')
            .exec()).teamId

        let teamGroup = await TeamModel
            .find({ 'pid': teamId }, '_id teamName administrator memberList')
            .populate('memberList')
            .exec()
        let teamInfo = await TeamModel
            .findOne({ '_id': teamId }, '_id teamName memberList')
            .populate('memberList')
            .exec()
        ctx.res.success({ teamInfo, teamGroup })
    }
    /**
     * @Author   dongyusi
     * @DateTime 2018-03-29
     * @des      [新建/修改团队]
     * @param    {String}  [传啥存啥]
     */
    async updateTeam(ctx, next) {
        let formData = ctx.request.body
        let value = Object.assign(formData, { updateTime: new Date() })
        let teamInfo

        if (formData._id) {
            let curMemberList = []
            await TeamModel.findById(formData._id, 'memberList', function(err, docs) {
                if (err) {
                    throw new Error(err)
                }
                curMemberList = docs.memberList.map(data => {
                    return data.toString()
                })
            })
            // 找出新加入的成员id
            let newMembers = curMemberList.concat(formData.memberList).filter((v, i, arr) => arr.indexOf(v) === arr.lastIndexOf(v))
            if (newMembers.length !== 0) {
                for (let member of newMembers) {
                    // 找到新成员原来所在的小组的groupId
                    let groupId = (await UserModel.findById(member)).groupId
                    // 根据groupId找到对应的小组，然后将改成员从原有的小组中删除
                    groupId && await TeamModel.findByIdAndUpdate(groupId, { $pull: { memberList: member } })
                    // 并把新成员的groupId设为新的groupId
                    groupId && await UserModel.findByIdAndUpdate(member, { $set: { groupId: formData._id } })
                }
            }
            teamInfo = await TeamModel.findByIdAndUpdate(formData._id, { $set: value })
        } else {
            let Team = new TeamModel(value)
            teamInfo = await Team.save()
        }
        ctx.res.success({ data: teamInfo, message: '操作成功' })
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-29
     * @des      [删除团队]
     * @param    {String} _id [团队id]
     */
    async deleteTeam(ctx, next) {
        let _id = ctx.request.query._id

        try {
            let teamInfo = await TeamModel
                .remove({
                    _id: _id
                })
                .exec()
            ctx.res.success()
        } catch (e) {
            ctx.res.fail()
        }
    }

    /**
    * 曾经
    */
    async getTeamList(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let result = {
            success: true
        }

        let teamInfo = await TeamModel
            .find({})
            .populate('administrator')
            .exec()

        let res = Object.assign(JSON.parse(JSON.stringify(teamInfo)), { isAdmin: userId === teamInfo.administrator })
        result.result = res

        ctx.response.body = result
    }

    async getPermissionTeamList(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let result = {
            success: true
        }

        let teamRootInfo = await TeamModel
            .find({
                administrator: userId
            })
            .sort({ _id: 1 })
            .exec()

        let childList = await TeamModel
            .find({
                pid: teamRootInfo[0]._id
            })
            .exec()

        let teamInfo = teamRootInfo.concat(childList)

        let res = Object.assign(JSON.parse(JSON.stringify(teamInfo)), { isAdmin: userId === teamInfo.administrator })
        result.result = res

        ctx.response.body = result
    }

    async addMem2Team(ctx, next) {
        let {
            name,
            eMail,
            teamId
        } = ctx.request.body
        let hasRecord = false
        let User = new UserModel({
            nickName: name,
            eMail,
            teamId,
            userPassword: serviceUtil.encrypt(eMail)
        })

        let userPromise = UserModel.findOne({
            eMail: eMail
        }).exec()

        await userPromise.then((data) => {
            hasRecord = !!data
        })

        if (hasRecord) {
            ctx.response.body = {
                success: false,
                resultDesc: '该邮箱已被注册'
            }
        } else {
            let newUserPromise = await User.save()
            await TeamModel.update({
                _id: teamId
            }, {
                $push: {
                    memberList: newUserPromise.id
                }
            })
            ctx.response.body = {
                success: true
            }
        }
    }

    async getReportTo(ctx, next) {
        let teamId = serviceUtil.getCookie(ctx, 'team')

        let teamInfo = await TeamModel
            .find({
                _id: teamId
            })
            .exec()

        let parentTeam = await TeamModel
            .find({
                _id: teamInfo[0].pid
            })
            .populate('administrator')
            .exec()

        ctx.response.body = {
            success: true,
            result: parentTeam
        }
    }

    async getReportFrom(ctx, next) {
        let teamId = serviceUtil.getCookie(ctx, 'team')

        let teamList = await TeamModel
            .find({
                pid: teamId
            })
            .populate('administrator')
            .exec()

        ctx.response.body = {
            result: teamList,
            success: true
        }
    }

    async getChildTeamInfo(ctx, next) {
        let teamId = serviceUtil.getCookie(ctx, 'team')

        let teamList = await TeamModel
            .find({
                pid: teamId
            })
            .populate('administrator')
            .exec()

        ctx.response.body = {
            result: teamList,
            success: true
        }
    }
}

export default new Team()
