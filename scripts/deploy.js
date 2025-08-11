const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy CertificateNFT
  const Cert = await hre.ethers.getContractFactory("CertificateNFT");
  const cert = await Cert.deploy();
  await cert.deployed();
  console.log("CertificateNFT deployed to:", cert.address);

  // Deploy Verification contract
  const Ver = await hre.ethers.getContractFactory("Verification");
  const ver = await Ver.deploy(cert.address);
  await ver.deployed();
  console.log("Verification deployed to:", ver.address);

  // Log deployment info for frontend setup
  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Copy this address to frontend/.env:");
  console.log(`VITE_CONTRACT_ADDRESS=${cert.address}`);
  console.log("\nContract owner:", deployer.address);
  console.log("Import these private keys to MetaMask for testing:");
  console.log("Account #0:", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  console.log("Account #1:", "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
