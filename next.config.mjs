/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    // Enable modern image formats for better compression
    formats: ["image/avif", "image/webp"],

    // Configure remote image domains for Next.js Image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.uploadthing.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: "/**",
      },
    ],

    // Optimize image quality (default is 75, lower = smaller files)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-slot",
    ],
  },
};

export default nextConfig;
