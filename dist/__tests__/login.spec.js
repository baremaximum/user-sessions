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
const App_1 = require("../App");
const Users_dao_1 = require("../DAO/Users.dao");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
describe("/login", () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Setup application
        app = new App_1.App();
        app.getSecrets();
        app.registerPlugins();
        app.regiserRoutes();
        app.connectDb();
        yield app.server.ready();
        app.injectDAO();
        const testUser = {
            username: "testuser",
            password: "testpassword",
            roles: [{ resource: "test", role: "root" }],
        };
        const salt = yield bcryptjs_1.default.genSalt();
        testUser.password = yield bcryptjs_1.default.hash(testUser.password, salt);
        // Insert a test user
        Users_dao_1.Users.collection().insertOne(testUser);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app.server.close();
    }));
    it("should respond with 'Unauthorized' and status 401 if user does not exist", (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.server.inject({
            method: "POST",
            url: "/login",
            payload: { username: "fake", password: "userthatdoesnotexist" },
        });
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual("Unauthorized");
        done();
    }));
    it("should set session cookie if user does exist", (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.server.inject({
            method: "POST",
            url: "/login",
            payload: { username: "testuser", password: "testpassword" },
        });
        expect(response.cookies.length).toBe(1);
        done();
    }));
});
//# sourceMappingURL=login.spec.js.map