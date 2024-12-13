/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "jbm.infura-ipfs.io" }],
  },
};

export default nextConfig;
