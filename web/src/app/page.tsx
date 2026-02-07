'use client';

import { useRouter } from 'next/navigation';
import Splash from '../components/domains/splash';
import { useEffect } from 'react';
import UseAuth from '../commons/auth/useAuth';

export type FetchDeviceAuthResult = {
    data: {
        fetchDeviceAuthForRefreshTokenSet: {
            refreshToken: string;
        };
    };
};

export default function Home() {
    const router = useRouter();
    const { checkToken } = UseAuth();

    useEffect(() => {
        const verify = async () => {
            // Splash 최소 3초 유지
            await new Promise((res) => setTimeout(res, 3000));

            const isValid = await checkToken();
            if (!isValid) {
                router.replace('/login'); // 토큰 유효 X → 로그인페이지로 이동
                return;
            }
            router.replace('/solplace-logs');
        };
        verify();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Splash></Splash>;
}
