# Certificate DApp with QR Signing

A complete blockchain-based certificate management system with:
- **Smart Contracts** (Solidity + Hardhat) 
- **React Frontend** (ethers.js + MetaMask)
- **Node.js Backend** (Express + QR signing)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (React)       │◄──►│   (Express)     │◄──►│   (Hardhat)     │
│                 │    │                 │    │                 │
│ • Mint UI       │    │ • QR Signing    │    │ • CertificateNFT│
│ • Verify UI     │    │ • IPFS Upload   │    │ • Verification  │
│ • MetaMask      │    │ • API Endpoints │    │ • AccessControl │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Start Local Blockchain
```bash
npx hardhat node
```

### 2. Deploy Contracts
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Grant Minter Roles
```bash
npx hardhat run scripts/grant-minter-role.js --network localhost
```

### 4. Start Backend (QR Signing)
```bash
cd backend && npm start
```

### 5. Start Frontend
```bash
cd frontend && npm run dev
```

### 6. Configure MetaMask
- **Network**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Import Account**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## 📋 Features

### ✅ **Smart Contracts**
- **CertificateNFT**: ERC721 with AccessControl
  - `MINTER_ROLE` for universities
  - `DEFAULT_ADMIN_ROLE` for admins
  - Certificate validation & revocation
  
- **Verification**: Simple validation interface

### ✅ **Frontend (React)**
- **Mint Page**: Universities can mint certificates
- **Verify Page**: Anyone can verify certificates
- **QR Generation**: Create signed QR codes
- **MetaMask Integration**: Wallet connection

### ✅ **Backend (Express)**
- **QR Signing**: Cryptographic signatures for QR codes
- **IPFS Upload**: Metadata storage
- **API Endpoints**: Contract interaction helpers

## 🔧 Detailed Setup

### Prerequisites
- Node.js v20+
- MetaMask browser extension
- Git

### Installation
```bash
# Clone repository
git clone <your-repo>
cd certchain-eth

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### Environment Setup
Create `frontend/.env`:
```
VITE_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

Create `backend/.env` (optional):
```
UNIVERSITY_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
CERT_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VERIFICATION_CONTRACT_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

## 📱 Usage

### Minting Certificates
1. Go to `http://localhost:5173/mint`
2. Connect MetaMask (use minter account)
3. Enter recipient address
4. Click "Mint Certificate"

### Verifying Certificates
1. Go to `http://localhost:5173/verify`
2. Enter token ID
3. Click "Verify" for blockchain check
4. Click "Generate Signed QR" for cryptographic QR
5. Click "Verify QR Signature" to validate QR

### QR Code Features
- **Blockchain Verification**: Direct contract call
- **Signed QR**: Cryptographically signed by university
- **Offline Verification**: QR codes work without blockchain access
- **Tamper Proof**: Signatures prevent QR code forgery

## 🔐 Security

### Access Control
- **Admin Role**: Deploy account, can grant/revoke roles
- **Minter Role**: Universities, can mint certificates
- **Public**: Anyone can verify certificates

### QR Signing
- Uses ECDSA signatures with secp256k1
- University private key signs certificate data
- Signature verification prevents tampering
- Timestamps prevent replay attacks

## 🧪 Testing

### Test Accounts (Hardhat)
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Admin)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (Minter)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

### Test Flow
1. Import Account #1 to MetaMask
2. Mint certificate to any address
3. Verify certificate by token ID
4. Generate signed QR code
5. Verify QR signature

## 🛠️ Development

### Smart Contract Changes
```bash
# After modifying contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
# Update contract addresses in frontend/.env and backend/.env
```

### Adding New Minters
```bash
# Edit scripts/grant-minter-role.js with new address
npx hardhat run scripts/grant-minter-role.js --network localhost
```

### API Endpoints
- `GET /api/verify/:tokenId` - Blockchain verification
- `POST /api/qr/generate` - Generate signed QR
- `POST /api/qr/verify` - Verify QR signature
- `POST /api/upload` - IPFS metadata upload

## 🌐 Production Deployment

### Mainnet/Testnet
1. Update `hardhat.config.js` with network settings
2. Set production RPC URLs and private keys
3. Deploy contracts: `npx hardhat run scripts/deploy.js --network <network>`
4. Update frontend/backend with production addresses
5. Configure IPFS pinning service
6. Use production signing keys for QR codes

### Security Considerations
- 🔒 **Private Keys**: Never commit private keys to git
- 🔒 **Environment Variables**: Use proper env management
- 🔒 **HTTPS**: Use SSL for production frontend/backend
- 🔒 **Rate Limiting**: Add API rate limits
- 🔒 **Input Validation**: Validate all user inputs

## 📚 Technology Stack

- **Blockchain**: Ethereum, Solidity ^0.8.20
- **Development**: Hardhat, ethers.js v5
- **Frontend**: React 18, Vite, React Router
- **Backend**: Express, Node.js
- **Storage**: IPFS (metadata)
- **Crypto**: ECDSA signatures, keccak256 hashing
- **UI**: CSS3, QR code generation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

**Need Help?** Check the troubleshooting section in individual component READMEs or open an issue.
