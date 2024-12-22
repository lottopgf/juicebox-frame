/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "jbm.infura-ipfs.io" }],
  },
  webpack(config) {
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
};

export default nextConfig;
