FROM node:13.7.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm install -g nodemon

COPY . .

CMD ["nodemon","npm", "start"]