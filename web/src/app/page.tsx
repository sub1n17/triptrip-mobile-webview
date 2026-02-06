'use client';

import { useRouter } from 'next/navigation';
import Splash from '../components/domains/splash';
import { useEffect } from 'react';
import { useDeviceSetting } from '../commons/settings/device-setting/hook';
import { getAccessToken } from '../commons/libraries/get-access-token';
import { useAccessTokenStore } from '../commons/stores/token-store';
import { useApolloClient } from '@apollo/client';
import { FetchSolplaceLogsDocument } from '../commons/graphql/graphql';

export type FetchDeviceAuthResult = {
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

    // 클라이언트 가져오기
    const client = useApolloClient();
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

                    const newAccessToken = await getAccessToken(refreshToken);
                    if (newAccessToken) {
                        setAccessToken(newAccessToken);
                        localStorage.setItem('accessToken', newAccessToken);
                        return router.replace('/solplace-logs');
                    }
                }

                // 웹
                const webAccessToken = localStorage.getItem('accessToken');
                if (webAccessToken) {
                    setAccessToken(webAccessToken);

                    // 이 토큰이 진짜인지 아주 가벼운 쿼리를 하나 날려서 서버 응답을 확인
                    try {
                        await client.query({
                            query: FetchSolplaceLogsDocument,
                            variables: { page: 1 },
                            fetchPolicy: 'no-cache',
                        });
                        // 서버 응답이 성공하면 토큰이 유효 → 메인으로 이동
                        return router.replace('/solplace-logs');
                    } catch {
                        localStorage.removeItem('accessToken');
                        setAccessToken('');
                        return router.replace('/login');
                    }
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
