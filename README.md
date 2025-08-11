# CertChain (Certificates DApp)

A complete blockchain-based certificate management system with:
- Smart Contracts (Solidity + Hardhat)
- React Frontend (Vite + ethers + MetaMask)
- Node.js Backend (Express, ESM) for QR signing and IPFS upload

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (React/Vite)  │◄──►│   (Express ESM) │◄──►│   (Hardhat)     │
│                 │    │                 │    │                 │
│ • Mint/Verify   │    │ • QR Signing    │    │ • CertificateNFT│
│ • Admin (IPFS)  │    │ • IPFS Upload   │    │ • Verification  │
│ • MetaMask      │    │ • API Endpoints │    │ • AccessControl │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ What’s new (recent updates)
- Backend converted to ESM (type: module); consistent modern imports/exports
- New POST /api/issue endpoint for server-side minting using minter wallet
- Frontend UI/UX refresh: dark theme, cards, buttons, alerts, responsive layout
- Routing hardened with default route and Admin page link
- ABI and Solidity aligned for `mintCertificate(address)` with no return value
- Tests updated to match current contracts and pass on localhost
- Environment setup clarified; `.env` files for frontend and backend

## 🔧 Prerequisites
- Node.js 20.x (recommend 20.17+)
- MetaMask browser extension
- Git
- Optional: IPFS daemon (or a remote IPFS API provider)

## 📦 Install
```powershell
# from repo root
npm install
cd frontend; npm install; cd ..
cd backend; npm install; cd ..
```

## 🚀 Local development
1) Start local blockchain
```powershell
npx hardhat node
```

2) Deploy contracts to localhost
```powershell
npx hardhat run scripts/deploy.js --network localhost
```
Copy the CertificateNFT address that is printed. Example:
```
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

3) Create environment files
- `frontend/.env`
```
VITE_CONTRACT_ADDRESS=<CertificateNFT address from deploy>
```
- `backend/.env`
```
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=<Hardhat Account #0 private key>
CERT_CONTRACT_ADDRESS=<CertificateNFT address>
# Optional extras
UNIVERSITY_PRIVATE_KEY=<Hardhat Account #1 private key>
IPFS_URL=http://localhost:5001
```

4) Start backend (Express, ESM)
```powershell
cd backend
npm start
# Backend listening on http://localhost:4000
```

5) Start frontend (Vite)
```powershell
cd frontend
npm run dev
# Open the printed http://localhost:5173 (or next available port)
```

6) Configure MetaMask (localhost)
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Import test accounts from Hardhat (Account #1 recommended as minter if you grant the role)

## 🧭 App pages
- `/` or `/mint`: Mint Certificate (minter/admin only)
- `/verify`: Verify by token id; generate/verify signed QR
- `/admin`: Upload metadata to IPFS; mint via backend endpoint

## 🔑 Roles
- CertificateNFT has `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE`
- To grant a minter after deploy:
```powershell
npx hardhat run scripts/grant-minter-role.js --network localhost --contract=<CertificateNFT address>
```

## 🔌 Backend API (localhost)
- `POST /api/issue` { to } → mint certificate via backend wallet
- `GET /api/verify/:tokenId` → on-chain validity
- `POST /api/qr/generate` { tokenId, metadata } → signed QR
- `POST /api/qr/verify` { qrData } → verify signature + current on-chain state
- `POST /api/upload` { json } → IPFS add

## 🧪 Testing
```powershell
npx hardhat test
```
- Tests updated for current `CertificateNFT` methods (`mintCertificate`, `revokeCertificate`, `MINTER_ROLE`).

## 🧱 Contracts & ABI
- Solidity 0.8.20; OpenZeppelin 4.9
- `CertificateNFT.sol` exports functions used by the frontend ABI at `frontend/src/abis/CertificateABI.json`:
```
[
  "function mintCertificate(address recipient) public",
  "function revokeCertificate(uint256 tokenId) public",
  "function isValid(uint256 tokenId) public view returns (bool)",
  "function grantMinterRole(address account) public",
  "function revokeMinterRole(address account) public",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function MINTER_ROLE() public view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() public view returns (bytes32)"
]
```

## ⚙️ Configuration & tooling
- Frontend (Vite): `vite.config.js` proxies `/api` → `http://localhost:4000`
- Backend (ESM): `type: module` with modern imports
- Ethers v5 across contracts, frontend, backend

## 🧯 Troubleshooting
- White/blank screen:
  - Ensure `frontend/.env` has a correct `VITE_CONTRACT_ADDRESS` from the latest deploy
  - Check browser dev console for missing env/contract errors
  - Hard-refresh to reload styles and env
- Port in use (Windows):
  - Find and kill process using the port
    ```powershell
    netstat -ano | findstr :4000
    Stop-Process -Id <PID> -Force
    ```
- PowerShell command separators:
  - Use `;` instead of `&&` for chaining commands
- IPFS upload:
  - Run a local IPFS daemon or set `IPFS_URL` to a remote provider

## 🔐 Security
- Never commit private keys or production secrets
- Use proper env management for non-local deployments
- Use HTTPS and add backend rate limiting for production

<<<<<<< HEAD
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

NPR License - see LICENSE file for details.
=======
## 🌐 Deploying to testnet/mainnet
1. Add network settings to `hardhat.config.js`
2. Set `ALCHEMY_API_URL` and `PRIVATE_KEY` in environment
3. Deploy: `npx hardhat run scripts/deploy.js --network <network>`
4. Update `frontend/.env` and `backend/.env` with deployed addresses
>>>>>>> d355214 (Your descriptive commit message here)


<<<<<<< HEAD
=======
Made with Hardhat, React, and Express ESM. UI designed for clarity and speed. 🚀
>>>>>>> d355214 (Your descriptive commit message here)
