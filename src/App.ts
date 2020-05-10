import fastify, { Plugin, RouteOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { MongoClient } from "mongodb";
import { Users } from "./DAO/Users.dao";
import fs from "fs";

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

  public registerPlugins(
    ...args: Plugin<Server, IncomingMessage, ServerResponse, any>[]
  ): void {
    args.forEach((p) => this.server.register(p));
  }

  public regiserRoutes(...args: RouteOptions[]) {
    args.forEach((r) => this.server.route(r));
  }

  public listen() {
    this.server.listen(parseInt(this.port), this.host, (err) => {
      if (err) {
        this.server.log.error(err);
        this.server.blipp();
        console.error(err);
        process.exit(1);
      }
      this.server.log.info(`server listening on ${this.port}`);
    });
  }

  public close() {
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
