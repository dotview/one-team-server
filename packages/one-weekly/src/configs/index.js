export default {
    dev: {
        port: process.env.PORT || 8081
    },
    DB_URL: process.env['DB_URL_MAIN'],
    encrypt_key: process.env.encrypt_key || 'oneteam',
    DSN: process.env.DSN || 'https://xxx:xxx@sentry.xxx.com/11'
}
