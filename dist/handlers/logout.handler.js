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
function logoutHandler(// Typescript can't recognize attributes added by plugins.
request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        // Have to use any because of issue with Mongodb types.
        let userDoc;
        // Check that token is valid. If not, return an error;
        try {
            token = jsonwebtoken_1.default.verify(request.session.accessToken, global.__jwt_secret__);
        }
        catch (err) {
            console.error(err);
            response.status(400).send("Invalid token.");
            return;
        }
        // Remove session from user document in DB.
        try {
            userDoc = yield Users_dao_1.Users.removeSessions(token.email);
        }
        catch (err) {
            console.error(`Could not remove session from user. Error: ${err}`);
            response.status(500).send("Server error");
            return;
        }
        // Destroy sessions other than the one attached to the current request
        try {
            userDoc.value.activeSessions.forEach((session) => {
                if (session.sessionId !== request.session.sessionId) {
                    this.redis.del(session.sessionId);
                }
            });
        }
        catch (err) {
            console.error(`Could not delete additional sessions. Error: ${err}`);
            response.status(500).send("Server error");
            return;
        }
        // Destroy current session in redis store.
        request.destroySession((err) => {
            if (err) {
                console.error(`Could not destroy current user session: Error: ${err}`);
                response.status(500).send("Server error");
            }
            // Clear all cookies and return confirmation of success.
            response.clearCookie("sessionId");
            response.clearCookie("accessToken");
            response.status(200).send("Logged out");
        });
    });
}
exports.logoutHandler = logoutHandler;
//# sourceMappingURL=logout.handler.js.map