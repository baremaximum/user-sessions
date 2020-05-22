import { RouteOptions } from "fastify";
import { loginHandler } from "../handlers/login.handler";

export const LoginRoute: RouteOptions = {
  method: "POST",
  logLevel: process.env.LOG_LEVEL,
  url: "/login",
  bodyLimit: 1048576 / 2, // Block any post reqs bigger than half a MB
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
      500: {
        type: "string",
      },
    },
  },
  handler: loginHandler,
};
