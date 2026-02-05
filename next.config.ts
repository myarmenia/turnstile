


import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
    redirects: async () => [
        {
            source: '/',
            destination: '/am', 
            permanent: true, 
        },
    ],
    images: {
        domains: ['localhost'], // <-- добавляем сюда домен бекенда
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',          // если кто-то будет dev в браузере
                port: '8088',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'host.docker.internal', // Docker dev
                port: '8088',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'turnstile_nginx',      // server-side fetch из контейнера
                pathname: '/storage/**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);