"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_blipp_1 = __importDefault(require("fastify-blipp"));
const healthcheck_route_1 = require("./routes/healthcheck.route");
const App_1 = require("./App");
// Restart server on error. Deployment (Docker/Kubernetes)
// will restart automatically.
process.on("uncaughtException", (error) => {
    console.error(error);
    process.exit(1);
});
process.on("unhandledRejection", (error) => {
    console.error(error);
    process.exit(1);
});
const app = new App_1.App();
app.registerPlugins(fastify_blipp_1.default);
app.regiserRoutes(healthcheck_route_1.HealthCheckRoute);
app.listen();
//# sourceMappingURL=index.js.map