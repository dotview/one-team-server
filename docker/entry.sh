#bin/sh

git clean -df && git reset --hard && git pull

npm run bootstrap
npm run lint || exit 1
npm run build 

#pm2-runtime start ecosystem.config.js 
npm run preload && pm2 reload all