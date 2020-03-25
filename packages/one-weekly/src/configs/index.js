export default {
    dev: {
        port: process.env.PORT || 8081
    },
    DB_URL: process.env.NODE_ENV === 'production' ? process.env['DB_URL_MAIN'] : 'mongodb://192.168.4.28:27017/oneteamtest',
    encrypt_key: process.env.encrypt_key || 'oneteam',
    DSN: process.env.DSN || 'https://xxx:xxx@sentry.xxx.com/11'
}
