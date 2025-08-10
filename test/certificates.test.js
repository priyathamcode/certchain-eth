const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateNFT system", function () {
  it("deploys and issues a certificate", async function () {
    const [owner, uni, student] = await ethers.getSigners();
    const Univ = await ethers.getContractFactory("UniversityRegistry");
    const university = await Univ.deploy(owner.address);
    await university.deployed();

    // grant uni as university via registerUniversity by owner
    await university.registerUniversity(uni.address, "ipfs://meta");

    const Cert = await ethers.getContractFactory("CertificateNFT");
    const cert = await Cert.deploy(owner.address);
    await cert.deployed();

    // grant uni role on cert
    await cert.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("UNIVERSITY_ROLE")), uni.address);

    // connect as uni to issue
    const certAsUni = cert.connect(uni);
    await certAsUni.issueCertificate(student.address, 1, "ipfs://cid1");

    expect(await cert.ownerOf(1)).to.equal(student.address);
    expect(await cert.isValid(1)).to.equal(true);

    await certAsUni.revokeCertificate(1, "fraud");
    expect(await cert.isValid(1)).to.equal(false);
  });
});
