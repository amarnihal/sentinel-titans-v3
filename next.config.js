/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/vehicles/cash-in-transit-cit/:slug',
        destination: '/vehicles/cash-in-transit/:slug',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/.git', '**/._*'],
    };
    return config;
  },
}
