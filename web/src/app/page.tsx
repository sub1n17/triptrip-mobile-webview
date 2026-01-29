'use client';

import { useRouter } from 'next/navigation';
import Splash from '../components/domains/splash';
import { useEffect } from 'react';
import { useDeviceSetting } from '../commons/settings/device-setting/hook';
import { getAccessToken } from '../commons/libraries/get-access-token';
import { useAccessTokenStore } from '../commons/stores/token-store';

type FetchDeviceAuthResult = {
    data: {
        fetchDeviceAuthForRefreshTokenSet: {
            refreshToken: string;
        };
    };
};

export default function Home() {
    const { fetchApp } = useDeviceSetting();
    const router = useRouter();

    const { setAccessToken } = useAccessTokenStore();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const isApp = typeof window !== 'undefined' && window.ReactNativeWebView;

                // Splash 최소 3초 유지
                await new Promise((res) => setTimeout(res, 3000));

                // 앱
                if (isApp) {
                    const result = (await fetchApp({
                        query: 'fetchDeviceAuthForRefreshTokenSet',
                    })) as FetchDeviceAuthResult;

                    const refreshToken =
                        result?.data?.fetchDeviceAuthForRefreshTokenSet?.refreshToken;

                    if (!refreshToken) return;

                    if (refreshToken) {
                        const newAccessToken = await getAccessToken(refreshToken);
                        if (newAccessToken) {
                            setAccessToken(newAccessToken);
                            localStorage.setItem('accessToken', newAccessToken);
                            return router.replace('/solplace-logs');
                        }
                    }
                }

                // 웹
                const webAccessToken = localStorage.getItem('accessToken');
                if (webAccessToken) {
                    setAccessToken(webAccessToken);
                    router.replace('/solplace-logs');
                    return;
                }

                // 앱, 웹 둘 다 실패했을 떄
                router.replace('/login');
            } catch (error) {
                console.log(error);
            }
        };

        checkToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Splash></Splash>;
}
