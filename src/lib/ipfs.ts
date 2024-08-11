import bs58 from "bs58";

export function ipfsURL(cid?: string) {
  if (!cid) {
    return undefined;
  }

  return `https://jbm.infura-ipfs.io/ipfs/${cid}`;
}

export function cidFromURL(url?: string) {
  if (!url || url === "") return undefined;
  return url.split("/").pop();
}

export function decodeEncodedIPFSUri(hex: string) {
  // Add default ipfs values for first 2 bytes:
  // - function:0x12=sha2, size:0x20=256 bits
  // - also cut off leading "0x"
  const hashHex = "1220" + hex.slice(2);
  const hashBytes = Buffer.from(hashHex, "hex");
  return bs58.encode(hashBytes);
}
