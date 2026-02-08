export const dynamic = 'force-dynamic';
// ㄴ> 브라우저 기능을 SSR/프리렌더 단계에서 실행 못 하게 막기

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '../commons/layout';
import { DeviceSetting } from '../commons/settings/device-setting';
import Script from 'next/script';
import ApolloSetting from '../commons/settings/apollo-setting';
import Auth from '../commons/auth/auth';

const interSans = Inter({
    variable: '--font-inter-sans',
    subsets: ['latin'],
    preload: false,
});

const interMono = Inter({
    variable: '--font-inter-mono',
    subsets: ['latin'],
    preload: false,
});

export const metadata: Metadata = {
    title: 'trip trip',
    description: '여행을 더 특별하게, trip trip',
};

// 사진 핀치줌 메타태그
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${interSans.variable} ${interMono.variable} antialiased `}>
                <Script
                    src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
                    strategy="beforeInteractive"
                />

                <ApolloSetting>
                    {/* 모든 페이지에서 API 사용 가능하기 */}
                    <DeviceSetting>
                        <Auth>
                            <Layout>{children}</Layout>
                        </Auth>
                    </DeviceSetting>
                </ApolloSetting>
            </body>
        </html>
    );
}
