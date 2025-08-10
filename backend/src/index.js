require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('./services/ipfs');
const { getContracts } = require('./services/contract');
const { generateSignedQR, verifySignature } = require('./services/signing');

const app = express();
app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const ipfs = createClient();

app.post('/api/upload', async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    const { cid } = await ipfs.add(data);
    return res.json({ ok: true, cid: cid.toString(), uri: `ipfs://${cid.toString()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Simplified verify endpoint for our current contract
app.get('/api/verify/:tokenId', async (req, res) => {
  try {
    const { cert } = getContracts();
    const tokenId = req.params.tokenId;
    const valid = await cert.isValid(tokenId);
    
    res.json({ 
      ok: true, 
      tokenId: Number(tokenId),
      valid: Boolean(valid),
      timestamp: Math.floor(Date.now() / 1000)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate signed QR code
app.post('/api/qr/generate', async (req, res) => {
  try {
    const { tokenId, metadata = {} } = req.body;
    
    if (!tokenId) {
      return res.status(400).json({ error: 'tokenId is required' });
    }

    // Check validity from contract
    const { cert } = getContracts();
    const valid = await cert.isValid(tokenId);
    
    // Generate signed QR
    const qrResult = await generateSignedQR(tokenId, valid, {
      name: metadata.name || 'Certificate',
      institution: metadata.institution || 'University',
      ...metadata
    });
    
    res.json({
      ok: true,
      ...qrResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Verify signed QR data
app.post('/api/qr/verify', async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData || !qrData.s || !qrData.t) {
      return res.status(400).json({ error: 'Invalid QR data format' });
    }

    // Reconstruct payload
    const payload = {
      tokenId: qrData.t,
      valid: qrData.valid,
      timestamp: qrData.ts,
      issuer: qrData.iss
    };

    // Verify signature
    const verification = verifySignature(payload, qrData.s);
    
    // Also check current blockchain state
    const { cert } = getContracts();
    const currentValid = await cert.isValid(qrData.t);
    
    res.json({
      ok: true,
      signature: verification,
      qrValid: verification.valid,
      currentValid: Boolean(currentValid),
      payload,
      timestamp: Math.floor(Date.now() / 1000)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'cert-backend', timestamp: Date.now() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
