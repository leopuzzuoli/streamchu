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
    let allocReset = hive.__set__("allocRes", allocStub);

    //before each call except when first one restart server, then close it
    let firstrun = true;

    beforeEach(function(done) {
      if (!firstrun) {
        open(done);
      } else {
        firstrun = false;
        done();
      }
    });
    afterEach(function(done) {
      close();
      done();
    });
    //after last close dataabse connection
    after(function(done) {
      //end database conenction
      let db_con = hive.__get__("con");
      db_con.end();

      //reset allocRes
      allocReset();
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

    });
    //TODO: during production do NOT run against actual mysql
    it("/stream called with invalid username - return 401", (done) => {
      chai
        .request("http://127.0.0.1:8002")
        .post("/stream")
        .set('content-type', 'application/json')
        .send({
          username: 'invalid',
          sessid: '00050ab05fdd2f6488bf1ecacb2b233f'
        })
        .end(function(error, response, body) {
          expect(error).to.be.null;
          expect(response).to.have.status(401);
          expect(response.text === "Invalid credentials");
          done();
        });
    });
    it("/stream called with invalid sessionID - return 401", (done) => {
      chai
        .request("http://127.0.0.1:8002")
        .post("/stream")
        .set('content-type', 'application/json')
        .send({
          username: 'lr002',
          sessid: 'invalid'
        })
        .end(function(error, response, body) {
          expect(error).to.be.null;
          expect(response).to.have.status(401);
          expect(response.text === "Invalid credentials");
          done();
        });
    });
    it("/stream called with neither sessID nor username should return 400", (done) => {
      chai
        .request("http://127.0.0.1:8002")
        .post("/stream")
        .set('content-type', 'application/json')
        .send({
          random: "random parameter"
        })
        .end(function(error, response, body) {
          expect(error).to.be.null;
          expect(response).to.have.status(400);
          expect(response.text === "Bad request");
          done();
        });
    });
    it("/stream called with dirty input - return 401", (done) => {
      chai
        .request("http://127.0.0.1:8002")
        .post("/stream")
        .set('content-type', 'application/json')
        .send({
          username: " AND SELECT * FROM streamer_session;",
          sessid: '00050ab05fdd2f6488bf1ecacb2b233f'
        })
        .end(function(error, response, body) {
          expect(error).to.be.null;
          expect(response).to.have.status(401);
          expect(response.text === "Bad Input");
          done();
        });
    });
    it("/stream streamer is already streaming - return 401", (done) => {
      chai
        .request("http://127.0.0.1:8002")
        .post("/stream")
        .set('content-type', 'application/json')
        .send({
          username: " lr001",
          sessid: '00050ab05fdd2f6488bf1ecacb2b2330'
        })
        .end(function(error, response, body) {
          expect(error).to.be.null;
          expect(response).to.have.status(401);
          expect(response.text === "You are already streaming");
          done();
        });
    });
    it("/stream streamer has no more account minutes - return 401", (done) => {
      chai
        .request("http://127.0.0.1:8002")
        .post("/stream")
        .set('content-type', 'application/json')
        .send({
          username: " lr003",
          sessid: '00050ab05fdd2f6488bf1ecacb2b2338'
        })
        .end(function(error, response, body) {
          expect(error).to.be.null;
          expect(response).to.have.status(401);
          expect(response.text === "Account minutes depleted");
          done();
        });
    });
    it("/stream lobby didn't start - return 503 (?)", () => {
      assert(true);
    });
  });
  describe("#allocRes function", () => {
    let axiosStub;
    let allocRes;
    before((done) => {
      allocRes = hive.__get__("allocRes");
      //let setupKey = hive.__get__("setupKey");
      //setupKey();
      //replace rsa key with fake
      let keyreplacement = {
        sign: () => {
          return ("signature");
        }
      }
      hive.__set__("key", keyreplacement);
      //replace axios.post and database insertion (query)
      let resCode = 200;
      axiosStub = {
        post: sinon.stub().resolves({
          status: resCode,
          data: {
            port: "s1892v1893",
            resources: 20
          }
        })
      }
      hive.__set__("axios", axiosStub);

      let dbStub = {
        query: function(query, c) {
          return new Promise((resolve, reject) => {
            if (query.startsWith("INSERT")) {
              resolve();
            } else if (query.startsWith("UPDATE")) {
              resolve();
            }
          });
        }
      };
      hive.__set__("database", dbStub);
      done();
    });

    it("lobby started successfully - return address, check insertions", (done) => {
      allocRes("127.0.0.1", 2000, 20, "Laurie Breem", "01213131831893813").then((address) => {
        expect(address === "127.0.0.1:1892");
        let jsonReq = {
          max_viewers: 2000,
          streamer_dn: "Laurie Breem",
          time_remaining: 20,
          signature: "signaure",
          sessid: "01213131831893813"
        };
        expect(axiosStub.post.getCall(0).args[0] === ["http://127.0.0.1:8003/allocRes", jsonReq]);
        done();
      });
    });
    it("lobby not started successfully - try again, return error", () => {
      assert(true);
    });
  });
});
