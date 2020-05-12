import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import fastifyBlipp from "fastify-blipp";
import fastifyHelmet from "fastify-helmet";
import fastifyMongodb from "fastify-mongodb";
import { Users } from "./DAO/Users.dao";
import fs from "fs";
import { HealthCheckRoute } from "./routes/healthcheck.route";
import { LoginRoute } from "./routes/login.route";

// Allow binding to global
declare global {
  namespace NodeJS {
    interface Global {
      __jwt_secret__: string;
    }
  }
}

export class App {
  mongo: any;
  server: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  > = fastify({ logger: true });
  port = process.env.PORT || "3000";
  host = process.env.HOST || "0.0.0.0";

  constructor() {}

  public registerPlugins(): void {
    this.server.register(fastifyBlipp);
    this.server.register(fastifyHelmet, {
      noCache: true,
      referrerPolicy: true,
    });
  }

  public regiserRoutes(): void {
    this.server.route(HealthCheckRoute);
    this.server.route(LoginRoute);
  }

  public listen(): void {
    this.server.listen(parseInt(this.port), this.host, (err) => {
      if (err) throw err;
      this.server.blipp();
      this.injectDB();
      // Store jwt secret on global object
      const secret = fs.readFileSync("/run/secrets/jwt_secret").toString();
      global.__jwt_secret__ = secret;
    });
  }

  public async close(): Promise<void> {
    return this.server.close();
  }

  public connectDb(): void {
    const dbUrl = fs.readFileSync("/run/secrets/db_url");

    //Docker stores secrets as objects. Need to convert back to string
    this.server.register(fastifyMongodb, {
      forceClose: true,
      url: dbUrl.toString(),
      database: "users",
    });
  }

  public injectDB(): void {
    const usersColl = this.server.mongo.db?.collection("users");

    if (!usersColl) {
      throw new Error("Could not retrieve users collection");
    }

    Users.injectDB(usersColl);
  }
}
