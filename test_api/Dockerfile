FROM node:14.2.0-alpine

RUN mkdir -p /app

WORKDIR /app

ARG NODE_ENV=production
ARG PORT=3000
ARG DOMAIN=0.0.0.0

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

RUN apk add libcurl

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "localhost:3000/healthz" ]

STOPSIGNAL SIGKILL

COPY . .

RUN apk add --no-cache --virtual .build-deps python g++ make gcc .build-deps curl git pixman-dev cairo-dev pangomm-dev libjpeg-turbo-dev giflib-dev \
  && npm install \
  && apk add --no-cache tini \
  && apk del .build-deps 


USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]

