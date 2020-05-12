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
    static injectDB(dbo) {
        if (!users) {
            users = dbo.collection("users");
        }
    }
    static getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return users.findOne({ email: email }, { projection: { email: 1, password: 1, roles: 1 } });
        });
    }
}
exports.Users = Users;
//# sourceMappingURL=Users.dao.js.map