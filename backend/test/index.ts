import { expect } from "chai";
import { ethers } from "hardhat";

describe("VoteManager", function () {

  it("Should create a new candidate", async function () {
    const VoteManager = await ethers.getContractFactory("VoteManager");
    const votemanager = await VoteManager.deploy();
    await votemanager.deployed();
    await votemanager.registerCanditate('Hannes', 'QmXMxbkj4Wbx8qn1PDZ4v91F9u6Y4YqHkieXmZDpPFKU4T')

    const candidates = await votemanager.fetchCandidates();
    console.log(candidates)
    expect(candidates[0].name).to.equal("Hannes")
  });

  it("Should faild create a duplcicate candidate", async function () {
    const VoteManager = await ethers.getContractFactory("VoteManager");
    const votemanager = await VoteManager.deploy();
    await votemanager.deployed();
    await votemanager.registerCanditate('Hannes', 'QmXMxbkj4Wbx8qn1PDZ4v91F9u6Y4YqHkieXmZDpPFKU4T')
    expect(() => votemanager.registerCanditate('Hannes', 'QmXMxbkj4Wbx8qn1PDZ4v91F9u6Y4YqHkieXmZDpPFKU4T')).to.throw("Candidate already registered");

  });
});
