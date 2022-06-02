// require('@aym/node-apollo').setEnv()

// 保证之后的es6语法可用
require('babel-core/register')({
    presets: ['es2015', 'stage-2']
})

require('babel-polyfill')

// process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = require('../src/index.js')
