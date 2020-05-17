"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logout_handler_1 = require("../handlers/logout.handler");
exports.LogoutRoute = {
    method: "DELETE",
    logLevel: process.env.LOG_LEVEL,
    url: "/logout",
    schema: {
        response: {
            200: {
                type: "string",
            },
        },
    },
    handler: logout_handler_1.logoutHandler,
};
//# sourceMappingURL=logout.route.js.map