'use client';

import { useDeviceSetting } from '../settings/device-setting/hook';
import { useAccessTokenStore } from '../stores/token-store';
import { getAccessToken } from '../libraries/get-access-token';
import { FetchDeviceAuthResult } from '@/app/page';

export default function UseAuth() {
    const { fetchApp } = useDeviceSetting();
    const { setAccessToken } = useAccessTokenStore();

    const checkToken = async (): Promise<boolean> => {
        try {
            const isApp = typeof window !== 'undefined' && window.ReactNativeWebView;

            // 이미 accessToken 있으면 바로 통과
            const storedAccessToken = localStorage.getItem('accessToken');
            if (storedAccessToken) {
                setAccessToken(storedAccessToken);
                return true;
            }

            // 앱 : 리프레시 토큰으로 재발급 시도
            if (isApp) {
                const result = (await fetchApp({
                    query: 'fetchDeviceAuthForRefreshTokenSet',
                })) as FetchDeviceAuthResult;

                // RN에서 아직 못 가져온 경우 → localStorage에서 가져오기
                const refreshToken =
                    result?.data?.fetchDeviceAuthForRefreshTokenSet?.refreshToken ||
                    localStorage.getItem('refreshToken') ||
                    '';

                if (!refreshToken) return false;

                const newAccessToken = await getAccessToken(refreshToken);
                if (!newAccessToken) return false;

                setAccessToken(newAccessToken);
                localStorage.setItem('accessToken', newAccessToken);

                return true;
            }

            // 웹 : 로컬스토리지 토큰 검증
            if (!isApp) {
                const webAccessToken = localStorage.getItem('accessToken');
                if (!webAccessToken) return false;

                setAccessToken(webAccessToken);
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
