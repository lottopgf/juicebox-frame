/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => ([
    {
      source: '/',
      destination: 'https://juicebox.money',
      permanent: true
    }
  ])
}

export default nextConfig
