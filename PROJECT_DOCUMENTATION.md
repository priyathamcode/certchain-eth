# CertChain Project Documentation

## Project Overview

CertChain is a complete blockchain-based certificate management system that enables educational institutions to issue, verify, and manage digital certificates using Ethereum smart contracts. The system provides a secure, tamper-proof way to handle academic credentials with features like QR code generation, IPFS storage, and role-based access control.

### Key Features
- **Smart Contract-based Certificate Issuance**: NFTs representing certificates on Ethereum blockchain
- **Role-based Access Control**: Different permissions for admins, minters, and universities
- **QR Code Verification**: Signed QR codes for offline certificate verification
- **IPFS Integration**: Decentralized storage for certificate metadata
- **Modern Web Interface**: React-based frontend with dark theme and responsive design
- **Backend API**: Express.js server for server-side operations and signing

### Technology Stack
- **Blockchain**: Ethereum, Solidity ^0.8.20, Hardhat
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express.js (ESM), ethers.js v5
- **Storage**: IPFS for metadata storage
- **Cryptography**: ECDSA signatures, keccak256 hashing
- **Development**: Hardhat for smart contract development and testing

## Folder & File Structure

```
certchain-eth/
├── contracts/                 # Smart contracts (Solidity)
│   ├── CertificateNFT.sol    # Main certificate contract
│   ├── UniversityRegistry.sol # University management
│   └── Verification.sol      # Certificate verification helper
├── scripts/                   # Deployment and utility scripts
│   ├── deploy.js             # Contract deployment script
│   ├── grant-minter-role.js  # Role management script
│   └── check-network.js      # Network verification script
├── test/                      # Smart contract tests
│   └── certificates.test.js  # Certificate contract tests
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── pages/            # Application pages
│   │   ├── components/       # Reusable UI components
│   │   ├── abis/            # Contract ABIs
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   └── lib/             # Utility functions
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite configuration
├── backend/                   # Express.js backend server
│   ├── src/
│   │   ├── services/        # Backend services
│   │   │   ├── contract.js  # Blockchain interaction
│   │   │   ├── signing.js   # QR code signing
│   │   │   └── ipfs.js      # IPFS client
│   │   └── index.js         # Main server file
│   └── package.json         # Backend dependencies
├── artifacts/                # Compiled contract artifacts
├── cache/                    # Hardhat cache
├── node_modules/             # Root dependencies
├── package.json              # Root project configuration
├── hardhat.config.js         # Hardhat configuration
└── README.md                 # Project overview
```

## Detailed File Explanations

### Smart Contracts

#### `contracts/CertificateNFT.sol`
**Purpose**: Main contract for certificate management using ERC-721 standard.

**Key Functions**:
- `mintCertificate(address recipient)`: Creates a new certificate NFT for the specified address
- `revokeCertificate(uint256 tokenId)`: Invalidates a certificate (admin only)
- `isValid(uint256 tokenId)`: Checks if a certificate is currently valid
- `grantMinterRole(address account)`: Grants minting permissions to an address
- `revokeMinterRole(address account)`: Revokes minting permissions

**Important Features**:
- Inherits from OpenZeppelin's `ERC721` and `AccessControl`
- Uses role-based access control with `MINTER_ROLE` and `DEFAULT_ADMIN_ROLE`
- Maintains a mapping of valid certificates that can be revoked
- Auto-increments token IDs for unique certificate identification

#### `contracts/UniversityRegistry.sol`
**Purpose**: Manages university registration and metadata.

**Key Functions**:
- `registerUniversity(address univAddr, string metadataURI)`: Registers a new university
- `updateStatus(address univAddr, bool active)`: Activates/deactivates universities
- `getUniversity(address univAddr)`: Retrieves university information

**Important Features**:
- Stores university metadata URIs (typically IPFS links)
- Maintains active/inactive status for universities
- Emits events for university registration and status changes

#### `contracts/Verification.sol`
**Purpose**: Helper contract for certificate verification.

