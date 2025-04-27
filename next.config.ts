import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
   // Redirects are now handled by firebase.json rewrites
   // async redirects() {
   //   return [
   //     {
   //       source: '/categories',
   //       destination: '/categories.html', // Or your main categories overview page
   //       permanent: true,
   //     },
   //   ]
   // },
};

export default nextConfig;
