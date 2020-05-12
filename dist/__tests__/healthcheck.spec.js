"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
describe("/healthz", () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = new App_1.App();
        app.registerPlugins();
        app.regiserRoutes();
        yield app.server.ready();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app.server.close();
    }));
    it("GET should return empty response with status 200", (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.server.inject({
            method: "GET",
            url: "/healthz",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("");
        done();
    }));
});
//# sourceMappingURL=healthcheck.spec.js.map