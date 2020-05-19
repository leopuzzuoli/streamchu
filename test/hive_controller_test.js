let assert = require("assert");
let sinon = require("sinon");
let chai = require("chai");
let rewire = require("rewire");
let chaiHttp = require("chai-http");
let path = require("path");
let expect = chai.expect;
let hive = rewire("../main_server/hive_controller.js");
//spawn process

chai.use(chaiHttp);

describe("hive_controller", () => {
  it("handle key not found", () => {
    assert(true);
  });
  describe("#/stream", () => {

    let close = hive.__get__("closeServer");
    let open = hive.__get__("openServer");
    //stub allocRes
    let allocStub = sinon.stub().resolves("127.0.0.1:0000");
    hive.__set__("allocRes", allocStub);

    //before each call except when first one restart server, then close it
    let firstrun = true;
    beforeEach(function(done) {
      if (!firstrun) {
        open();
        done();
      }
      done();
    });
    afterEach(function(done) {
      close();
      done();
    });
    //after last close dataabse connection
    after(function (done) {
      let db_con = hive.__get__("con");
      db_con.end();
      done();
    });
    it("/stream called with correct parameters - return port and ip", (done) => {
      chai
        .request("http://127.0.0.1:8002")
        .post("/stream")
        .set('content-type', 'application/json')
        .send({
          username: 'lr002',
          sessid: '00050ab05fdd2f6488bf1ecacb2b233f'
        })
        .end(function(error, response, body) {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response.text).to.equal("127.0.0.1:0000");
          done();
        });
      assert(true);
    });
    it("/stream called with invalid username - return 401", () => {
      assert(true);
    });
    it("/stream called with invalid sessionID - return 401", () => {
      assert(true);
    });
    it("/stream called with neither sessID nor username should return 400", () => {
      assert(true);
    });
    it("/stream called with dirty input - return 401", () => {
      assert(true);
    });
    it("/stream streamer is already streaming - return 401", () => {
      assert(true);
    });
    it("/stream streamer has no more account minutes - return 401", () => {
      assert(true);
    });
    it("/stream lobby didn't start - return 503 (?)", () => {
      assert(true);
    });

  });
  describe("#allocRes function", () => {
    //replace axios.post and database insertion (query)
    it("lobby started successfully - return address, check insertions", () => {

      assert(true);
    });
    it("lobby not started successfully - try again, return error", () => {
      assert(true);
    });
  });
});
