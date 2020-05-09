import fastifyBlipp from "fastify-blipp";
import { HealthCheckRoute } from "./routes/healthcheck.route";
import { App } from "./App";

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

const app = new App();

app.registerPlugins(fastifyBlipp);
app.regiserRoutes(HealthCheckRoute);
app.listen();
