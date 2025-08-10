import { ethers } from "ethers";
import CertificateABI from "./abis/CertificateABI.json";

// Reads REACT_APP_CONTRACT_ADDRESS from env or fallback
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || process.env.REACT_APP_CONTRACT_ADDRESS || "<PUT_CONTRACT_ADDRESS_HERE>";

export function getProvider() {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  // fallback to localhost
  return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
}

export async function getSigner() {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export function getContractWithSigner(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, CertificateABI, signer);
}

export function getContractReadOnly() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CertificateABI, provider);
} 