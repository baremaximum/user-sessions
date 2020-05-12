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
const Users_dao_1 = require("../DAO/Users.dao");
function loginHandler(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users_dao_1.Users.getUser(request.body.username);
        response.send("OK");
        // if (user && (await bcryptjs.compare(request.body.password, user.password))) {
        // }
    });
}
exports.loginHandler = loginHandler;
//# sourceMappingURL=login.handler.js.map