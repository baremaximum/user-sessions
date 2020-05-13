"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_blipp_1 = __importDefault(require("fastify-blipp"));
const fastify_helmet_1 = __importDefault(require("fastify-helmet"));
const fastify_mongodb_1 = __importDefault(require("fastify-mongodb"));
const fastify_session_1 = __importDefault(require("fastify-session"));
const fastify_redis_1 = __importDefault(require("fastify-redis"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const Users_dao_1 = require("./DAO/Users.dao");
const healthcheck_route_1 = require("./routes/healthcheck.route");
const login_route_1 = require("./routes/login.route");
const docker_secret_1 = require("docker-secret");
const ONE_DAY = 1000 * 60 * 60 * 24;
class App {
    constructor() {
        this.server = fastify_1.default({ logger: true });
        this.port = process.env.PORT || "3000";
        this.host = process.env.HOST || "0.0.0.0";
    }
    registerPlugins() {
        this.server.register(fastify_blipp_1.default);
        this.server.register(fastify_cookie_1.default, { secret: global.__session_secret__ });
        // helmet
        this.server.register(fastify_helmet_1.default, {
            noCache: true,
            referrerPolicy: true,
        });
        // redis
        const redisOpts = {
            host: "sessions_store",
            port: 6379,
            keepAlive: 10,
            password: docker_secret_1.secrets.redis_password,
        };
        this.server.register(fastify_redis_1.default, redisOpts);
        // // sessions
        this.server.register(fastify_session_1.default, {
            secret: global.__session_secret__,
            cookie: { maxAge: ONE_DAY, domain: process.env.DOMAIN, secure: "auto" },
            store: {
                set: (sessionId, session, callback) => {
                    this.server.redis.set(sessionId, session);
                    callback();
                },
                get: (sessionId, callback) => {
                    const session = this.server.redis.get(sessionId);
                    callback(undefined, session);
                },
                destroy: (sessionId, callback) => {
                    this.server.redis.del(sessionId);
                    callback();
                },
            },
        });
    }
    regiserRoutes() {
        this.server.route(healthcheck_route_1.HealthCheckRoute);
        this.server.route(login_route_1.LoginRoute);
    }
    listen() {
        this.server.listen(parseInt(this.port), this.host, (err) => {
            if (err)
                throw err;
            this.server.blipp();
            this.injectDAO();
        });
    }
    // Store secrets in memory at application startup
    getSecrets() {
        const { jwt_secret, session_secret, redis_password } = docker_secret_1.secrets;
        global.__jwt_secret__ = jwt_secret;
        global.__session_secret__ = session_secret;
        global.__redis_password__ = redis_password;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.server.close();
        });
    }
    connectDb() {
        //Docker stores secrets as objects. Need to convert back to string
        this.server.register(fastify_mongodb_1.default, {
            forceClose: true,
            url: docker_secret_1.secrets.db_url,
            database: "users",
        });
    }
    injectDAO() {
        var _a;
        const usersColl = (_a = this.server.mongo.db) === null || _a === void 0 ? void 0 : _a.collection("users");
        if (!usersColl) {
            throw new Error("Could not retrieve users collection");
        }
        Users_dao_1.Users.injectDAO(usersColl);
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map