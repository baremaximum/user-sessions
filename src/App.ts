import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import fastifyBlipp from "fastify-blipp";
import fastifyHelmet from "fastify-helmet";
import fastifyMongodb from "fastify-mongodb";
import fastifySession from "fastify-session";
import fastifyRedis from "fastify-redis";
import fastifyCookie from "fastify-cookie";
import { Users } from "./DAO/Users.dao";
import { HealthCheckRoute } from "./routes/healthcheck.route";
import { LoginRoute } from "./routes/login.route";
import { RedisOptions } from "ioredis";
import { secrets } from "docker-secret";
import { callbackify } from "util";

const ONE_DAY = 1000 * 60 * 60 * 24;

// Allow binding to global
declare global {
  namespace NodeJS {
    interface Global {
      __jwt_secret__: string;
      __session_secret__: string;
      __redis_password__: string;
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
    // blipp
    this.server.register(fastifyBlipp);
    // cookies
    this.server.register(fastifyCookie, { secret: global.__session_secret__ });
    // helmet
    this.server.register(fastifyHelmet, {
      noCache: true,
      referrerPolicy: true,
    });
    // redis
    const redisOpts: RedisOptions = {
      host: "sessions_store",
      port: 6379,
      keepAlive: 10,
      password: secrets.redis_password,
    };
    this.server.register(fastifyRedis, redisOpts);
    // // sessions
    this.server.register(fastifySession, {
      secret: global.__session_secret__,
      cookie: { maxAge: ONE_DAY, domain: process.env.DOMAIN, secure: "auto" },
      store: {
        set: (sessionId: string, session: string, callback: Function): void => {
          this.server.redis.set(sessionId, session);
          callback();
        },
        get: (sessionId: string, callback: Function): void => {
          const session = this.server.redis.get(sessionId);
          callback(undefined, session);
        },
        destroy: (sessionId: string, callback: Function): void => {
          this.server.redis.del(sessionId);
          callback();
        },
      },
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
      this.injectDAO();
    });
  }

  // Store secrets in memory at application startup
  public getSecrets(): void {
    const { jwt_secret, session_secret, redis_password } = secrets;
    global.__jwt_secret__ = jwt_secret;
    global.__session_secret__ = session_secret;
    global.__redis_password__ = redis_password;
  }

  public async close(): Promise<void> {
    return this.server.close();
  }

  public connectDb(): void {
    //Docker stores secrets as objects. Need to convert back to string
    this.server.register(fastifyMongodb, {
      forceClose: true,
      url: secrets.db_url,
      database: "users",
    });
  }

  public injectDAO(): void {
    const usersColl = this.server.mongo.db?.collection("users");

    if (!usersColl) {
      throw new Error("Could not retrieve users collection");
    }

    Users.injectDAO(usersColl);
  }
}
