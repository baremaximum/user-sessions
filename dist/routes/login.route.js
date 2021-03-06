"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_handler_1 = require("../handlers/login.handler");
exports.LoginRoute = {
    method: "POST",
    logLevel: process.env.LOG_LEVEL,
    url: "/login",
    bodyLimit: 1048576 / 2,
    schema: {
        body: {
            required: ["email", "password"],
            properties: {
                username: { type: "string", minLength: 4, maxLength: 100 },
                password: { type: "string", minLength: 8, maxLength: 200 },
            },
        },
        response: {
            200: {
                type: "null",
            },
            401: {
                type: "string",
            },
        },
    },
    handler: login_handler_1.loginHandler,
};
//# sourceMappingURL=login.route.js.map