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
const mongodb_1 = require("mongodb");
const Users_dao_1 = require("./DAO/Users.dao");
const fs_1 = __importDefault(require("fs"));
const healthcheck_route_1 = require("./routes/healthcheck.route");
class App {
    constructor() {
        this.server = fastify_1.default({ logger: true });
        this.port = process.env.PORT || "3000";
        this.host = process.env.HOST || "0.0.0.0";
        this.connection = this.connectDb();
        this.injectDB();
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
    }
    listen() {
        this.server.listen(parseInt(this.port), this.host, (err) => {
            if (err)
                throw err;
            this.server.blipp();
            this.server.log.info(`server listening on ${this.port}`);
        });
    }
    close() {
        return this.server.close();
    }
    connectDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUrl = fs_1.default.readFileSync("/run/secrets/db_url");
            let conn;
            if (typeof dbUrl !== "object") {
                throw new Error(`DB_URL environment variable must be a string. Got: ${dbUrl}. Type: ${typeof dbUrl}`);
            }
            try {
                //Docker stores secrets as objects. Need to convert back to string
                conn = yield mongodb_1.MongoClient.connect(dbUrl.toString(), {
                    useNewUrlParser: true,
                    keepAlive: true,
                    connectTimeoutMS: 50,
                    useUnifiedTopology: true,
                });
                this.server.log.info("Successfully connected to the database");
            }
            catch (e) {
                throw new Error(`Could not connect to the database. Error: ${e}`);
            }
            return conn;
        });
    }
    injectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (yield this.connection).db("users");
            Users_dao_1.Users.injectDB(db);
        });
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map