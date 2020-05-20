import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { RedisOptions } from "ioredis";
import { secrets } from "docker-secret";
// Plugins
import fastifyBlipp from "fastify-blipp";
import fastifyHelmet from "fastify-helmet";
import fastifyMongodb from "fastify-mongodb";
import fastifySession from "fastify-session";
import fastifyRedis from "fastify-redis";
import fastifyCookie from "fastify-cookie";
import fastifyFormBody from "fastify-formbody";
// DAOs
import { Users } from "./DAO/Users.dao";
// Routes
import { HealthCheckRoute } from "./routes/healthcheck.route";
import { LoginRoute } from "./routes/login.route";
import { LogoutRoute } from "./routes/logout.route";

export const ONE_DAY = 1000 * 60 * 60 * 24; // in milliseconds

// Allow binding to global
declare global {
  namespace NodeJS {
    interface Global {
      __jwt_secret__: string;
      __session_secret__: string;
    }
  }
}

export class App {
  server: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  > = fastify({
    logger: { level: process.env.LOG_LEVEL },
    trustProxy: 1,
    caseSensitive: true,
  });
  port = process.env.PORT || "3000";
  host = process.env.HOST || "0.0.0.0";

  constructor() {}

  public setup(): void {
    try {
      this.getSecrets();
    } catch (err) {
      this.server.log.error(`Could not retrieve secrets. Error: ${err}`);
      process.exit(1);
    }

    try {
      this.registerPlugins();
    } catch (err) {
      this.server.log.error(`Could not register plugins. Error: ${err}`);
      process.exit(1);
    }

    try {
      this.regiserRoutes();
    } catch (err) {
      this.server.log.error(`Could not register routes. Error: ${err}`);
      process.exit(1);
    }
  }

  public registerPlugins(): void {
    // form body
    this.server.register(fastifyFormBody);
    // blipp
    this.server.register(fastifyBlipp);
    // cookies
    this.server.register(fastifyCookie, { secret: global.__session_secret__ });
    // helmet
    this.server.register(fastifyHelmet, {
      noCache: true,
      referrerPolicy: true,
    });
    // mongodb
    this.server.register(fastifyMongodb, {
      forceClose: true,
      url: secrets.db_url,
      database: "users",
    });
    // redis
    const redisOpts: RedisOptions = {
      host: process.env.REDIS_URL,
      port: 6379,
      keepAlive: 10,
      password: secrets.redis_password,
    };
    this.server.register(fastifyRedis, redisOpts);
    // sessions
    this.server.register(fastifySession, {
      secret: global.__session_secret__,
      cookie: { maxAge: ONE_DAY, domain: process.env.DOMAIN, secure: "auto" },
      store: {
        set: (sessionId: string, session: any, callback: Function): void => {
          this.server.redis.set(sessionId, JSON.stringify(session));
          callback();
        },
        get: async (sessionId: string, callback: Function): Promise<void> => {
          // Handles cases where logout requests are sent with already deleted sessions.
          const session = await this.server.redis.get(sessionId);
          if (!(typeof session === "string")) {
            callback(`Could not find session`, null);
          } else {
            callback(null, JSON.parse(session));
          }
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
    this.server.route(LogoutRoute);
  }

  public listen(): void {
    this.server.listen(parseInt(this.port), this.host, (err) => {
      if (err) throw err;
      this.server.blipp();
      this.injectDAO();
    });
  }

  // Store secrets in memory at application startup.
  // Prevents having to do filesystem calls every time secret is needed.
  public getSecrets(): void {
    const { jwt_secret, session_secret } = secrets;
    global.__jwt_secret__ = jwt_secret;
    global.__session_secret__ = session_secret;
  }

  public async close(): Promise<void> {
    return this.server.close();
  }

  public injectDAO(): void {
    // This typeguard is just to please typescript compiler.
    if (!this.server.mongo.db) throw new Error("No database connection");
    const usersColl = this.server.mongo.db.collection("users");
    Users.injectDAO(usersColl);
  }
}
