/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/signin",
        permanent: true,
      },
    ];
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    ENDPOINT: process.env.ENDPOINT,
    TOKEN: process.env.TOKEN,
    SECRET: process.env.JWT_SECRET,
  },
};

module.exports = nextConfig;
