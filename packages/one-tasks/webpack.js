var fs = require('fs');
var path = require('path')
var webpack = require('webpack')
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
    entry: { main: './src/libs/worker.js' },
    output: {
        filename: 'tasks.start.js',
        path: path.resolve(__dirname, './dist')
    },
    target: 'node',
    resolve: {
        // 自动补全的扩展名
        extensions: ['.js'],
        alias: {
            'src': path.join(__dirname, './src')
        }
    },
    node: {
        __filename: true,
        __dirname: true
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: path.join(__dirname, './src'),
            options: {
                formatter: require('eslint-friendly-formatter')
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.join(__dirname, './src'),
            exclude: [
                path.resolve(__dirname, 'node_modules'),
            ],
            options: {
                presets: ['node6', 'env', 'stage-3'],
                plugins: [
                    "transform-es2015-modules-commonjs",
                    "transform-runtime"
                ]
            }
        }]
    }
}
