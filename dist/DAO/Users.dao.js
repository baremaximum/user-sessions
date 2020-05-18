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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let users;
class Users {
    constructor() { }
    static injectDAO(coll) {
        if (!users) {
            users = coll;
        }
    }
    static getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users.findOne({ email: email }, { projection: { email: 1, password: 1, roles: 1 } });
        });
    }
    static validatePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(email);
            if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
                return user;
            }
            return null;
        });
    }
    static addSession(userId, sessionId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = {
                sessionId: sessionId,
                startedOn: new Date(),
                accessToken: token,
            };
            return users.updateOne({ _id: userId }, { $push: { activeSessions: session } });
        });
    }
    static removeSessions(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return users.updateOne({ email: email }, { $set: { activeSessions: [] } });
        });
    }
    static collection() {
        return users;
    }
}
exports.Users = Users;
//# sourceMappingURL=Users.dao.js.map