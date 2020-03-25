FROM node:8.9.3-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN sed -i 's/alpine.gliderlabs.com/mirrors.ustc.edu.cn/g' /etc/apk/repositories

RUN apk update && apk add tzdata openssh git \
     && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

#RUN cp /root/.ssh /root/.ssh

RUN mkdir /app
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY lerna.json .
COPY package.json .


RUN npm config set sass-binary-site  http://npm.taobao.org/mirrors/node-sass \
    && npm config set registry http://registry.npm.taobao.org \
    && npm i lerna -g \
    && npm i pm2 -g

COPY . /app

RUN npm run bootstrap \
&& npm run build \
&& npm run preload \
&& npm run docs

EXPOSE 8081

#CMD ["npm", "run", "prod"]
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
