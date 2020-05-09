"use strict";
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
        return users
            .find({ email: email })
            .limit(1)
            .project({ email: 1, password: 1, roles: 1 });
    }
}
exports.Users = Users;
//# sourceMappingURL=Users.dao.js.map