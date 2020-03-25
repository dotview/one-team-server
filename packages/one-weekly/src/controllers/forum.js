/*
 * @Description: 论坛
 * @Author: 沈浩
 * @Date: 2019-07-08 16:47:52
 * @LastEditTime: 2019-08-22 11:51:59
 * @LastEditors: Please set LastEditors
 */
// 工具库
import businessUtil from '../util/business'
// 数据库
import {
    forum as ForumModel,
    user as UserModel,
    team as TeamModel
} from 'one-models'

/**
 * 类：论坛
 * @public
 */
class Forum {
    /**
     * @Author   沈浩
     * @DateTime 2019-08-20
     * @des      [新建帖子]
     * @param    {String}   userId  [用户id]
     * @param    {String}   _id  [帖子id]
     * @param    {String}   forumPId  [评论的帖子id]
     * @param    {String}   content  [汇报内容]
     * @param    {String}   title  [汇报标题]
     * @param    {String}   beginDate  [创建时间周]
     **/
    async save(ctx, next) {
        let formData = ctx.request.body

        let { content, forumPId = null, beginDate } = formData

        let userId = formData.userId || businessUtil.getStatus(ctx)

        let teamId = (await UserModel.findOne({ _id: userId }, 'teamId').exec())
            .teamId

        let createForum = new ForumModel({
            userId: userId,
            teamId: teamId,
            forumPId: forumPId,
            content: content,
            beginDate: new Date(beginDate),
            whoLikes: []
        })

        let ret = await createForum.save()

        ctx.res.success({
            forumId: ret._id
        }, '操作成功！')
    }

    async update(ctx, next) {
        let formData = ctx.request.body

        let { forumId, content } = formData

        await ForumModel.updateOne({ _id: forumId }, { $set: { content: content } })

        ctx.res.success({
            forumId: forumId
        }, '操作成功！')
    }

    async getList(ctx, next) {
        let formData = ctx.request.query

        let { beginDate, endDate } = formData

        let userId = businessUtil.getStatus(ctx)

        let teamId = (await UserModel.findOne({ _id: userId }, 'teamId').exec())
            .teamId

        let list = await ForumModel.find({ forumPId: null, teamId: teamId, beginDate: { $gte: beginDate, $lte: endDate } })
                .sort({ _id: 1 })
                .populate('userId', '_id headPortrait nickName')
                .lean()

        for (let i = 0; i < list.length; i++) {
            let countComment = await ForumModel.countDocuments({ forumPId: list[i]._id, beginDate: { $gte: beginDate, $lte: endDate } })
            list[i].countComment = countComment
        }
        // 只过滤平台组、活动组、后台组(长沙)的论坛信息
        let tempTeam = await TeamModel.find({ _id: { $in: ['5b768c691f53306e958f88a3', '5b768dc41f53306e958f88a8', '5c0a18467932350691640a5e'] } }, 'memberList').populate('memberList').lean()
        let targetTeam = []
        tempTeam.map(data => {
            targetTeam = targetTeam.concat(data.memberList)
        })
        // 过滤为写论帖的成员
        let notWritten = targetTeam.filter(item => {
            return !list.find(data => data.userId._id.toString() === item._id.toString())
        })

        let result = {
            result: {
                list: list,
                notWritten: notWritten
            },
            success: true
        }

        ctx.response.body = result
    }

    async getDetail(ctx, next) {
        let formData = ctx.request.query

        let { forumId, beginDate, endDate } = formData

        beginDate = new Date(beginDate)
        endDate = new Date(endDate)

        let owner = await ForumModel.findOne({ _id: forumId })
                .populate('userId', '_id headPortrait nickName')

        let comments = []

        if (forumId) {
            comments = await ForumModel.find({ forumPId: forumId, beginDate: { $gte: beginDate, $lte: endDate } })
                .populate('userId', '_id headPortrait nickName')
        }

        let result = {
            result: {
                owner: owner,
                comments: comments
            },
            success: true
        }

        ctx.response.body = result
    }

    async delete(ctx, next) {
        let forumId = ctx.request.query.forumId || ctx.request.body.forumId

        await ForumModel.remove({ _id: forumId })

        await ForumModel.remove({ forumPId: forumId })

        ctx.res.success()
    }

    async like(ctx, next) {
        let formData = ctx.request.body

        let userId = businessUtil.getStatus(ctx).toString()

        let nickName = (await UserModel.findOne({ _id: userId }, 'nickName')).nickName

        let { forumId, like } = formData

        let rule = like ? { $push: { whoLikes: nickName } } : { $pull: { whoLikes: nickName } }

        await ForumModel.updateOne({ _id: forumId }, rule)

        ctx.res.success({
            forumId: forumId
        }, '操作成功！')
    }
}

export default new Forum()
