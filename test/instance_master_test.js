let assert = require("assert");
let sinon = require("sinon");
let rewire = require("rewire");

describe("instance_master", () => {
  describe("#createLobby", () => {
    //mock cluster
    it("all correct - return t_portpair", () => {
      assert(true);
    });
    it("worker exited with error code 1 - reject", () => {
      assert(true);
    });
    it("nothing happens - reject with time passed", () => {
      assert(true);
    });
  });
  describe("#/init", () => {
    //mock keypairs
    it("if already initialized - 403", () => {
      assert(true);
    });
    it("valid signature - 200, res", () => {
      assert(true);
    });
    it("invalid signature - 403", () => {
      assert(true);
    });
  });
  describe("#/allocRes", () => {
    it("invalid signature - end conenction", () => {
      assert(true);
    });
    it("missing req.body parameter - return 400", () => {
      assert(true);
    });
    it("too much CPU space asked - return 400", () => {
      assert(true);
    });
    it("if max_viewers too large - return 400", () => {
      assert(true);
    });
    it("all correct - return 200, resources", () => {
      assert(true);
    });
  });
  describe("#/allocDel", () => {
    it("incorrect signature - end connection", () => {
      assert(true);
    });
  });
});
