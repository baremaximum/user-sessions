import { App } from "../App";
import { Users } from "../DAO/Users.dao";
import bcryptjs from "bcryptjs";

describe("/login", () => {
  let app: App;

  beforeAll(async () => {
    // Setup application
    app = new App();
    app.getSecrets();
    app.registerPlugins();
    app.regiserRoutes();
    app.connectDb();
    await app.server.ready();
    app.injectDAO();

    const testUser = {
      username: "testuser",
      password: "testpassword",
      roles: [{ resource: "test", role: "root" }],
    };
    const salt = await bcryptjs.genSalt();
    testUser.password = await bcryptjs.hash(testUser.password, salt);
    // Insert a test user
    Users.collection().insertOne(testUser);
  });

  afterAll(async () => {
    app.server.close();
  });

  it("should respond with 'Unauthorized' and status 401 if user does not exist", async (done) => {
    const response = await app.server.inject({
      method: "POST",
      url: "/login",
      payload: { username: "fake", password: "userthatdoesnotexist" },
    });
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual("Unauthorized");
    done();
  });

  it("should set session cookie if user does exist", async (done) => {
    const response = await app.server.inject({
      method: "POST",
      url: "/login",
      payload: { username: "testuser", password: "testpassword" },
    });
    expect(response.cookies.length).toBe(1);
    done();
  });
});
