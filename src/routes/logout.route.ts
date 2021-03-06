import { RouteOptions } from "fastify";
import { logoutHandler } from "../handlers/logout.handler";

export const LogoutRoute: RouteOptions = {
  method: "DELETE",
  logLevel: process.env.LOG_LEVEL,
  url: "/logout",
  schema: {
    response: {
      200: {
        type: "string",
      },
      400: {
        type: "string",
      },
      500: {
        type: "string",
      },
    },
  },
  handler: logoutHandler,
};
