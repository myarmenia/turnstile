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
        domains: ['localhost'],
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
        ],
    },
};

export default withNextIntl(nextConfig);