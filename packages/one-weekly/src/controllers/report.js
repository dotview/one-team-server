/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-08 16:47:52
 * @LastEditTime: 2019-08-20 17:33:02
 * @LastEditors: Please set LastEditors
 */
// 工具库
import { dayUtil, serviceUtil } from 'one-util'
import businessUtil from '../util/business'
// 数据库
import {
    team as TeamModel,
    user as UserModel,
    report as ReportModel,
    answer as AnswerModel
} from 'one-models'
/**
 * 类：周报
 * @public
 */
class Report {
    /**
     * @Author   dongyusi
     * @public
     * @DateTime 2018-03-27
     * @des      [获取汇报列表]
     * @param    {String}   teamId  [组ID]
     * @param    {String}   beginDate  [开始时间]
     * @return   {Boolean}   isAdmin     [是否组长]
     * @return   {Array}   list     [汇报内容列表]
     * @return   {Array}   notWritten     [未写周报成员id]
     * @return   {Array}   teamGroup     [子团队信息]
     * @return   {Object}   memberMap     [成员信息map]
     */
    async getList(ctx, next) {
        let formData = ctx.request.query
        let type = formData.type
        let userId = businessUtil.getStatus(ctx)
        // 获取小组id，因为大组和小组用的是一个model，所以groupId即代表大组id又代表小组id
        let userInfo = await UserModel.findOne({ _id: userId }, 'teamId groupId')
        let teamId = userInfo.teamId
        let isAdmin = userInfo.teamId.toString() === userInfo.groupId.toString()
        if (!teamId) {
            serviceUtil.sendErrMsg(ctx, '未加入团队')
            return
        }

        // 获取起止时间，传入的时间格式为yyyy-mm-dd或者时间戳
        let { beginDate, endDate, groupId, pageNum = 1 } = formData
        // 因为传入的所有时间格式都会被转化成字符串，而时间戳字符串new Date()不识别
        if (isTimestamp(beginDate)) {
            beginDate = parseInt(beginDate)
        }
        // 兼容小程序
        if (!endDate) {
            beginDate = dayUtil.getFirstDayOfWeek(beginDate, 'object')
            endDate = dayUtil.getLastDayOfWeek(beginDate, 'object')
        } else {
            beginDate = new Date(beginDate)
            endDate = new Date(endDate)
        }
        let fiterRule = {
            beginDate: { $gte: beginDate, $lte: endDate },
            teamId: teamId.toString(),
            type: type
        }

        let weeklyList = []

        if (groupId === teamId.toString()) {
            // 查看所有成员汇报列表，分页加载
            weeklyList = await ReportModel.find(fiterRule).skip(5 * (pageNum - 1)).limit(5)
                .populate('userId', '_id headPortrait nickName')
        } else {
            // 获取汇报列表
            weeklyList = await ReportModel.find(fiterRule)
                .populate('userId', '_id headPortrait nickName')
        }

        // 获取回复列表
        let weeklyIdList = weeklyList.map(v => v._id)
        let answerRes = await AnswerModel.find({
            reportId: { $in: weeklyIdList }
        })
        let answerList = {}
        answerRes.forEach(v => {
            let reportId = v.reportId.toString()
            if (answerList[reportId]) {
                answerList[reportId]++
            } else {
                answerList[reportId] = 1
            }
        })
        let weeklyListData = []
        weeklyList.forEach((v, i) => {
            let vi = JSON.parse(JSON.stringify(v))
            vi.answerListLength = answerList[v._id.toString()]
            weeklyListData[i] = vi
        })

        // 所有小组的信息
        let allTeamInfo = await TeamModel
            .find({ pid: teamId }, '_id teamName memberList')
            .populate('memberList')

        // 所在小组的信息，groupId对应的是小组的_id，如果不传groupId则获取全员的周报
        let curTeamInfo = (await TeamModel
            .findOne({ _id: groupId || teamId }, 'memberList')
            .populate('memberList')).memberList

        // 获取小组周报，如果groupId等于teamId则获取全员周报
        let notWritten = []
        if (groupId && groupId !== teamId.toString()) {
            weeklyListData = weeklyListData.filter(data => curTeamInfo.some(item => data.userId._id === item._id.toString()))
            // 未写周报的成员
            notWritten = curTeamInfo.filter(data => !weeklyListData.find(item => item.userId._id.toString() === data._id.toString()))
        } else {
            let allWeekliList = await ReportModel.find(fiterRule)
                .populate('userId', '_id headPortrait nickName')
            // 未写周报的成员
            notWritten = curTeamInfo.filter(data => !allWeekliList.find(item => item.userId._id.toString() === data._id.toString()))
        }

        // 返回数据
        let result = {
            result: {
                hostId: userId,
                isAdmin: isAdmin,
                list: weeklyListData,
                beginDate: beginDate,
                endDate: endDate,
                teamId: teamId,
                allTeamInfo: allTeamInfo,
                notWritten: notWritten
            },
            success: true
        }
        ctx.response.body = result
    }
    /**
     * @Author   dongyusi
     * @DateTime 2018-08-17
     * @des      [用团队id获取汇报列表]
     * @param    {String}   beginDate  [开始时间]
     * @param    {String}   type  [汇报类型]
     * @param    {String}   teamId  [团队ID]
     * @return   {Boolean}   isAdmin     [是否组长]
     * @return   {Array}   list     [汇报内容列表]
     * @return   {Object}   memberMap     [成员信息map]
     * @return   {Array}   notWritten     [没写汇报的人]
     */
    async getReportByGroup(ctx, next) {
        let formData = ctx.request.query
        let type = formData.type
        let userId = businessUtil.getStatus(ctx)
        let teamId = (await UserModel.findOne({ _id: userId }, 'teamId').exec())
            .teamId
        if (!teamId) {
            serviceUtil.sendErrMsg(ctx, '未加入团队')
            return
        }

        // 大团队成员信息 Map
        let teamMemberList = (await TeamModel
            .findOne({ _id: teamId }, 'memberList')
            .populate('memberList')
            .exec()).memberList
        let teamMemberMap = {}
        teamMemberList.forEach(v => {
            teamMemberMap[v._id] = v
        })

        // 获取起止时间
        let { beginDate, endDate } = formData
        // 因为传入的所有时间格式都会被转化成字符串，而时间戳字符串new Date()不识别
        if (isTimestamp(beginDate)) {
            beginDate = parseInt(beginDate)
        }
        // 兼容小程序
        if (!endDate) {
            beginDate = dayUtil.getFirstDayOfWeek(beginDate, 'object')
            endDate = dayUtil.getLastDayOfWeek(beginDate, 'object')
        } else {
            beginDate = new Date(beginDate)
            endDate = new Date(endDate)
        }
        let fiterRule = {
            beginDate: { $gte: beginDate, $lte: endDate },
            teamId: teamId,
            type: type
        }

        // 获取小组成员
        let groupMemberList = (await TeamModel
            .findOne({ _id: formData.groupId }, 'memberList')
            .exec()).memberList

        // 获取汇报列表
        let weeklyList = await ReportModel.find(fiterRule)
            .populate('userId')
            .exec()
        let listResult = weeklyList.filter(
            v => groupMemberList.indexOf(v.userId._id.toString()) > -1
        )

        let written = listResult.map(v => v.userId._id.toString())
        // 未写周报的人
        let notWritten = groupMemberList.filter(v => {
            return written.indexOf(v.toString()) < 0
        })

        let result = {
            list: listResult,
            notWritten: notWritten,
            memberMap: teamMemberMap
        }
        ctx.res.success(result)
    }
    /**
     * @Author   dongyusi
     * @DateTime 2018-03-27
     * @des      [获取汇报详情]
     * @param    {String} beginDate  [时间]
     * @param    {String} userId  [用户id]
     * @param    {String} type [类型]
     * @return   {String} detail [内容]
     * @return   {Boolean} isAdmin [是否组长]
     * @return   {Number} answerLength [评论长度]
     * @return   {Object} user [用户信息]
     */
    /* eslint handle-callback-err: 'off' */
    async getDetail(ctx, next) {
        let formData = ctx.request.query
        let userId = formData.userId || businessUtil.getStatus(ctx)
        // let teamId = formData.teamId || serviceUtil.getCookie(ctx, 'team')
        let teamId = (await UserModel.findOne({ _id: userId }, 'teamId').exec())
            .teamId

        let { beginDate, endDate } = formData
        // 因为传入的所有时间格式都会被转化成字符串，而时间戳字符串new Date()不识别
        if (isTimestamp(beginDate)) {
            beginDate = parseInt(beginDate)
        }
        beginDate = dayUtil.getFirstDayOfWeek(beginDate, 'object')
        // 兼容小程序
        if (!endDate) {
            endDate = dayUtil.getLastDayOfWeek(beginDate, 'object')
        } else {
            endDate = new Date(endDate)
        }
        let type = formData.type
        let filterRule = {
            // 时间查询只支持时间对象
            beginDate: { $gte: beginDate, $lte: endDate },
            userId: userId,
            teamId: teamId,
            type: type
        }
        // Mongoose查询返回的对象是不能直接修改的, 调用lean方法
        let detail = await ReportModel.find(filterRule).lean()

        if (!detail.length) {
            let typeTemplate = type + 'Template'
            let res = await TeamModel.findOne({ _id: teamId })
            let info = {}

            if (res[typeTemplate]) {
                let template = await TeamModel
                    .findOne({ _id: teamId }, typeTemplate)
                    .populate(typeTemplate)
                info = {
                    content: template[typeTemplate].template || '',
                    createTime: beginDate
                }
            } else {
                info = {
                    content: '',
                    createTime: beginDate
                }
            }
            detail.push(info)
        } else {
            detail.sort((a, b) => Date.parse(b.beginDate) - Date.parse(a.beginDate))
            for (let i = 0; i < detail.length; i++) {
                await AnswerModel.find({ reportId: detail[i]._id }, function(err, docs) {
                    if (err) {
                        throw new Error(err)
                    }
                    detail[i].commentLength = docs.length
                })
            }
        }
        let teamInfo = await TeamModel.findOne({ _id: teamId })
        let userInfo = await UserModel.findOne(
            { _id: userId },
            'headPortrait nickName'
        )
        // 返回数据
        let result = {
            result: {
                isAdmin: userId === teamInfo.administrator.toString(),
                detail: detail,
                user: {
                    headPortrait: userInfo.headPortrait,
                    nickName: userInfo.nickName
                }
            },
            success: true
        }
        ctx.response.body = result
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-27
     * @des      [保存汇报详情]
     * @param    {String}   _id  [汇报id]
     * @param    {String}   type  [汇报类型]
     * @param    {String}   teamId  [团队ID]
     * @return   {Boolean}   isAdmin     [是否组长]
     * @return   {Array}   list     [汇报内容列表]
     */
    async saveDetail(ctx, next) {
        let formData = ctx.request.body
        let result = {}

        // 修改 【有汇报id的情况】
        if (formData._id) {
            let oldValue = { _id: formData._id }
            let newData = { $set: { content: formData.content } }

            let ret = await ReportModel.update(oldValue, newData)

            ctx.res.success({
                reportId: formData._id
            })
            return
        }
        // 创建 [没有id均为新建] todo: 该时间段内是否已经存在汇报了 ，如果存在 依旧是修改
        let { beginDate } = formData
        // 因为传入的所有时间格式都会被转化成字符串，而时间戳字符串new Date()不识别
        if (isTimestamp(beginDate)) {
            beginDate = parseInt(beginDate)
        }
        beginDate = dayUtil.getFirstDayOfWeek(beginDate, 'object')

        let userId = businessUtil.getStatus(ctx)
        let teamId = (await UserModel.findOne({ _id: userId }, 'teamId').exec())
            .teamId

        let createWeekly = new ReportModel({
            userId: userId,
            teamId: teamId,
            content: formData.content,
            type: formData.type,
            beginDate: beginDate
        })

        let ret = await createWeekly.save()
        ctx.res.success({
            reportId: ret._id
        })
    }
    /**
     * @Author   dongyusi
     * @DateTime 2018-03-27
     * @des      [删除汇报]
     * @param    {String}   reportId  [汇报id]
     */
    async delete(ctx, next) {
        let reportId = ctx.request.query.reportId || ctx.request.body.reportId
        let result = {}
        await ReportModel.remove({ _id: reportId })
        ctx.res.success()
    }
}

function isTimestamp(str) {
    const pattern = new RegExp('[-/TZ]')
    return !pattern.test(str)
}

export default new Report()
