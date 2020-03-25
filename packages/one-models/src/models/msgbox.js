import mongoose from './db.js'

const Schema = mongoose.Schema

const msgboxSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' }, // 用户id
    type: { type: String }, // 消息类型 ANSWER, NOREPORT,FEATURE
    isRead: { type: Boolean, default: false }, // 是否已读
    answerId: {
        type: Schema.Types.ObjectId,
        ref: 'answer'
    },
    reportId: {
        type: Schema.Types.ObjectId,
        ref: 'report'
    },
    content: {},
    url: { type: String }, // 内容点击地址
    date: { type: Date } // 消息时间
}, {
    versionKey: false, // 去掉版本锁 _v
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } // 自动管理修改时间
})

// msgboxSchema.virtual('content').get(() => {
//     return '1232'
// })

export default mongoose.model('msgbox', msgboxSchema)
