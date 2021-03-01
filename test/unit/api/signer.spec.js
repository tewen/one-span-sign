const { expect } = require("chai"); // eslint-disable-line no-unused-vars
const assembleSigner = require("../../../lib/api/signer");

describe("api/signer", function () {
  describe("assembleSigner()", function () {
    it("should build a signer utilizing the provided body", function () {
      expect(
        assembleSigner({
            email: "mail32@mailinator.com",
            firstName: "John",
            lastName: "Smith",
        })
      ).to.eql({
        type: "SIGNER",
        signers: [
          {
            email: "mail32@mailinator.com",
            firstName: "John",
            lastName: "Smith",
          },
        ],
      });
    });
    it("should utilize id if specified", function () {
      expect(
        assembleSigner({
          id: "25OR624-signer-1",
          email: "mail32@mailinator.com",
          firstName: "John",
          lastName: "Smith",
        })
      ).to.eql({
        type: "SIGNER",
        id: "25OR624-signer-1",
        name: "25OR624-signer-1",
        signers: [
          {
            email: "mail32@mailinator.com",
            firstName: "John",
            id: "25OR624-signer-1",
            lastName: "Smith",
          },
        ],
      });
    });
  });
});
