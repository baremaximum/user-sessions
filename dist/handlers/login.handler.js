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
exports.loginHandler = void 0;
const Users_dao_1 = require("../DAO/Users.dao");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function loginHandler(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = request.body;
        const user = yield Users_dao_1.Users.validatePassword(email, password);
        if (user) {
            const token = jsonwebtoken_1.default.sign(user, global.__jwt_secret__);
            response.send(token);
        }
        else {
            response.status(401).send("Unauthorized");
        }
    });
}
exports.loginHandler = loginHandler;
//# sourceMappingURL=login.handler.js.map