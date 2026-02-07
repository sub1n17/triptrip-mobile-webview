import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { useRouter } from 'next/navigation';
import { LogInSchemaType } from './schema';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { message } from 'antd';
import { useAccessTokenStore } from '@/src/commons/stores/token-store';

const LOG_IN = gql`
    mutation login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            accessToken
            refreshToken
        }
    }
`;

export const useInitializeLogIn = () => {
    const { fetchApp } = useDeviceSetting();
    const router = useRouter();

    // 스플래시 화면 유무
    const [tokenChecking] = useState(true);
    const { setAccessToken } = useAccessTokenStore();

    // 로그인 버튼
    const [log_in] = useMutation(LOG_IN);
    const onClickSubmit = async (data: LogInSchemaType) => {
        try {
            // 이메일/비밀번호로 로그인
            const loginResult = await log_in({
                variables: {
                    loginInput: {
                        email: data.email,
                        password: data.password,
                    },
                },
            });

            const accessToken = loginResult.data.login.accessToken;
            const refreshToken = loginResult.data.login.refreshToken;

            // ================= 웹 : 토큰 저장 ==============
            // zustand에 accessToken 저장
            if (accessToken) {
                setAccessToken(accessToken);
                localStorage.setItem('accessToken', accessToken);
                // ㄴ> 상세페이지에서 수정/삭제 버튼 작성자만 보이게 하기 위해 로컬스토리지에 저장 (fetchLoggedIn 쿼리 없어서 대체)
            }

            // ================= 앱 : 토큰 저장 ==============
            if (window.ReactNativeWebView) {
                // RN에 accessToken 저장 API 요청하기
                await fetchApp({
                    query: 'updateDeviceAuthForAccessTokenSet',
                    variables: { accessToken: accessToken },
                });

                // RN에 refreshToken 저장 API 요청하기
                await fetchApp({
                    query: 'updateDeviceAuthForRefreshTokenSet',
                    variables: { refreshToken: refreshToken },
                });
            }

            // 솔플레이스로그 페이지로 이동
            router.replace('/solplace-logs');

            return true;
        } catch (error) {
            message.error((error as Error).message);
            return false;
        }
    };

    return {
        onClickSubmit,
        tokenChecking,
    };
};
