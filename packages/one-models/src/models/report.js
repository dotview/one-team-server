/**
 * 汇报 集合定义
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const reportSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' }, // 用户id
    teamId: { type: Schema.Types.ObjectId, ref: 'team' }, // 团队id
    content: { type: String }, // 周报内容
    type: { type: String }, // 周报类型
    beginDate: { type: Date } // 周报开始时间
}, {
    versionKey: false, // 去掉版本锁 _v
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
})

export default mongoose.model('report', reportSchema)
