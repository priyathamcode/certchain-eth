const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Contract address from deployment
  const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  
  // Address to grant minter role (change this to your MetaMask address)
  const MINTER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Second Hardhat account
  
  console.log("Granting MINTER_ROLE...");
  console.log("Admin:", deployer.address);
  console.log("New Minter:", MINTER_ADDRESS);
  
  const cert = await hre.ethers.getContractAt("CertificateNFT", CONTRACT_ADDRESS);
  
  // Grant minter role
  const tx = await cert.grantMinterRole(MINTER_ADDRESS);
  await tx.wait();
  
  console.log("✅ MINTER_ROLE granted successfully!");
  
  // Verify the role was granted
  const MINTER_ROLE = await cert.MINTER_ROLE();
  const hasMinterRole = await cert.hasRole(MINTER_ROLE, MINTER_ADDRESS);
  console.log("Role verification:", hasMinterRole);
  
  console.log("\n=== MINTER SETUP COMPLETE ===");
  console.log("The following addresses can now mint certificates:");
  console.log("- Admin/Deployer:", deployer.address);
  console.log("- New Minter:", MINTER_ADDRESS);
  console.log("\nImport these private keys to MetaMask:");
  console.log("Account #0:", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  console.log("Account #1:", "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 