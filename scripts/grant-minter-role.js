const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const argAddr = process.argv.find((a) => a.startsWith("--contract="));
  const fromArg = argAddr ? argAddr.split("=")[1] : undefined;
  const fromEnv = process.env.CONTRACT_ADDRESS;

  const CONTRACT_ADDRESS = fromArg || fromEnv || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const MINTER_ADDRESS = (await hre.ethers.getSigner("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")).address;

  console.log("Granting MINTER_ROLE...");
  console.log("Admin (deployer):", deployer.address);
  console.log("New Minter:", MINTER_ADDRESS);
  console.log("Contract:", CONTRACT_ADDRESS);

  const cert = await hre.ethers.getContractAt("CertificateNFT", CONTRACT_ADDRESS, deployer);

  const MINTER_ROLE = await cert.MINTER_ROLE();
  const tx = await cert.grantRole(MINTER_ROLE, MINTER_ADDRESS);
  await tx.wait();

  console.log("✅ MINTER_ROLE granted successfully!");
  const hasMinterRole = await cert.hasRole(MINTER_ROLE, MINTER_ADDRESS);
  console.log("Role verification:", hasMinterRole);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
