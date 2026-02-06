'use client';

import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    fromPromise,
    // HttpLink,
    InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getAccessToken } from '../../libraries/get-access-token';
import { useAccessTokenStore } from '../../stores/token-store';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import { useEffect } from 'react';
import { message } from 'antd';

interface IApolloSetting {
    children: React.ReactNode;
}

export default function ApolloSetting(props: IApolloSetting) {
    const { setAccessToken } = useAccessTokenStore();

    // 상세페이지에서 수정/삭제 버튼 작성자만 보이게 하기 위해 로컬스토리지에 저장 (fetchLoggedIn 쿼리 없어서 대체)
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, []);

    const errorLink = onError(({ graphQLErrors, operation, forward }) => {
        // 에러 캐치하기
        if (graphQLErrors) {
            for (const error of graphQLErrors) {
                // 에러 중 토큰 만료 에러가 있는지 체크하기
                if (error.extensions?.code === 'UNAUTHENTICATED') {
                    if (!(typeof window !== 'undefined' && window.ReactNativeWebView)) {
                        // 웹 - refreshToken은 있지만 CORS 정책 때문에 웹에서는 전송 자체가 불가능한 상태라서 localStorage로 판단하기
                        localStorage.removeItem('accessToken');
                        message.error('로그인 해주세요.');
                        setTimeout(() => (location.href = '/login'), 500);
                        return;
                    }
                    // 앱
                    return fromPromise(
                        // graphql-request로 쿼리 요청 후 재발급 받은 accessToken 저장하기
                        getAccessToken().then((newAccessToken) => {
                            if (!newAccessToken) return;
                            localStorage.setItem('accessToken', newAccessToken);
                            setAccessToken(newAccessToken);
                            return newAccessToken;
                        }),
                    ).flatMap(() => forward(operation)); // 실패한 쿼리를 다시 실행
                }
            }
        }
    });

    // 토큰 확인
    const authLink = setContext(async (_, { headers }) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : '',
                'apollo-require-preflight': 'true',
            },
        };
    });

    // 파일 업로드 링크
    const uploadLink = createUploadLink({
        uri: 'https://main-hybrid.codebootcamp.co.kr/graphql',
        credentials: 'omit',
    });

    const client = new ApolloClient({
        link: ApolloLink.from([errorLink, authLink, uploadLink]),
        cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}> {props.children} </ApolloProvider>;
}
