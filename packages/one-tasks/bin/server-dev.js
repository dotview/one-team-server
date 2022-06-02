// require('@aym/node-apollo').setEnv()
require('dotenv').config()

// 保证之后的es6语法可用
require('babel-core/register')({
    presets: ['es2015', 'stage-2']
})

require('babel-polyfill')

module.exports = require('../src/libs/worker.js')
