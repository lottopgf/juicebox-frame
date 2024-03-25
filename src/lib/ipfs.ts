export function ipfsURL(cid?: string) {
  if (!cid) return;

  return `https://cloudflare-ipfs.com/ipfs/${cid}`;
}

export function cidFromURL(url: string) {
  return url.split("/").pop();
}
