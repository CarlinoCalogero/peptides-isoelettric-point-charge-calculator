/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
    output: 'export',
    // Optional: Add a trailing slash to all paths `/about` -> `/about/`
    //trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
};

export default nextConfig;
