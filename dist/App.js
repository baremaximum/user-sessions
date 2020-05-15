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
const docker_secret_1 = require("docker-secret");
// Plugins
const fastify_blipp_1 = __importDefault(require("fastify-blipp"));
const fastify_helmet_1 = __importDefault(require("fastify-helmet"));
const fastify_mongodb_1 = __importDefault(require("fastify-mongodb"));
const fastify_session_1 = __importDefault(require("fastify-session"));
const fastify_redis_1 = __importDefault(require("fastify-redis"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const fastify_formbody_1 = __importDefault(require("fastify-formbody"));
// DAOs
const Users_dao_1 = require("./DAO/Users.dao");
// Routes
const healthcheck_route_1 = require("./routes/healthcheck.route");
const login_route_1 = require("./routes/login.route");
const ONE_DAY = 1000 * 60 * 60 * 24; // in milliseconds
class App {
    constructor() {
        this.server = fastify_1.default({ logger: true });
        this.port = process.env.PORT || "30000";
        this.host = process.env.HOST || "0.0.0.0";
    }
    setup() {
        this.getSecrets();
        this.registerPlugins();
        this.regiserRoutes();
    }
    registerPlugins() {
        // form body
        this.server.register(fastify_formbody_1.default);
        // blipp
        this.server.register(fastify_blipp_1.default);
        // cookies
        this.server.register(fastify_cookie_1.default, { secret: global.__session_secret__ });
        // helmet
        this.server.register(fastify_helmet_1.default, {
            noCache: true,
            referrerPolicy: true,
        });
        // mongodb
        this.server.register(fastify_mongodb_1.default, {
            forceClose: true,
            url: docker_secret_1.secrets.db_url,
            database: "users",
        });
        // redis
        const redisOpts = {
            host: "sessions_store",
            port: 6379,
            keepAlive: 10,
            password: docker_secret_1.secrets.redis_password,
        };
        this.server.register(fastify_redis_1.default, redisOpts);
        // sessions
        this.server.register(fastify_session_1.default, {
            secret: global.__session_secret__,
            cookie: { maxAge: ONE_DAY, domain: process.env.DOMAIN, secure: "auto" },
            store: {
                set: (sessionId, session, callback) => {
                    this.server.redis.set(sessionId, JSON.stringify(session));
                    callback();
                },
                get: (sessionId, callback) => __awaiter(this, void 0, void 0, function* () {
                    const session = yield this.server.redis.get(sessionId);
                    if (!(typeof session === "string")) {
                        callback(`Could not find session with id ${sessionId}`, null);
                    }
                    else {
                        callback(null, JSON.parse(session));
                    }
                }),
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
        this.server.listen(parseInt(this.port), "0.0.0.0", (err) => {
            if (err)
                throw err;
            this.server.blipp();
            this.injectDAO();
        });
    }
    // Store secrets in memory at application startup.
    // Prevents having to do filesystem calls every time secret is needed.
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
    injectDAO() {
        if (!this.server.mongo.db)
            throw new Error("No database connection");
        const usersColl = this.server.mongo.db.collection("users");
        Users_dao_1.Users.injectDAO(usersColl);
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map