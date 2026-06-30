/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        qualities: [75, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'allez-moris-admin.local',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'phenomenal-growth-682e298e29.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'phenomenal-growth-682e298e29.media.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                // Allow placeholder images if you use them during development
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                // Allow images from localhost for local WordPress development
                protocol: 'http',
                hostname: 'localhost',
                port: '8080', // Adjust if your local WP runs on a different port
                pathname: '/wp-json/*',
            }
        ],
    },
    // If you are using SVG imports as components (like in Vite with SVGR)
    // you might need a webpack config here, but standard <img> tags work fine for SVGs.


};

export default nextConfig;
