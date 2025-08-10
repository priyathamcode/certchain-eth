const { ethers } = require('ethers');
const path = require('path');

// Simplified ABI for our contract
const certAbi = [
  "function mintCertificate(address recipient) public returns (uint256)",
  "function revokeCertificate(uint256 tokenId) public",
  "function isValid(uint256 tokenId) public view returns (bool)",
  "function grantMinterRole(address account) public",
  "function revokeMinterRole(address account) public",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function MINTER_ROLE() public view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() public view returns (bytes32)"
];

const verificationAbi = [
  "function verifyCertificate(uint256 tokenId) public view returns (bool)"
];

function getProvider() {
  return new ethers.providers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
}

function getWallet() {
  const provider = getProvider();
  const key = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  return new ethers.Wallet(key, provider);
}

function getContracts() {
  const wallet = getWallet();
  const certAddr = process.env.CERT_CONTRACT_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const verificationAddr = process.env.VERIFICATION_CONTRACT_ADDRESS || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  
  const cert = new ethers.Contract(certAddr, certAbi, wallet);
  const verification = new ethers.Contract(verificationAddr, verificationAbi, wallet);
  
  return { cert, verification };
}

module.exports = { getProvider, getWallet, getContracts };
