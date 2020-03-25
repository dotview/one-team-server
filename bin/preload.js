'use strict'

const apollo = require('@aym/node-apollo')

// 携程apollo配置中心配置
const apollo_config = {
    configServerUrl: 'http://192.168.4.28:7070',
    appId: 'oneteamserver',
    clusterName: 'default',
    namespaceName: '',
    apolloEnv: process.env.EnvName || 'dev',
    token: '5df4fe6a3305f1d644cedb6cecdfa9239e44c74e'
}

// 读取携程apollo配置中心，并创建default.env文件
apollo.remoteConfigService(apollo_config)
    .then(bundle => {
        apollo.createEnvFile(bundle)
    })
    .catch(err => {
        console.error(err)
    }).done
