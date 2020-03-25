// 工具库
import businessUtil from '../util/business'
// 数据库
import {
    answer as AnswerModel
} from 'one-models'

import Msgbox from './msgbox'
class Answer {

    /**
     * @Author   dongyusi
     * @DateTime 2018-11-6
     * @des      [获取回复列表]
     * @param    {String}   reportId  [文章ID]
     * @return   {String}   userId     [用户ID]
     * @return   {Array}   list     [回复内容列表]
     */
    async getList(ctx, next) {
        let formData = ctx.request.query
        let userId = businessUtil.getStatus(ctx)
        let answerList = await AnswerModel
            .find({ reportId: formData.reportId })
            .populate('fUser', 'nickName')
            .populate('userId', 'nickName')
            .exec()
        ctx.res.success({
            userId: userId,
            list: answerList
        })
    }
    /**
     * @Author   dongyusi
     * @DateTime 2018-11-6
     * @des      [保存回复]
     * @param    {String}   reportId  [文章ID]
     * @param    {String}   fId  [父回复ID]
     * @param    {String}   content  [回复内容]
     */
    async save(ctx, next) {
        let formData = ctx.request.body
        let userId = businessUtil.getStatus(ctx)
        let createAnswer = new AnswerModel({
            userId: userId,
            reportId: formData.reportId,
            fId: formData.fId || null,
            fUser: formData.fUser || null,
            content: formData.content
        })
        let type = createAnswer.fId ? 'REPLY_COMMENT' : 'REPLY_WEEKLY'
        let result = await createAnswer.save(function(err) {
            if (err) console.log(err)
            // 插入消息
            let { _id: answerId, reportId, fUser, userId: answerUserId } = createAnswer
            Msgbox.insertMsg({
                answerUserId,
                type,
                reportId,
                answerId,
                fUser
            })
        })

        ctx.res.success(result)
    }
    /**
     * @Author   dongyusi
     * @DateTime 2018-11-6
     * @des      [删除回复]
     * @param    {String}   answerId  [评论ID]
     */
    async delete(ctx, next) {
        let answerId = ctx.request.query.answerId || ctx.request.body.answerId
        await AnswerModel.remove({ '_id': answerId })
        ctx.res.success()
    }

}
export default new Answer()
