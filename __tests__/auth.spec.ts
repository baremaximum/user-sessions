import { App } from "../src/App";
import { Users } from "../src/DAO/Users.dao";
import bcryptjs from "bcryptjs";
import { Collection } from "mongodb";
import { HTTPInjectOptions, HTTPInjectResponse } from "fastify";
import { User } from "../src/interfaces/User.interface";

describe("/login and /logout", () => {
  let app: App;
  let collection: Collection;
  const loginReq: HTTPInjectOptions = {
    method: "POST",
    url: "/login",
    payload: { email: "testuser", password: "testpassword" },
  };

  beforeAll(async () => {
    // Setup application
    app = new App();
    app.setup();
    await app.server.ready();
    app.injectDAO();
    collection = Users.collection();

    const testUser = {
      email: "testuser",
      password: "testpassword",
      roles: [{ resource: "test", role: "root" }],
    };
    const salt = await bcryptjs.genSalt();
    testUser.password = await bcryptjs.hash(testUser.password, salt);
    // Insert a test user
    await collection.insertOne(testUser);
  });

  afterAll(() => {
    collection.drop();
    app.server.redis.flushall();
    app.server.close();
  });

  it("should set session cookie if user does exist", async (done) => {
    const response = await app.server.inject(loginReq);
    expect(response.statusCode).toEqual(200);
    expect(response.cookies.length).toBe(2);
    done();
  });

  it("should respond with 'Unauthorized' and status 401 if user does not exist", async (done) => {
    const response = await app.server.inject({
      method: "POST",
      url: "/login",
      payload: { email: "fake", password: "userthatdoesnotexist" },
    });
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual("Unauthorized");
    expect(response.cookies.length).toBe(0);
    done();
  });

  describe("tests that require a logged in user", () => {
    let loginResponse: HTTPInjectResponse;
    let cookie: any;
    let logoutReq: HTTPInjectOptions;

    beforeEach(async () => {
      loginResponse = await app.server.inject(loginReq);
      cookie = loginResponse.cookies[1];
      logoutReq = {
        method: "DELETE",
        url: "/logout",
        cookies: { sessionId: cookie.value },
      };
    });

    it("Should return 'Logged out' with statusCode 200 on successful logout", async (done) => {
      const logoutResponse = await app.server.inject(logoutReq);
      expect(logoutResponse.statusCode).toEqual(200);
      expect(logoutResponse.body).toEqual("Logged out");
      logoutResponse.cookies.forEach((cookie: any) => {
        expect(cookie.expires < new Date()).toBe(true);
      });
      await app.server.inject(logoutReq);
      done();
    });

    it("Should have added current session to user's active sesions in DB", async (done) => {
      const res = await app.server.mongo.db?.collection("users").findOne({
        email: "testuser",
        activeSessions: { $size: 1 },
      });
      expect(res).not.toBeFalsy();
      await app.server.inject(logoutReq);
      done();
    });

    it("should remove all active sessions from user on logout", async (done) => {
      //start a second session with the same user
      await app.server.inject(loginReq);
      // Test to see if both sessions have been saved in DB.
      const res = await app.server.mongo.db?.collection("users").findOne({
        email: "testuser",
        activeSessions: { $size: 2 },
      });
      expect(res).not.toBeFalsy();
      await app.server.inject(logoutReq);
      // Test to see if both sessions have been deleted from DB.
      const logoutRes = await app.server.mongo.db?.collection("users").findOne({
        email: "testuser",
        $where: "this.activeSessions.length>0",
      });
      expect(logoutRes).toBeFalsy();
      done();
    });
  });
});
