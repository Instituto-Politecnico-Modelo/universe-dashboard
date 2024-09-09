/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // HACK: TUCCI FORRO!
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
