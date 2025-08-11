import { create } from 'ipfs-http-client';

export function createClient() {
  const url = process.env.IPFS_URL || 'http://localhost:5001';
  return create({ url });
}
