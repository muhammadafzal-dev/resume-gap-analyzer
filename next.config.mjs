/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for pdfjs-dist to work in browser without canvas dependency
    config.resolve.alias.canvas = false
    return config
  },
}

export default nextConfig
