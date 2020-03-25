FROM node:8.9.3-alpine

COPY package.json .
COPY index.js .
RUN npm install

#expose
EXPOSE 4040

CMD ["npm", "start"]
