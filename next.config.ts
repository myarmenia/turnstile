


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
    ]
};

export default withNextIntl(nextConfig);