/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["mui-tel-input"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dynopay.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
