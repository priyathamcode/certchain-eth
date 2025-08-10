const { create } = require('ipfs-http-client');

function createClient() {
  // default to local IPFS daemon
  const url = process.env.IPFS_URL || 'http://localhost:5001';
  return create({ url });
}

module.exports = { createClient };
