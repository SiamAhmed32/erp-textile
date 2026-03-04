import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		domains: ['arewabooks.s3.us-east-2.amazonaws.com', 'res.cloudinary.com'],
	},
};

export default nextConfig;