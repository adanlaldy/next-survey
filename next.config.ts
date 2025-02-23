import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: false, // Désactive les source maps côté client
};

export default nextConfig;
