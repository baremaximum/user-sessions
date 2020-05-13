FROM node:14.2.0-alpine

RUN mkdir -p /app/dist
RUN mkdir -p /app/src

WORKDIR /app

COPY package.json package.json

RUN apk add --no-cache --virtual .build-deps python g++ make gcc .build-deps curl git pixman-dev cairo-dev pangomm-dev libjpeg-turbo-dev giflib-dev \
  && npm install \
  && apk add --no-cache tini \
  && apk del .build-deps 

COPY ./dist ./dist
COPY ./tsconfig.json ./tsconfig.json

ARG NODE_ENV
ARG LOG_LEVEL

ENV NODE_ENV=${NODE_ENV} \
  LOG_LEVEL=${LOG_LEVEL}

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]

