import chai from "chai";
import supertest from "supertest";
import { generateUser } from "../src/mocks/products-mock.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

export const testSession = describe("Testing de router de sessions", async function () {
  let cookie;
  this.timeout(8000);

  it("Endpoint POST /api/sessions/register debera crear un usuario", async function () {
    const mockUser = generateUser()
    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser);
    expect(response.status).to.be.equal(200);
  });

  it("Endpoint POST /api/sessions/login debera crear una cookie", async function () {
    const mockLogin = {
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
    };
    const response = await requester
      .post(`/api/sessions/login`)
      .send(mockLogin);
    const cookieResult = response.header["set-cookie"][0];
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
    expect(cookie.name).to.be.eql("authToken");
    expect(cookie.value).to.be.ok;
  });

  it("Endpoint GET /api/sessions/current debera traer al usuario logeado", async function () {
    const {_body} = await requester
      .get("/api/sessions/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(_body.payload).to.be.ok
  });
});
