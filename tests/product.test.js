import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de router de products", async function () {
  let cookie;
  this.timeout(8000);
  before(async function () {
    const mockLogin = {
      email: "mombusssss@gmail.com",
      password: "123456",
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

  it("Endpoint GET /api/products debera traer todos los productos dentro de un array", async function () {
    const { _body } = await requester.get("/api/products");
    expect(_body).to.be.ok.and.have.property("payloads");
  });

  it("Endpoint GET /api/products/:pid debera traer el producto con dicho id", async function () {
    const idProduct = "6475835b7f22a5badadd65d5";
    const { _body } = await requester.get(`/api/products/${idProduct}`);
    expect(_body.payloads._id).to.be.eql(idProduct);
  });

  it("Endpoint PUT /api/products/:pid debera actualizar el producto con dicho id", async function () {
    const idProduct = "6475835b7f22a5badadd65d5";
    const mockProduct = {
      stock: 85,
      price: 5400,
    };
    const {_body} = await requester.put(`/api/products/${idProduct}`).set("Cookie", [`${cookie.name}=${cookie.value}`]).send(mockProduct);
    expect(_body.status).to.be.equal('success')
  });
});
