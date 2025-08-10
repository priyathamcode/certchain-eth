import React, {useState} from 'react'
import axios from 'axios'
export default function Admin(){
  const [fileData, setFileData] = useState('{}')
  const [msg, setMsg] = useState('')
  const [to, setTo] = useState('')
  const [tokenId, setTokenId] = useState('1')

  const upload = async () => {
    const data = JSON.parse(fileData);
    const res = await axios.post('/api/upload', data);
    setMsg(JSON.stringify(res.data));
  }

  const issue = async () => {
    const res = await axios.post('/api/issue', { to, tokenId, tokenURI: `ipfs://${tokenId}`});
    setMsg(JSON.stringify(res.data));
  }

  return (<div style={{padding:20}}>
    <h2>Admin</h2>
    <textarea rows={10} cols={60} value={fileData} onChange={e=>setFileData(e.target.value)} />
    <div>
      <button onClick={upload}>Upload to IPFS</button>
    </div>
    <div style={{marginTop:12}}>
      <input placeholder='student address' value={to} onChange={e=>setTo(e.target.value)} />
      <input placeholder='token id' value={tokenId} onChange={e=>setTokenId(e.target.value)} />
      <button onClick={issue}>Issue NFT</button>
    </div>
    <pre>{msg}</pre>
  </div>)
}
