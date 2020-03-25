// 保证之后的es6语法可用
// require('babel-core/register')({
//     presets: ['es2015', 'stage-2']
// })

// require('babel-polyfill')

// module.exports = require('../src/index.js')

var webpack = require('webpack')
var webpackConfig = require('../webpack.js')
var ora = require('ora')

var start = new Date()
// 使用 ora 打印出 loading + log
var spinner = ora('building for production...')
// 开始 loading 动画
spinner.start()

webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')

    var end = new Date()

    console.log('  Build complete.\n')
    console.log('executing time ', end - start)
})
