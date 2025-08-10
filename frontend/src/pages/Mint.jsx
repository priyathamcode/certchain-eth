import React, { useState } from "react";
import { getSigner, getContractWithSigner } from "../contract";

export default function Mint() {
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("");

  const onMint = async () => {
    try {
      setStatus("Connecting to wallet...");
      const signer = await getSigner();
      const contract = getContractWithSigner(signer);
      setStatus("Sending mint transaction...");
      const tx = await contract.mintCertificate(recipient);
      setStatus("Waiting for network confirmation...");
      const receipt = await tx.wait();
      setStatus(`Certificate minted successfully! Transaction: ${tx.hash}`);
    } catch (err) {
      console.error(err);
      setStatus("Error: " + (err.message || err));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mint Certificate (Owner only)</h2>
      <div>
        <label>Recipient address</label><br />
        <input 
          value={recipient} 
          onChange={(e) => setRecipient(e.target.value)} 
          style={{ width: 400 }} 
          placeholder="0x..."
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={onMint} disabled={!recipient}>
          Mint Certificate
        </button>
      </div>
      <pre style={{ marginTop: 12 }}>{status}</pre>
    </div>
  );
} 