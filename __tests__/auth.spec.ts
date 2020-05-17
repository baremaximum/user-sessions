import { App } from "../src/App";
import { Users } from "../src/DAO/Users.dao";
import bcryptjs from "bcryptjs";
import { Collection } from "mongodb";

describe("/login and /logout", () => {
  let app: App;
  let collection: Collection;

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
    const usr = await collection.insertOne(testUser);
  });

  afterAll(async () => {
    await collection.drop();
    app.server.redis.flushall();
    app.server.close();
  });

  it("should set session cookie if user does exist", async (done) => {
    const response = await app.server.inject({
      method: "POST",
      url: "/login",
      payload: { email: "testuser", password: "testpassword" },
    });
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
});