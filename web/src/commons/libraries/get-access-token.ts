import { gql, GraphQLClient } from 'graphql-request';

const RESTORE_ACCESS_TOKEN = gql`
    mutation restoreAccessToken {
        restoreAccessToken {
            accessToken
        }
    }
`;

export const getAccessToken = async (appRefreshToken?: string) => {
    try {
        //  GraphQLClient 대신 GraphQL API를 fetch로 직접 호출한 것
        const response = await fetch('https://main-hybrid.codebootcamp.co.kr/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 앱 리프레시 토큰이 있으면 Authorization 헤더에 실어 보냄
                ...(appRefreshToken ? { Authorization: `Bearer ${appRefreshToken}` } : {}),
            },
            credentials: 'include',
            // GraphQL 쿼리를 body에 실어 보냄
            body: JSON.stringify({
                query: `
                    mutation restoreAccessToken {
                        restoreAccessToken {
                            accessToken
                        }
                    }
                `,
            }),
        });

        if (!response.ok) {
            throw new Error(`error : ${response.status}`);
        }

        const result = await response.json();

        // 데이터 구조 확인
        const newAccessToken = result?.data?.restoreAccessToken?.accessToken;

        return newAccessToken;
    } catch (error) {
        console.error('getAccessToken 에러:', error);
        return undefined;
    }
};
