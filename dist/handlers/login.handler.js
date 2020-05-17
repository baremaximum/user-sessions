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
const Users_dao_1 = require("../DAO/Users.dao");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const App_1 = require("../App");
function loginHandler(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = request.body;
        const user = yield Users_dao_1.Users.validatePassword(email, password);
        if (user) {
            const payload = {
                email: user.email,
                roles: user.roles,
            };
            const token = jsonwebtoken_1.default.sign(payload, global.__jwt_secret__);
            request.session.accessToken = token;
            yield Users_dao_1.Users.addSession(user._id, request.session.sessionId, token);
            response.setCookie("accessToken", token, {
                domain: process.env.DOMAIN,
                path: "/",
                maxAge: App_1.ONE_DAY,
            });
            response.send();
        }
        else {
            request.destroySession((err) => {
                if (err)
                    throw err;
                response.status(401).send("Unauthorized");
            });
        }
    });
}
exports.loginHandler = loginHandler;
//# sourceMappingURL=login.handler.js.map