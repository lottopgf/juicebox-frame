export function ipfsURL(cid?: string) {
  if (!cid) {
    return undefined;
  }

  return `https://cloudflare-ipfs.com/ipfs/${cid}`;
}

export function cidFromURL(url?: string) {
  if (!url || url === "") return undefined;
  return url.split("/").pop();
}
