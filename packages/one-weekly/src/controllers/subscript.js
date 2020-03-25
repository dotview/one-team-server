// 工具库
import businessUtil from '../util/business'

// 数据库
import {
    subscription as SubscriptModel,
    user as UserModel
} from 'one-models'

class Subscript {
    /**
     * @Author   dongyusi
     * @DateTime 2018-11-26
     * @des      [添加关注]
     * @param    {String}  subUserId  [关注对象id]
     */
    async addRecord(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let subUserId = ctx.request.body.subUserId
        let record = new SubscriptModel({
            userId,
            subUserId
        })
        let historyRecord = await SubscriptModel.find({
            userId,
            subUserId
        })
        if (historyRecord.length) {
            ctx.response.body = {
                success: false,
                resultDes: '用户已关注'
            }
        } else {
            try {
                record.save()
                ctx.res.success({}, '请求成功')
            } catch (e) {
                ctx.response.body = {
                    success: false,
                    resultDes: e.message
                }
            }
        }
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-11-26
     * @des      [删除关注]
     * @param    {String}  subUserId  [关注对象id]
     */
    async deleteRecord(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let subUserId = ctx.request.query.subUserId

        try {
            SubscriptModel.remove({
                userId,
                subUserId
            }).exec()

            ctx.res.success({}, '请求成功')
        } catch (e) {
            ctx.response.body = {
                success: false,
                resultDes: e.message
            }
        }
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-11-26
     * @param    {String} userId  [用户id]
     * @des      [关注列表]
     */
    async getRecordList(ctx, next) {
        let formData = ctx.request.query
        let userId = formData.userId || businessUtil.getStatus(ctx)
        try {
            let subList = await SubscriptModel.find({
                userId
            })
            .populate('subUserId', 'nickName headPortrait')
            .exec()
            let recordList = subList.map(item => {
                return item.subUserId
            })
            ctx.response.body = {
                success: true,
                result: recordList
            }
        } catch (e) {
            ctx.response.body = {
                success: false,
                resultDes: e.message
            }
        }
    }

    /**
     * 姓名模糊匹配
     * @author dongyusi
     * @date   2018-12-06
     * @param  {String}   searchName  [以searchName开头]
     * @return {Array} userList [用户列表]
     */
    async getUserByName(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let searchName = ctx.request.query.searchName
        let searchExp = new RegExp(`^${searchName}`)

        try {
            // 姓名模糊匹配/邮箱模糊匹配
            let teamId = (await UserModel
                .findOne({ _id: userId }, 'teamId')
                .exec()).teamId
            let userList = await UserModel.find(
                {
                    $nor: [{ _id: userId }],
                    teamId: teamId.toString(),
                    $or: [{ nickName: searchExp }, { eMail: searchExp }]
                },
                '_id nickName eMail'
            )
                .exec()
            ctx.res.success({ data: userList, message: '请求成功' })
        } catch (e) {
            ctx.res.fail({ message: e.message })
        }
    }
}

export default new Subscript()
