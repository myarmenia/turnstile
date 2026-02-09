import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Укажите правильный путь к i18n файлу
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
    output: 'standalone',

    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    images: {
        domains: ['turnstile-admin.turniket.am'],
        // unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8088',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'host.docker.internal',
                port: '8088',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'turnstile_nginx',
                pathname: '/storage/**',
            },
            
            // PROD
            {
                protocol: 'https',
                hostname: 'turnstile-admin.turniket.am',
                pathname: '/storage/**',
            },

            
        ],

        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
    },
};

export default withNextIntl(nextConfig);