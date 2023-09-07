import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

export const testCart =
  describe("Testing de router de products", async function () {
    let cookie;
    this.timeout(8000);
    before(async function () {
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
    });

    it("Endpoint GET /api/carts debe traer a todos los carritos", async function () {
      const { _body } = await requester
        .get("/api/carts")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body).to.be.ok;
    });

    it("Endpoint GET /api/carts/:cid debe traer solo al carrito con dicho id", async function () {
      const idCart = "64ba452f5213710ed554a9b7";
      const { _body } = await requester
        .get(`/api/carts/${idCart}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body.payload._id).to.be.eql(idCart);
    });

    it("Endpoint GET /api/carts/:cid/cantItems debe mostrar la cantidad de productos en dicho carrito", async function () {
      const idCart = "64ba452f5213710ed554a9b7";
      const {_body} = await requester
        .get(`/api/carts/${idCart}/cantItems`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body.payload).to.be.ok.and.a('number')
    });
  });
