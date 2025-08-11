import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from './services/ipfs.js';
import { getContracts } from './services/contract.js';
import { generateSignedQR, verifySignature } from './services/signing.js';

const app = express();
app.use(bodyParser.json());

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

app.get('/api/verify/:tokenId', async (req, res) => {
  try {
    const { cert } = getContracts();
    const tokenId = req.params.tokenId;
    const valid = await cert.isValid(tokenId);

    res.json({ ok: true, tokenId: Number(tokenId), valid: Boolean(valid), timestamp: Math.floor(Date.now() / 1000) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// New: Issue/mint certificate via backend using minter wallet
app.post('/api/issue', async (req, res) => {
  try {
    const { to } = req.body || {};
    if (!to) {
      return res.status(400).json({ error: 'Missing required field: to' });
    }
    const { cert } = getContracts();
    const tx = await cert.mintCertificate(to);
    const receipt = await tx.wait();
    return res.json({ ok: true, txHash: tx.hash, blockNumber: receipt.blockNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/qr/generate', async (req, res) => {
  try {
    const { tokenId, metadata = {} } = req.body;
    if (!tokenId) {
      return res.status(400).json({ error: 'tokenId is required' });
    }

    const { cert } = getContracts();
    const valid = await cert.isValid(tokenId);

    const qrResult = await generateSignedQR(tokenId, valid, {
      name: metadata.name || 'Certificate',
      institution: metadata.institution || 'University',
      ...metadata
    });

    res.json({ ok: true, ...qrResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/qr/verify', async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData || !qrData.s || !qrData.t) {
      return res.status(400).json({ error: 'Invalid QR data format' });
    }

    const payload = { tokenId: qrData.t, valid: qrData.valid, timestamp: qrData.ts, issuer: qrData.iss };

    const verification = verifySignature(payload, qrData.s);

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

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'cert-backend', timestamp: Date.now() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
