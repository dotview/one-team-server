// 工具库
import businessUtil from '../util/business'
// 数据库
import {
    msgbox as MsgboxModel,
    report as ReportModel
} from 'one-models'

/**
 * [msgPackage 包装返回数据]
 * @author zhouqing
 * @date   2018-12-07
 * @param  {Array}   arr [消息列表]
 * @return {Object}      [{消息id,类型,内容，周报数据，usera,userb}]
 */
function msgPackage(arr) {
    return arr.map(item => {
        // console.log(item)
        try {
            var {
                answerId: {
                    content,
                    userId,
                    fUser
                },
                reportId,
                type,
                id
            } = item
        } catch (e) {
            content = '该评论或已被删除'
            id = item.id
        }
        return {
            id,
            type,
            content,
            report: reportId,
            user: userId,
            pUser: fUser
        }
    })
}
/**
 * 消息
 */
class Msgbox {
    /**
     * [insertMsg 在消息盒子中插入数据]
     * @author zhouqing
     * @date   2018-12-07
     * @param  {ObjectId}   options.answerUserId [评论者id]
     * @param  {String}   options.type         [消息类型]
     * @param  {ObjectId}   options.reportId     [周报id]
     * @param  {ObjectId}   options.answerId     [评论id]
     * @param  {ObjectId}   options.fUser        [被评论者id(e.g. a回复了b,被评论者就是b)]
     * @return {type}                        [description]
     */
    async insertMsg({
        answerUserId,
        type,
        reportId,
        answerId,
        fUser
    }) {
        let reportOwner = await ReportModel
            .findOne({ _id: reportId }, 'userId')
            .exec()
        let reportOwnerId = reportOwner.userId

        const getData = (userId) => {
            return {
                userId,
                type,
                reportId,
                answerId
            }
        }
        let insertData
        if (type === 'REPLY_WEEKLY' && !reportOwnerId.equals(answerUserId)) {
            insertData = getData(reportOwnerId)
        } else if (type === 'REPLY_COMMENT') {
            // console.log(reportOwnerId, answerUserId, reportOwnerId.equals(answerUserId))
            // 如果回复者是周报主人则不通知
            // 如果被回复者是周报主人只通知一次
            if (reportOwnerId.equals(answerUserId) || reportOwnerId.equals(fUser)) {
                insertData = getData(fUser)
            } else {
                insertData = [getData(reportOwnerId), getData(fUser)]
            }
        }
        return await MsgboxModel.create(insertData)
    }
    /**
     * [getList 获取未读消息列表]
     * @author zhouqing
     * @date   2018-11-26
     * @param  {Object}   ctx  [description]
     * @param  {Function} next [description]
     * @return {Object}        [description]
     */
    async getList(ctx, next) {
        let formData = ctx.request.query
        let userId = businessUtil.getStatus(ctx)
        let msgboxList = await MsgboxModel
            .find({ userId, isRead: false }, null, { limit: 10 })
            .populate({
                path: 'answerId',
                select: 'content fId',
                populate: [{
                    path: 'userId',
                    select: 'nickName headPortrait -_id'
                }, {
                    path: 'fUser',
                    select: 'nickName headPortrait -_id'
                }]
            })
            .populate({
                path: 'reportId',
                select: 'userId beginDate -_id'
            })
            .exec()
        ctx.res.success({
            nodeEnv: process.env.NODE_ENV,
            // userId: userId,
            list: msgPackage(msgboxList)
        })
    }
    /**
     * [update 更改状态（已读）]
     * @author zhouqing
     * @date   2018-11-29
     * @param  {type}   ctx  [description]
     * @param  {Function} next [description]
     * @return {type}        [description]
     */
    async update(ctx, next) {
        let formData = ctx.request.body
        let userId = businessUtil.getStatus(ctx)
        if (formData.id) {
            await MsgboxModel.updateOne({ 'userId': userId, _id: formData.id }, { isRead: true })
        } else {
            await MsgboxModel.updateMany({ 'userId': userId }, { isRead: true })
        }
        // await MsgboxModel.update({ 'userId': userId }, { isRead: true }, { multi: true })
        ctx.res.success()
    }
}
export default new Msgbox()
