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
function logoutHandler(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        // Check that token is valid. If not, return an error;
        try {
            token = jsonwebtoken_1.default.verify(request.session.accessToken, global.__jwt_secret__);
        }
        catch (err) {
            console.error(err);
            response.status(400).send("Invalid token.");
            return;
        }
        // Remove session from user document in DB. Return error if this fails.
        try {
            yield Users_dao_1.Users.removeSessions(token.email);
        }
        catch (err) {
            console.error(`Could not remove session from user. Error: ${err}`);
            response.status(500).send("Server error");
            return;
        }
        // Destroy session in redis store. Return error if this fails.
        request.destroySession((err) => {
            if (err) {
                console.error(`An error occurred while destroying user session: Error: ${err}`);
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