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
const Users_dao_1 = require("./DAO/Users.dao");
const fs_1 = __importDefault(require("fs"));
const healthcheck_route_1 = require("./routes/healthcheck.route");
const login_route_1 = require("./routes/login.route");
class App {
    constructor() {
        this.server = fastify_1.default({ logger: true });
        this.port = process.env.PORT || "3000";
        this.host = process.env.HOST || "0.0.0.0";
    }
    registerPlugins() {
        this.server.register(fastify_blipp_1.default);
        this.server.register(fastify_helmet_1.default, {
            noCache: true,
            referrerPolicy: true,
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
            this.injectDB();
            // Store jwt secret on global object
            const secret = fs_1.default.readFileSync("/run/secrets/jwt_secret").toString();
            global.__jwt_secret__ = secret;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.server.close();
        });
    }
    connectDb() {
        const dbUrl = fs_1.default.readFileSync("/run/secrets/db_url");
        //Docker stores secrets as objects. Need to convert back to string
        this.server.register(fastify_mongodb_1.default, {
            forceClose: true,
            url: dbUrl.toString(),
            database: "users",
        });
    }
    injectDB() {
        var _a;
        const usersColl = (_a = this.server.mongo.db) === null || _a === void 0 ? void 0 : _a.collection("users");
        if (!usersColl) {
            throw new Error("Could not retrieve users collection");
        }
        Users_dao_1.Users.injectDB(usersColl);
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map