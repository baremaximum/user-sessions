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
Object.defineProperty(exports, "__esModule", { value: true });
let users;
// Singleton
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
            yield users.insertOne({
                email: "testemail",
                password: "testpassword",
                roles: [{ resource: "test", role: "root" }],
            });
            const user = yield this.getUser(email);
            if (user) {
                return user;
            }
            return null;
        });
    }
    static collection() {
        return users;
    }
}
exports.Users = Users;
//# sourceMappingURL=Users.dao.js.map