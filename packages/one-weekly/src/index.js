import setenv from './configs/setenv'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import config from './configs'
import business from './util/business'
import { jwtInvalid } from './middlewares/authHandler'

import Raven from 'raven'
// import morgan from 'koa-morgan'
// import fs from 'fs'
import path from 'path'
import koaStatic from 'koa-static'

import router from './routes/index'
import errorHandler from './middlewares/errorHandler'
import responseHandler from './middlewares/responseHandler'
import businessHandler from './middlewares/businessHandler'

const app = new Koa()
const env = process.env.NODE_ENV || 'development'
const dsn = config.DSN

if (env === 'production') {
    Raven.config(dsn).install()
}

// const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), {flags: 'a'})
// setup the logger

// app.use(morgan('combined', { stream: accessLogStream }))

app.use(koaStatic(path.join(__dirname, '/../static')))
app.use(koaStatic(path.join(__dirname, '/../out')))
app.use(bodyParser())
app.use(responseHandler())
app.use(businessHandler())
// app.use(errorHandler())

// 接口操作
app.use(cors({
    origin: function(ctx) {
        return 'http://localhost:8080'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))
app.use(business.jwtInvalid)
app.use(router)
app.on('error', (ctx, err) => {
    if (env === 'production') {
        Raven.captureException(err, function(err, eventId) {
            console.log('Error:' + eventId, 'err detail:', err)
        })
    } else {
        console.log('Error:', err.response)
    }
})

const port = process.env.PORT || config.dev.port
const host = process.env.HOST || '0.0.0.0'

// Launch Node.js server
app.listen(port, host, () => {
    console.log(`The server is running at http://${host}:${port}/`)
})
