/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode catches subtle React bugs early
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        // Supabase storage buckets
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
