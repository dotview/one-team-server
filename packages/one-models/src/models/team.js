/**
 * 团队 集合定义
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const teamSchema = new Schema({
    teamName: { type: String }, // 团队名称
    administrator: { type: Schema.Types.ObjectId, ref: 'user' }, // 超级管理员
    memberList: [{ type: Schema.Types.ObjectId, ref: 'user' }], // 成员列表
    weeklyTemplate: { type: Schema.Types.ObjectId, ref: 'weeklyTemplate' }, // 周报模版
    summaryTemplate: { type: Schema.Types.ObjectId, ref: 'summaryTemplate' }, // 总结模版
    pid: { type: Schema.Types.ObjectId, ref: 'team' }, // 团队pid
    children: [{ type: Schema.Types.ObjectId, ref: 'team' }] // 团队child id
}, {
    versionKey: false, // 去掉版本锁 _v
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
})

export default mongoose.model('team', teamSchema)
