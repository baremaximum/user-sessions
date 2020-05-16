"use strict";
const fastify = require("fastify");
const fastifySession = require("fastify-session");
const fastifyCookie = require("fastify-cookie");
const secrets = require("docker-secret");
const fastifyRedis = require("fastify-redis");
const fastifyBlipp = require("fastify-blipp");

console.log("SECRET:", secrets)

function plugin(instance, options, next) {
    // register the required plugins
    const redisOpts = {
        host: "sessions_store",
        port: 6379,
        keepAlive: 10,
    };
    instance.register(fastifyBlipp);
    instance.register(fastifyRedis, redisOpts);
    instance.register(fastifyCookie, {
        secret: secrets.secrets.session_secret,
    });
    instance.register(fastifySession, {
        cookieName: "sessionId",
        secret: secrets.secrets.session_secret,
        cookie: {
            secure: false,
            domain: "0.0.0.0",
        },
        expires: 1800000,
        store: {
            set: (sessionId, session, callback) => {
                instance.redis.set(sessionId, JSON.stringify(session));
                callback();
            },
            get: async(sessionId, callback) => {
                const session = await instance.redis.get(sessionId);
                if (!(typeof session === "string")) {
                    callback(`Could not find session with id ${sessionId}`, null);
                } else {
                    callback(null, JSON.parse(session));
                }
            },
            destroy: (sessionId, callback) => {
                instance.redis.del(sessionId);
                callback();
            },
        },
    });

    instance.get("/sesh", (request, reply) => {
        console.log(request.session);
        reply.send(request.session);
    });

    next();
}

const server = new fastify();

server.register(plugin);
server.listen(30001, "0.0.0.0").then((server) => {
    console.log("Server is listening");
});