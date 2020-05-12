import { App } from "../App";

describe("/login", () => {
  let app: App;

  beforeAll(async () => {
    app = new App();
    app.registerPlugins();
    app.regiserRoutes();
    app.connectDb();
    await app.server.ready();
  });

  afterAll(async () => {
    app.server.close();
  });

  it("POST should set session-cookie to JWT token", async (done) => {
    const response = await app.server.inject({
      method: "POST",
      url: "/login",
      payload: { username: "test", password: "testpassword" },
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("OK");
    done();
  });
});
