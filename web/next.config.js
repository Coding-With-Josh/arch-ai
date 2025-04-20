const { paraglide } = require('@inlang/paraglide-next/plugin');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.basehub.com',
      },
      {
        protocol: 'https',
        hostname: 'resend.com',
      },
    ],
  },
  eslint: {
    "ignoreDuringBuilds": true
  },
  typescript: {
    "ignoreBuildErrors": true
  },
};

module.exports = paraglide({
  paraglide: {
    project: './project.inlang',
    outdir: './src/paraglide',
  },
  ...nextConfig,
});
