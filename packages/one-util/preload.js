'use strict';

const apollo = require('node-apollo');

// 携程apollo配置中心配置
const apollo_config = {
  configServerUrl: 'http://192.168.4.28:8270/',
  appId: 'oneteamserver',
  clusterName: 'default',
  namespaceName: '',
  apolloEnv: 'dev',
  token: '5c9e219c14561d7877dd46709656aaf693f77e32'
};

// 读取携程apollo配置中心，并创建default.env文件
apollo.remoteConfigService(apollo_config)
  .then(bundle => {
    console.log(bundle)
    apollo.createEnvFile(bundle)
  })
  .catch(err => {
    console.error(err);
  }).done;