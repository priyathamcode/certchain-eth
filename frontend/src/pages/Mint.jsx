import React, { useState } from "react";
import { getSigner, getContractWithSigner } from "../contract";

export default function Mint() {
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const onMint = async () => {
    try {
      setBusy(true);
      setStatus("Connecting to wallet...");
      const signer = await getSigner();
      const contract = getContractWithSigner(signer);
      setStatus("Sending mint transaction...");
      const tx = await contract.mintCertificate(recipient);
      setStatus("Waiting for network confirmation...");
      await tx.wait();
      setStatus(`✅ Certificate minted. Tx: ${tx.hash}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ " + (err.message || err));
    } finally {
      setBusy(false);
    }
  };

  const isAddr = /^0x[a-fA-F0-9]{40}$/.test(recipient);

  return (
    <div className="section">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Mint Certificate</div>
            <div className="card-subtitle">Owner/minter only. Mints an ERC721 to recipient.</div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-row">
              <label>Recipient address</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value.trim())}
                placeholder="0x..."
              />
              {!recipient ? (
                <span className="small muted">Paste a wallet address on chain 31337</span>
              ) : !isAddr ? (
                <div className="alert alert-error small">Invalid address format</div>
              ) : (
                <div className="alert alert-info small">Looks good</div>
              )}
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-secondary" onClick={() => setRecipient("")}>Clear</button>
          <button className="btn btn-primary" onClick={onMint} disabled={!isAddr || busy}>Mint Certificate</button>
        </div>
      </div>
      {status && (
        <div className="section">
          <div className={`alert ${status.startsWith("✅") ? 'alert-success' : status.startsWith("❌") ? 'alert-error' : 'alert-info'}`}>{status}</div>
        </div>
      )}
    </div>
  );
} 