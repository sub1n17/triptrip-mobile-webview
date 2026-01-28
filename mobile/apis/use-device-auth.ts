import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { onResponse } from './types';

interface UpdateDeviceAuthVariables {
    accessToken?: string;
    refreshToken?: string;
}

export const useDeviceAuth = (onResponse: onResponse) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // accessToken 저장하기
    const updateDeviceAuthForAccessTokenSet = async (variables: UpdateDeviceAuthVariables) => {
        if (!variables.accessToken) return;
        setAccessToken(variables.accessToken);
        onResponse({
            updateDeviceAuthForAccessTokenSet: {
                message: 'accessToken 저장 완료',
            },
        });
    };

    // refreshToken 저장하기
    const updateDeviceAuthForRefreshTokenSet = async (variables: UpdateDeviceAuthVariables) => {
        if (!variables.refreshToken) return;
        await SecureStore.setItemAsync('refreshToken', variables.refreshToken);
        onResponse({
            updateDeviceAuthForRefreshTokenSet: {
                message: 'refreshToken 저장 완료',
            },
        });
    };

    // accessToken 삭제하기
    const deleteDeviceAuthForAccessTokenSet = () => {
        setAccessToken(null);
        onResponse({
            deleteDeviceAuthForAccessTokenSet: {
                message: '삭제 완료',
            },
        });
    };

    // refreshToken 삭제하기
    const deleteDeviceAuthForRefreshTokenSet = async () => {
        await SecureStore.deleteItemAsync('refreshToken');
        onResponse({
            deleteDeviceAuthForRefreshTokenSet: {
                message: '삭제 완료',
            },
        });
    };

    // accessToken 조회하기
    const fetchDeviceAuthForAccessTokenSet = () => {
        onResponse({
            fetchDeviceAuthForAccessTokenSet: {
                accessToken: accessToken,
            },
        });
    };

    // refreshToken 조회하기
    const fetchDeviceAuthForRefreshTokenSet = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        onResponse({
            fetchDeviceAuthForRefreshTokenSet: {
                refreshToken: refreshToken,
            },
        });
    };

    return {
        updateDeviceAuthForAccessTokenSet,
        updateDeviceAuthForRefreshTokenSet,
        deleteDeviceAuthForAccessTokenSet,
        deleteDeviceAuthForRefreshTokenSet,
        fetchDeviceAuthForRefreshTokenSet,
        fetchDeviceAuthForAccessTokenSet,
    };
};
