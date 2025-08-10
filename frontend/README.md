# Certificate DApp Frontend

A React frontend for minting and verifying certificate NFTs using ethers.js and MetaMask.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set the contract address by creating a `.env` file:
```
VITE_CONTRACT_ADDRESS=0xYourCertificateNFTAddressHere
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Prerequisites
- MetaMask extension installed
- Local Hardhat network running (`npx hardhat node`)
- Contract deployed to local network
- MetaMask configured for local network:
  - Network: `http://127.0.0.1:8545`
  - Chain ID: `31337`

### Minting Certificates
- Navigate to `/mint`
- Connect MetaMask (must be contract owner)
- Enter recipient address
- Click "Mint Certificate"

### Verifying Certificates
- Navigate to `/verify`
- Enter token ID
- Click "Verify"
- View result with QR code

## Features

- 🔗 **MetaMask Integration**: Connect wallet and sign transactions
- 🎫 **Certificate Minting**: Owner can mint certificates to any address
- ✅ **Certificate Verification**: Anyone can verify certificate validity
- 📱 **QR Code Generation**: Generate QR codes for verification results
- 🎨 **Clean UI**: Simple, modern interface

## Contract Functions Used

- `mintCertificate(address recipient)` - Mint new certificate
- `isValid(uint256 tokenId)` - Check if certificate is valid
- `revokeCertificate(uint256 tokenId)` - Revoke certificate (owner only) 