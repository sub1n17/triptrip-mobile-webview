import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { useRouter } from 'next/navigation';
import { LogInSchemaType } from './schema';
import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getAccessToken } from '@/src/commons/libraries/get-access-token';
import { useAccessTokenStore } from '@/src/commons/stores/token-store';

const LOG_IN = gql`
    mutation login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            accessToken
            refreshToken
        }
    }
`;

type FetchDeviceAuthResult = {
    data: {
        fetchDeviceAuthForRefreshTokenSet: {
            refreshToken: string;
        };
    };
};

export const useInitializeLogIn = () => {
    const { fetchApp } = useDeviceSetting();
    const router = useRouter();

    // 스플래시 화면 유무
    const [tokenChecking, setTokenChecking] = useState(true);
    const { setAccessToken } = useAccessTokenStore();

    // 1. 최초 접속 시 자동 로그인 검증
    // useEffect(() => {
    //     const checkToken = async () => {
    //         try {
    //             // =============== 앱일 때 자동 로그인하기 ===============
    //             const isApp = typeof window !== 'undefined' && window.ReactNativeWebView;
    //             if (isApp) {
    //                 // 리프레시토큰 조회
    //                 const result = (await fetchApp({
    //                     query: 'fetchDeviceAuthForRefreshTokenSet',
    //                 })) as FetchDeviceAuthResult;

    //                 const refreshToken =
    //                     result?.data?.fetchDeviceAuthForRefreshTokenSet?.refreshToken;

    //                 if (!refreshToken) {
    //                     setTokenChecking(false); // 리프레시토큰 없을 때 로그인화면 보여주기
    //                     return;
    //                 }

    //                 // 가져온 리프레시 토큰을 직접 넣어서 액세스 토큰 요청
    //                 const newAccessToken = await getAccessToken(refreshToken);
    //                 if (newAccessToken) {
    //                     setAccessToken(newAccessToken);
    //                     localStorage.setItem('accessToken', newAccessToken);
    //                     return router.replace('/solplace-logs');
    //                 }
    //             } else {
    //                 //   =============== 웹일 때 자동 로그인하기 ===============
    //                 const webAccessToken = localStorage.getItem('accessToken');
    //                 if (webAccessToken) {
    //                     setAccessToken(webAccessToken);
    //                     router.replace('/solplace-logs');
    //                     return;
    //                 }
    //                 setTokenChecking(false); // 토큰 없으면 로그인 화면
    //             }

    //             // 자동로그인 실패 - 로그인 했던 적 없거나 만료되었을 때
    //             setTokenChecking(false);
    //         } catch (error) {
    //             console.log(error);
    //             // 에러나면 로그인 화면
    //             setTokenChecking(false);
    //         }
    //     };
    //     checkToken();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // 2. 로그인 버튼 - 새로 로그인하는 경우
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

            // ================= 웹에 토큰 저장 ==============
            // zustand에 accessToken 저장
            if (accessToken) {
                setAccessToken(accessToken);
                localStorage.setItem('accessToken', accessToken);
                // ㄴ> 상세페이지에서 수정/삭제 버튼 작성자만 보이게 하기 위해 로컬스토리지에 저장 (fetchLoggedIn 쿼리 없어서 대체)
            }

            // ================= 앱에 토큰 저장 ==============
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
