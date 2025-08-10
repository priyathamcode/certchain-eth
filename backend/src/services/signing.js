const { ethers } = require('ethers');
const QRCode = require('qrcode');

// University signing wallet (keep this private key secure!)
const UNIVERSITY_PRIVATE_KEY = process.env.UNIVERSITY_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const universitySigner = new ethers.Wallet(UNIVERSITY_PRIVATE_KEY);

/**
 * Creates a signed verification payload
 */
function createSignedVerification(tokenId, valid, metadata = {}) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    tokenId: Number(tokenId),
    valid: Boolean(valid),
    timestamp,
    issuer: universitySigner.address,
    ...metadata
  };

  // Create message hash
  const message = JSON.stringify(payload);
  const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
  
  // Sign the hash
  const signature = universitySigner.signMessage(ethers.utils.arrayify(messageHash));
  
  return {
    payload,
    signature,
    messageHash
  };
}

/**
 * Verifies a signed payload
 */
function verifySignature(payload, signature) {
  try {
    const message = JSON.stringify(payload);
    const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
    const recoveredAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(messageHash), signature);
    
    return {
      valid: recoveredAddress.toLowerCase() === universitySigner.address.toLowerCase(),
      recoveredAddress,
      expectedAddress: universitySigner.address
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Generates a QR code with signed verification data
 */
async function generateSignedQR(tokenId, valid, metadata = {}) {
  const signed = createSignedVerification(tokenId, valid, metadata);
  
  // Create QR data
  const qrData = {
    v: 1, // version
    t: signed.payload.tokenId,
    s: signed.signature,
    ts: signed.payload.timestamp,
    iss: signed.payload.issuer,
    valid: signed.payload.valid,
    ...metadata
  };
  
  // Generate QR code
  const qrString = JSON.stringify(qrData);
  const qrCodeDataURL = await QRCode.toDataURL(qrString, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  return {
    qrCode: qrCodeDataURL,
    qrData,
    signature: signed.signature,
    payload: signed.payload
  };
}

module.exports = {
  createSignedVerification,
  verifySignature,
  generateSignedQR,
  universitySigner
}; 