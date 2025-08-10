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
    <div style={{ padding: 20 }}>
      <h2>Verify Certificate</h2>
      
      <div style={{ marginBottom: 20 }}>
        <input 
          placeholder="Token ID" 
          value={tokenId} 
          onChange={(e) => setTokenId(e.target.value)} 
        />
        <button 
          onClick={onVerify} 
          style={{ marginLeft: 8 }} 
          disabled={!tokenId || loading}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        
        {tokenId && (
          <button 
            onClick={generateSignedQR} 
            style={{ marginLeft: 8 }} 
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Signed QR'}
          </button>
        )}
      </div>

      {result && (
        <div style={{ marginBottom: 20, padding: 15, border: '1px solid #e5e7eb', borderRadius: 6 }}>
          <h3>Blockchain Verification</h3>
          {result.error ? (
            <div style={{ color: "red" }}>{result.error}</div>
          ) : (
            <>
              <div>Token ID: {result.tokenId}</div>
              <div style={{ color: result.valid ? "green" : "red" }}>
                Valid: {result.valid ? "YES" : "NO"}
              </div>
              <div style={{ marginTop: 8 }}>
                <QRCode value={`token:${result.tokenId}|valid:${result.valid}`} size={128} />
              </div>
            </>
          )}
        </div>
      )}

      {signedQR && (
        <div style={{ marginBottom: 20, padding: 15, border: '1px solid #e5e7eb', borderRadius: 6 }}>
          <h3>Signed QR Code</h3>
          <div style={{ marginBottom: 10 }}>
            <strong>Status:</strong> {signedQR.payload.valid ? '✅ Valid' : '❌ Invalid'}
          </div>
          <div style={{ marginBottom: 10 }}>
            <strong>Issuer:</strong> {signedQR.payload.issuer}
          </div>
          <div style={{ marginBottom: 10 }}>
            <strong>Timestamp:</strong> {new Date(signedQR.payload.timestamp * 1000).toLocaleString()}
          </div>
          
          <div style={{ marginTop: 10 }}>
            <img 
              src={signedQR.qrCode} 
              alt="Signed QR Code" 
              style={{ border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          
          <button 
            onClick={() => verifySignedQR(signedQR.qrData)}
            style={{ marginTop: 10 }}
          >
            Verify QR Signature
          </button>
          
          <details style={{ marginTop: 10 }}>
            <summary>QR Data (for testing)</summary>
            <pre style={{ fontSize: 12, overflow: 'auto' }}>
              {JSON.stringify(signedQR.qrData, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {qrVerification && (
        <div style={{ marginBottom: 20, padding: 15, border: '1px solid #e5e7eb', borderRadius: 6 }}>
          <h3>QR Signature Verification</h3>
          {qrVerification.error ? (
            <div style={{ color: "red" }}>{qrVerification.error}</div>
          ) : (
            <>
              <div style={{ color: qrVerification.signature.valid ? "green" : "red" }}>
                <strong>Signature Valid:</strong> {qrVerification.signature.valid ? "YES" : "NO"}
              </div>
              <div>
                <strong>Current Blockchain Status:</strong> {qrVerification.currentValid ? "Valid" : "Invalid"}
              </div>
              <div>
                <strong>Recovered Address:</strong> {qrVerification.signature.recoveredAddress}
              </div>
              <div>
                <strong>Expected Address:</strong> {qrVerification.signature.expectedAddress}
              </div>
              
              <details style={{ marginTop: 10 }}>
                <summary>Full Verification Details</summary>
                <pre style={{ fontSize: 12 }}>
                  {JSON.stringify(qrVerification, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}
