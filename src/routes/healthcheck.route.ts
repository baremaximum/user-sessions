import { RouteOptions } from "fastify";

export const HealthCheckRoute: RouteOptions = {
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
    // Destroy healthcheck sessions immediately
    request.destroySession((err) => {
      if (err) throw err;
    });
    response.send();
  },
};
