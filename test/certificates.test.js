const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateNFT", function () {
  it("deploys, grants minter, mints, and revokes", async function () {
    const [owner, uni, student] = await ethers.getSigners();

    const Cert = await ethers.getContractFactory("CertificateNFT");
    const cert = await Cert.deploy();
    await cert.deployed();

    const MINTER_ROLE = await cert.MINTER_ROLE();

    await cert.grantRole(MINTER_ROLE, uni.address);

    const certAsUni = cert.connect(uni);
    await certAsUni.mintCertificate(student.address);

    expect(await cert.ownerOf(0)).to.equal(student.address);
    expect(await cert.isValid(0)).to.equal(true);

    await cert.revokeCertificate(0);
    expect(await cert.isValid(0)).to.equal(false);
  });
});
