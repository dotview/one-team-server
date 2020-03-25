/**
 * 周报模板 集合定义
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const weeklyTemplateSchema = new Schema(
    {
        template: { type: String } // 周报内容
    },
    {
        versionKey: false, // 去掉版本锁 _v
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
    }
)

export default mongoose.model('weeklyTemplate', weeklyTemplateSchema)
