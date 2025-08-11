import React, {useState} from 'react'
import axios from 'axios'
export default function Admin(){
  const [fileData, setFileData] = useState('{}')
  const [msg, setMsg] = useState('')
  const [to, setTo] = useState('')

  const upload = async () => {
    try{
      const data = JSON.parse(fileData);
      const res = await axios.post('/api/upload', data);
      setMsg(JSON.stringify(res.data, null, 2));
    } catch (e){
      setMsg('Upload error: ' + (e.message || e));
    }
  }

  const issue = async () => {
    try{
      const res = await axios.post('/api/issue', { to });
      setMsg(JSON.stringify(res.data, null, 2));
    } catch (e){
      setMsg('Issue error: ' + (e.message || e));
    }
  }

  return (
    <div className="section grid-2">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Upload Certificate Metadata</div>
            <div className="card-subtitle">Stores JSON on IPFS and returns ipfs:// URI</div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-row">
              <label>Metadata JSON</label>
              <textarea rows={12} value={fileData} onChange={e=>setFileData(e.target.value)} />
              <span className="small muted">Example: {`{"name":"Cert","fields":{"degree":"BSc"}}`}</span>
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={upload}>Upload to IPFS</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Issue NFT (mint)</div>
            <div className="card-subtitle">Mint to recipient using minter wallet</div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-row">
              <label>Recipient address</label>
              <input placeholder='0x...' value={to} onChange={e=>setTo(e.target.value.trim())} />
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={issue} disabled={!to}>Issue</button>
        </div>
      </div>

      {msg && (
        <div className="section">
          <div className="card">
            <div className="card-header"><div className="card-title">Response</div></div>
            <div className="card-body"><pre style={{fontSize:12}}>{msg}</pre></div>
          </div>
        </div>
      )}
    </div>
  )
}
