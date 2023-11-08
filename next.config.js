/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/upload/:slug',
        destination: 'http://localhost:9090/:slug', // Matched parameters can be used in the destination
      },
    ]
  },
}

module.exports = nextConfig
