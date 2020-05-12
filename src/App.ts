import fastify, { Plugin, RouteOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import fastifyBlipp from "fastify-blipp";
import fastifyHelmet from "fastify-helmet";
import { MongoClient } from "mongodb";
import { Users } from "./DAO/Users.dao";
import fs from "fs";
import { HealthCheckRoute } from "./routes/healthcheck.route";

export class App {
  connection: Promise<MongoClient>;
  server: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  > = fastify({ logger: true });

  port = process.env.PORT || "3000";
  host = process.env.HOST || "0.0.0.0";

  constructor() {
    this.connection = this.connectDb();
    this.injectDB();
  }

  public registerPlugins(): void {
    this.server.register(fastifyBlipp);
    this.server.register(fastifyHelmet, {
      noCache: true,
      referrerPolicy: true,
    });
  }

  public regiserRoutes(): void {
    this.server.route(HealthCheckRoute);
  }

  public listen(): void {
    this.server.listen(parseInt(this.port), this.host, (err) => {
      if (err) throw err;
      this.server.blipp();

      this.server.log.info(`server listening on ${this.port}`);
    });
  }

  public close(): Promise<void> {
    return this.server.close();
  }

  private async connectDb(): Promise<MongoClient> {
    const dbUrl = fs.readFileSync("/run/secrets/db_url");
    let conn;

    if (typeof dbUrl !== "object") {
      throw new Error(
        `DB_URL environment variable must be a string. Got: ${dbUrl}. Type: ${typeof dbUrl}`
      );
    }

    try {
      //Docker stores secrets as objects. Need to convert back to string
      conn = await MongoClient.connect(dbUrl.toString(), {
        useNewUrlParser: true,
        keepAlive: true,
        connectTimeoutMS: 50,
        useUnifiedTopology: true,
      });
      this.server.log.info("Successfully connected to the database");
    } catch (e) {
      throw new Error(`Could not connect to the database. Error: ${e}`);
    }

    return conn;
  }

  private async injectDB(): Promise<void> {
    const db = (await this.connection).db("users");
    Users.injectDB(db);
  }
}
