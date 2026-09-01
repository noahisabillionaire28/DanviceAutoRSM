import { ALLOWED_IMAGE_HOSTS } from './lib/image-hosts.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
    formats: ['image/webp'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
