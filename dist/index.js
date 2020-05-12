"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
app.registerPlugins();
app.regiserRoutes();
app.connectDb();
app.listen();
//# sourceMappingURL=index.js.map