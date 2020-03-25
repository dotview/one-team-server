/**
 * 关注模板 集合定义
 */
import mongoose from './db.js'

const Schema = mongoose.Schema

const subscriptSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    subUserId: { type: Schema.Types.ObjectId, ref: 'user' },
    subUserTeam: { type: String },
    subUserName: { type: String }
})

export default mongoose.model('subscript', subscriptSchema)
