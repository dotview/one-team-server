/*
 * @Description: okrs
 * @Author: 沈浩
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const okrsSchema = new Schema({
    creater: { type: Schema.Types.ObjectId, ref: 'user' }, // 创建者
    category: { type: String }, // 类型
    group: { type: String }, // 分组
    member: [{ type: Schema.Types.ObjectId, ref: 'user' }], // 成员
    year: { type: String }, // 年份
    quarter: { type: String }, // 季度
    theme: { type: String }, // 主题
    title: { type: String }, // 标题
    state: { type: String }, // 私有/公有
    describe: { type: String }, // 描述
    boards: [{
        creater: { type: Schema.Types.ObjectId }, // 创建者
        title: { type: String }, // okr 标题
        cards: [{
            title: { type: String }, // card 标题
            describe: { type: String }, // card 描述
            targets: { type: Array } // 目标
        }]
    }]
}, {
    versionKey: false, // 去掉版本锁 _v
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
})

export default mongoose.model('okrs', okrsSchema)
