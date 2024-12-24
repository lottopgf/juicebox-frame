/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "jbm.infura-ipfs.io" }],
  },
  redirects() {
    return [
      {
        source: "/",
        destination: "https://juicebox.money",
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
  experimental: {
    // Required to make next dev tools happy :^)
    turbo: {},
  },
};

export default nextConfig;
