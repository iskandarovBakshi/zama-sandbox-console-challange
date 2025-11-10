import { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    poweredByHeader: false,
    experimental: {
        scrollRestoration: true,
        optimizePackageImports: ["recharts", "@mui/material", "@mui/icons-material"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                pathname: "/7.x/avataaars/svg",
            },
        ],
    },
};

export default nextConfig;
