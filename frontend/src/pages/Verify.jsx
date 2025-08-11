import React, { useState } from "react";
import { getContractReadOnly } from "../contract";
import QRCode from "qrcode.react";
import axios from "axios";

export default function Verify() {
  const [tokenId, setTokenId] = useState("");
  const [result, setResult] = useState(null);
  const [signedQR, setSignedQR] = useState(null);
  const [qrVerification, setQrVerification] = useState(null);
  const [loading, setLoading] = useState(false);

  const validId = tokenId !== "" && /^\d+$/.test(tokenId);

  const onVerify = async () => {
    try {
      setLoading(true);
      const contract = getContractReadOnly();
      const valid = await contract.isValid(Number(tokenId));
      setResult({ tokenId, valid: Boolean(valid) });
    } catch (err) {
      setResult({ error: err.message || err.toString() });
    } finally {
      setLoading(false);
    }
  };

  const generateSignedQR = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/qr/generate', {
        tokenId: Number(tokenId),
        metadata: {
          name: 'Certificate',
          institution: 'University',
          generatedAt: new Date().toISOString()
        }
      });
      if (response.data.ok) {
        setSignedQR(response.data);
      } else {
        throw new Error(response.data.error || 'Failed to generate signed QR');
      }
    } catch (err) {
      console.error('QR Generation Error:', err);
      setResult({ error: 'Failed to generate signed QR: ' + (err.message || err) });
    } finally {
      setLoading(false);
    }
  };

  const verifySignedQR = async (qrData) => {
    try {
      const response = await axios.post('/api/qr/verify', { qrData });
      if (response.data.ok) {
        setQrVerification(response.data);
      } else {
        throw new Error(response.data.error || 'Failed to verify QR');
      }
    } catch (err) {
      console.error('QR Verification Error:', err);
      setQrVerification({ error: err.message || err });
    }
  };

  return (
    <div className="section grid-2">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Verify Certificate</div>
            <div className="card-subtitle">Check on-chain validity and generate a signed QR</div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-row">
              <label>Token ID</label>
              <input placeholder="e.g. 0" value={tokenId} onChange={(e) => setTokenId(e.target.value.trim())} />
              {!tokenId ? (
                <span className="small muted">Enter a token id</span>
              ) : !validId ? (
                <div className="alert alert-error small">Token id must be a number</div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={onVerify} disabled={!validId || loading}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
          <button className="btn btn-secondary" onClick={generateSignedQR} disabled={!validId || loading}>
            {loading ? 'Generating…' : 'Generate Signed QR'}
          </button>
        </div>
      </div>

      <div className="section">
        {result && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Blockchain Verification</div>
            </div>
            <div className="card-body">
              {result.error ? (
                <div className="alert alert-error">{result.error}</div>
              ) : (
                <>
                  <div className="small muted">Token ID</div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{result.tokenId}</div>
                  <div className={`alert ${result.valid ? 'alert-success' : 'alert-error'}`}>
                    {result.valid ? '✅ Valid' : '❌ Invalid'}
                  </div>
                  <div style={{ marginTop: 12 }} className="qr">
                    <QRCode value={`token:${result.tokenId}|valid:${result.valid}`} size={160} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {signedQR && (
          <div className="card section">
            <div className="card-header">
              <div className="card-title">Signed QR Code</div>
            </div>
            <div className="card-body">
              <div className={`alert ${signedQR.payload.valid ? 'alert-success' : 'alert-error'}`}>
                {signedQR.payload.valid ? '✅ Valid' : '❌ Invalid'}
              </div>
              <div className="spacer" />
              <div className="small muted">Issuer</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{signedQR.payload.issuer}</div>
              <div className="small muted">Timestamp</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{new Date(signedQR.payload.timestamp * 1000).toLocaleString()}</div>
              <div style={{ marginTop: 10 }} className="qr">
                <img src={signedQR.qrCode} alt="Signed QR Code" style={{ borderRadius: 6 }} />
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => verifySignedQR(signedQR.qrData)}>
                Verify QR Signature
              </button>
              <details style={{ marginTop: 12 }}>
                <summary>QR Data (debug)</summary>
                <pre style={{ fontSize: 12, overflow: 'auto' }}>{JSON.stringify(signedQR.qrData, null, 2)}</pre>
              </details>
            </div>
          </div>
        )}

        {qrVerification && (
          <div className="card section">
            <div className="card-header">
              <div className="card-title">QR Signature Verification</div>
            </div>
            <div className="card-body">
              {qrVerification.error ? (
                <div className="alert alert-error">{qrVerification.error}</div>
              ) : (
                <>
                  <div className={`alert ${qrVerification.signature.valid ? 'alert-success' : 'alert-error'}`}>
                    Signature {qrVerification.signature.valid ? 'valid' : 'invalid'}
                  </div>
                  <div className="spacer" />
                  <div className="small muted">Current blockchain status</div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{qrVerification.currentValid ? 'Valid' : 'Invalid'}</div>
                  <div className="small muted">Recovered address</div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{qrVerification.signature.recoveredAddress}</div>
                  <div className="small muted">Expected address</div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{qrVerification.signature.expectedAddress}</div>
                  <details style={{ marginTop: 10 }}>
                    <summary>Full details</summary>
                    <pre style={{ fontSize: 12 }}>{JSON.stringify(qrVerification, null, 2)}</pre>
                  </details>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
