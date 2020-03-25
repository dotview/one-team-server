/**
 * 用户 集合定义
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const userSchema = new Schema({
    eMail: { type: String }, // 邮箱
    nickName: { type: String }, // 用户昵称
    userPassword: { type: String }, // 密码
    headPortrait: { type: String }, // 头像
    phoneNumber: { type: String }, // 电话号码
    loginTime: { type: Date }, // 注册时间
    teamId: { type: Schema.Types.ObjectId, ref: 'team' }, // 大组id
    groupId: { type: Schema.Types.ObjectId, ref: 'team' }, // 小组id
    creatTime: { type: Date, default: Date.now }, // 创建时间
    emailCode: { type: Number },
    emailCodeCreateTime: { type: Date },
    white: { type: Boolean } // 是否在白名单中
})

export default mongoose.model('user', userSchema)
