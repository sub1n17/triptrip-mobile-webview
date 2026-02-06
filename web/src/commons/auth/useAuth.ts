'use client';

import { useDeviceSetting } from '../settings/device-setting/hook';
import { useAccessTokenStore } from '../stores/token-store';
import { useApolloClient } from '@apollo/client';
import { FetchDeviceAuthResult } from '@/src/app/page';
import { getAccessToken } from '../libraries/get-access-token';
import { FetchSolplaceLogsDocument } from '../graphql/graphql';

export default function UseAuth() {
    const { fetchApp } = useDeviceSetting();
    const { setAccessToken } = useAccessTokenStore();
    const client = useApolloClient();

    const checkToken = async (): Promise<boolean> => {
        try {
            const isApp = typeof window !== 'undefined' && window.ReactNativeWebView;

            // 앱 : 리프레시 토큰으로 갱신 시도
            if (isApp) {
                const result = (await fetchApp({
                    query: 'fetchDeviceAuthForRefreshTokenSet',
                })) as FetchDeviceAuthResult;

                const refreshToken = result?.data?.fetchDeviceAuthForRefreshTokenSet?.refreshToken;

                if (!refreshToken) return false;

                const newAccessToken = await getAccessToken(refreshToken);
                if (!newAccessToken) return false;

                setAccessToken(newAccessToken);
                localStorage.setItem('accessToken', newAccessToken);

                await client.query({
                    query: FetchSolplaceLogsDocument,
                    variables: { page: 1 },
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'none',
                });

                return true;
            }

            // 웹 : 로컬스토리지 토큰 검증
            if (!isApp) {
                const webAccessToken = localStorage.getItem('accessToken');

                if (!webAccessToken) return false;
                setAccessToken(webAccessToken);

                // 이 토큰이 유효한지 임시 쿼리로 유효성 검증
                await client.query({
                    query: FetchSolplaceLogsDocument,
                    variables: { page: 1 },
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'none',
                });

                return true;
            }
        } catch (error) {
            console.log(error);
            localStorage.removeItem('accessToken');
            setAccessToken('');
            return false;
        }
        return false;
    };

    return {
        checkToken,
    };
}
