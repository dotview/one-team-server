/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2018-11-27 10:19:54
 * @LastEditTime: 2019-08-20 17:02:52
 * @LastEditors: Please set LastEditors
 */
/**
 * 评论 集合定义
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const answerSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' }, // 用户id
    reportId: { type: Schema.Types.ObjectId, ref: 'report' }, // 汇报id
    fId: { type: Schema.Types.ObjectId, ref: 'answer' }, // 父回答id
    fUser: { type: Schema.Types.ObjectId, ref: 'user' }, // 父回答id
    content: { type: String } // 内容
}, {
    versionKey: false, // 去掉版本锁 _v
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
})

export default mongoose.model('answer', answerSchema)
