import { App } from "../App";
import { HealthCheckRoute } from "../routes/healthcheck.route";

describe("/healthz", () => {
  let app: App;

  beforeAll(async () => {
    app = new App();
    app.regiserRoutes(HealthCheckRoute);
    await app.server.ready();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET should return empty response with status 200", async (done) => {
    const response = await app.server.inject({
      method: "GET",
      url: "/healthz",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("");
    done();
  });
});