**Key Functions**:
- `verifyCertificate(uint256 tokenId)`: Verifies certificate validity through the main contract

**Important Features**:
- Acts as a verification interface to the main CertificateNFT contract
- Provides a clean separation of concerns for verification logic

### Deployment Scripts

#### `scripts/deploy.js`
**Purpose**: Deploys all smart contracts to the specified network.

**Key Operations**:
1. Deploys `CertificateNFT` contract
2. Deploys `Verification` contract with reference to CertificateNFT
3. Outputs contract addresses for frontend/backend configuration
4. Provides test account private keys for MetaMask setup

#### `scripts/grant-minter-role.js`
**Purpose**: Grants minting role to specified addresses after deployment.

**Usage**: Used to authorize additional addresses to mint certificates.

### Frontend Application

#### `frontend/src/App.tsx`
**Purpose**: Main application component with routing setup.

**Key Features**:
- React Router setup with lazy-loaded pages
- Theme provider for dark/light mode
- Error boundary for graceful error handling
- Suspense fallback for loading states

**Routes**:
- `/` - Dashboard (main landing page)
- `/mint` - Certificate minting interface
- `/verify` - Certificate verification interface
- `/admin` - Administrative functions

#### `frontend/src/pages/`
**Purpose**: Application pages for different user interactions.

**Key Pages**:
- `Dashboard.tsx` - Main landing page with overview
- `Mint.tsx` - Interface for minting new certificates
- `Verify.tsx` - Certificate verification and QR code handling
- `Admin.tsx` - Administrative functions and IPFS uploads

#### `frontend/src/abis/CertificateABI.json`
**Purpose**: Application Binary Interface for smart contract interaction.

**Contains**: Function signatures for all public contract methods used by the frontend.

### Backend Server

#### `backend/src/index.js`
**Purpose**: Main Express.js server with API endpoints.

**Key Endpoints**:
- `POST /api/issue` - Mint certificates via backend wallet
- `GET /api/verify/:tokenId` - Verify certificate on-chain validity
- `POST /api/qr/generate` - Generate signed QR codes
- `POST /api/qr/verify` - Verify QR code signatures
- `POST /api/upload` - Upload metadata to IPFS

#### `backend/src/services/contract.js`
**Purpose**: Blockchain interaction service.

**Key Functions**:
- `getProvider()`: Creates Ethereum provider connection
- `getWallet()`: Creates wallet instance for transactions
- `getContracts()`: Returns contract instances with wallet connection

#### `backend/src/services/signing.js`
**Purpose**: QR code generation and signature verification.

**Key Functions**:
- `generateSignedQR()`: Creates signed QR codes with certificate data
- `verifySignature()`: Verifies QR code signatures
- `createSignedVerification()`: Creates signed verification data

#### `backend/src/services/ipfs.js`
**Purpose**: IPFS client for decentralized storage.

**Key Functions**:
- `createClient()`: Creates IPFS HTTP client connection

## Dependencies & Libraries

### Root Dependencies (package.json)
- **Hardhat**: Ethereum development environment
- **OpenZeppelin**: Secure smart contract libraries
- **Ethers.js**: Ethereum library for JavaScript
- **Chai**: Testing framework
- **Dotenv**: Environment variable management

### Frontend Dependencies
- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **Ethers.js**: Blockchain interaction
- **React Router**: Client-side routing
- **Framer Motion**: Animation library
- **QR Code React**: QR code generation

### Backend Dependencies
- **Express.js**: Web framework
- **Ethers.js**: Blockchain interaction
- **IPFS HTTP Client**: IPFS integration
- **QRCode**: QR code generation
- **Body Parser**: Request body parsing
- **Dotenv**: Environment variable management

## Execution Flow

### 1. Development Setup
```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Configure environment files
# frontend/.env: VITE_CONTRACT_ADDRESS=<deployed_address>
# backend/.env: RPC_URL, PRIVATE_KEY, CERT_CONTRACT_ADDRESS

# Start backend server
cd backend && npm start

# Start frontend
cd frontend && npm run dev
```

