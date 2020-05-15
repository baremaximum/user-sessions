"use strict";
const fastify = require("fastify");
const fastifySession = require("fastify-session");
const fastifyCookie = require("fastify-cookie");
const secret = require("docker-secret");

function plugin(instance, options, next) {
    // register the required plugins
    instance.register(fastifyFormbody);
    const redisOpts = {
        host: "sessions_store",
        port: 6379,
        keepAlive: 10,
        password: secrets.redis_password,
    };
    instance.register(fastifyRedis, redisOpts);
    instance.register(fastifyCookie);
    instance.register(fastifySession, {
        cookieName: "sessionId",
        secret: secret.session_secret,
        cookie: { secure: false },
        expires: 1800000,
    });

    instance.get("/sesh", (request, reply) => {
        console.log(request.session);
    });

    next();
}

const server = new fastify();

server.register(plugin);
server.listen(30001, "0.0.0.0");