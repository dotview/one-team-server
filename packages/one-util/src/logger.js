import winston from 'winston'
import mkdirp from 'mkdirp'
import * as winstonRotate from 'winston-daily-rotate-file'

const logPath = './logs'
const env = process.env.NODE_ENV || 'development'
let logger

// create logs folder
mkdirp(logPath)

if (env === 'production') {
    // 分割日志文件
    const transport = new (winston.transports.DailyRotateFile)({
        filename: 'log-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        dirname: `${logPath}`,
        maxFiles: '14d'
    })

    logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: `${logPath}/error.log`,
          level: 'error'
        }),
        new winston.transports.File({
          filename: `${logPath}/info.log`,
          level: 'info'
        }),
        transport
      ]
    })
} else {
    logger = winston.createLogger({
        transports: [
        new winston.transports.Console()
        ]
    })
}


export default logger
