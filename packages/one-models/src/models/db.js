/**
 * 数据库连接
 */
import mongoose from 'mongoose'
const dbUrl = process.env.NODE_ENV !== 'production' ? process.env['DB_URL_MAIN'] : 'mongodb://192.168.4.28:27017/oneteam'

/*
 */
mongoose.Promise = global.Promise
/**
 * 连接
 */
// mongoose.connect(dbUrl)

mongoose.connect(dbUrl, { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('Connection Error:' + err)
    } else {
        console.log('Connection success!')
    }
})

/**
 * 连接成功
 */
mongoose.connection.on('connected', function() {
    console.log('Mongoose connection open to ' + dbUrl)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err)
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose connection disconnected')
})

export default mongoose
