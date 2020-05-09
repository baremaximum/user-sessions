FROM node:14.2.0-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json package.json

COPY ./dist .

ENV NODE_ENV=production \
  LOG_LEVEL=error 

RUN apk add --no-cache --virtual .build-deps python g++ make gcc .build-deps curl git pixman-dev cairo-dev pangomm-dev libjpeg-turbo-dev giflib-dev \
  && npm install \
  && apk add --no-cache tini \
  && apk del .build-deps 

USER node

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]

