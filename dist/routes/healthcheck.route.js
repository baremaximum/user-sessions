"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckRoute = {
    method: "GET",
    logLevel: process.env.LOG_LEVEL,
    url: "/healthz",
    schema: {
        response: {
            200: {
                type: "null",
            },
        },
    },
    handler(request, response) {
        response.send();
    },
};
//# sourceMappingURL=healthcheck.route.js.map