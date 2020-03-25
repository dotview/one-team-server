/*
 * @Description: 分享
 * @Author: 沈浩
 * @Date: 2019-08-20 17:10:44
 * @LastEditTime: 2019-08-22 11:50:51
 * @LastEditors: Please set LastEditors
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const forumSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' }, // 用户id
    teamId: { type: Schema.Types.ObjectId, ref: 'team' }, // 团队id
    forumPId: { type: Schema.Types.ObjectId }, // 评论的帖子id
    content: { type: String }, // 帖子内容
    beginDate: { type: Date }, // 帖子开始时间
    whoLikes: { type: Array } // 点赞的人
}, {
    versionKey: false, // 去掉版本锁 _v
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
})

export default mongoose.model('forum', forumSchema)
