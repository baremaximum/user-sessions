"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRoute = void 0;
const login_handler_1 = require("../handlers/login.handler");
exports.LoginRoute = {
    method: "POST",
    logLevel: process.env.LOG_LEVEL,
    url: "/login",
    bodyLimit: 1048576 / 2,
    schema: {
        body: {
            type: "object",
            required: ["username", "password"],
            properties: {
                username: { type: "string", minLength: 4, maxLength: 100 },
                password: { type: "string", minLength: 8, maxLength: 200 },
            },
        },
        response: {
            200: {
                type: "string",
            },
        },
    },
    handler: login_handler_1.loginHandler,
};
//# sourceMappingURL=login.route.js.map