### 2. Certificate Issuance Flow
1. **Admin/University** accesses the minting interface
2. **Frontend** connects to MetaMask for wallet authentication
3. **Smart Contract** verifies minter role permissions
4. **Certificate NFT** is minted to recipient address
5. **Metadata** can be uploaded to IPFS for additional information
6. **QR Code** is generated with signed verification data

### 3. Certificate Verification Flow
1. **User** scans QR code or enters token ID
2. **Backend** verifies signature and on-chain validity
3. **Smart Contract** confirms certificate status
4. **Result** is displayed to user with verification details

### 4. API Request Flow
1. **Frontend** makes API request to backend
2. **Backend** processes request and interacts with blockchain
3. **Smart Contract** executes function and returns result
4. **Backend** formats response and sends to frontend
5. **Frontend** displays result to user

## Configuration & Environment

### Frontend Configuration
- **Vite Config**: Proxy setup for API calls to backend
- **Environment Variables**: Contract addresses and network settings
- **PWA Setup**: Progressive Web App configuration
- **Build Optimization**: Code splitting and vendor chunking

### Backend Configuration
- **ESM Modules**: Modern JavaScript module system
- **Environment Variables**: RPC URLs, private keys, contract addresses
- **CORS Setup**: Cross-origin resource sharing configuration
- **Error Handling**: Comprehensive error handling and logging

### Smart Contract Configuration
- **Solidity Version**: 0.8.20 with optimization enabled
- **Network Support**: Localhost and Sepolia testnet
- **Access Control**: Role-based permissions system
- **Gas Optimization**: Compiler optimizations for cost efficiency

## Security Considerations

### Smart Contract Security
- **Access Control**: Role-based permissions prevent unauthorized access
- **Input Validation**: Proper validation of all function parameters
- **Reentrancy Protection**: OpenZeppelin contracts provide security
- **Upgradeability**: Consider upgradeable contracts for future improvements

### Frontend Security
- **MetaMask Integration**: Secure wallet connection
- **Input Sanitization**: Validate all user inputs
- **HTTPS**: Use SSL in production environments
- **Environment Variables**: Never expose private keys

### Backend Security
- **Private Key Management**: Secure storage of signing keys
- **Rate Limiting**: Implement API rate limiting for production
- **Input Validation**: Validate all API inputs
- **Error Handling**: Don't expose sensitive information in errors

## Possible Improvements

### Smart Contract Enhancements
1. **Batch Operations**: Add batch minting and revocation functions
2. **Events**: Add more detailed events for better tracking
3. **Upgradeability**: Implement upgradeable contracts using OpenZeppelin
4. **Gas Optimization**: Further optimize gas usage for cost efficiency

### Frontend Improvements
1. **Offline Support**: Implement service workers for offline functionality
2. **Mobile Optimization**: Enhance mobile user experience
3. **Accessibility**: Improve accessibility features
4. **Internationalization**: Add multi-language support

### Backend Enhancements
1. **Database Integration**: Add database for user management
2. **Authentication**: Implement JWT-based authentication
3. **Rate Limiting**: Add comprehensive rate limiting
4. **Monitoring**: Add application monitoring and logging

### General Improvements
1. **Testing**: Expand test coverage for all components
2. **Documentation**: Add API documentation using Swagger
3. **CI/CD**: Implement continuous integration and deployment
4. **Performance**: Optimize for high-traffic scenarios

## Conclusion

CertChain is a well-architected blockchain-based certificate management system that demonstrates modern web3 development practices. The project successfully combines smart contracts, frontend applications, and backend services to create a comprehensive solution for digital certificate management. The modular design, security considerations, and modern technology stack make it a solid foundation for production deployment with appropriate enhancements.

The system's role-based access control, QR code verification, and IPFS integration provide a complete solution for educational institutions looking to digitize their certificate issuance process while maintaining security and verifiability. 