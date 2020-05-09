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
const mongodb_1 = require("mongodb");
const Users_dao_1 = require("./DAO/Users.dao");
const fs_1 = __importDefault(require("fs"));
class App {
    constructor() {
        this.server = fastify_1.default({ logger: true });
        this.port = process.env.PORT || "3000";
        this.connection = this.connectDb();
        this.injectDB();
    }
    registerPlugins(...args) {
        args.forEach((p) => this.server.register(p));
    }
    regiserRoutes(...args) {
        args.forEach((r) => this.server.route(r));
    }
    listen() {
        this.server.listen(this.port, (err) => {
            if (err) {
                this.server.log.error(err);
                this.server.blipp();
                console.error(err);
                process.exit(1);
            }
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
            if (typeof dbUrl !== "string") {
                throw new Error("DB_URL environment variable must be a string");
            }
            try {
                conn = yield mongodb_1.MongoClient.connect(dbUrl, {
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