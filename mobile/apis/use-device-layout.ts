'use client';

import { useState } from 'react';
import { DeviceLayout, onResponse } from './types';

export const useDeviceLayout = (onResponse: onResponse) => {
    const [layout, setLayout] = useState<DeviceLayout>({
        notchBackgroundColor: 'white',
        statusBarStyle: 'dark',
        safeAreaViewEdge: [],
    });

    // 상세페이지 사진 풀스크린
    const setFullScreenLayout = () => {
        setLayout({
            notchBackgroundColor: 'black',
            statusBarStyle: 'dark',
            safeAreaViewEdge: [],
        });
        onResponse({
            setFullScreenLayout: {
                message: '풀스크린으로 변경 완료',
            },
        });
    };

    // 기본 상태로 변경
    const setDefaultLayout = () => {
        setLayout({
            notchBackgroundColor: 'white',
            statusBarStyle: 'dark',
            safeAreaViewEdge: ['top', 'bottom'],
        });
        onResponse({
            setFullScreenLayout: {
                message: '기본 상태로 변경 완료',
            },
        });
    };

    // 상세페이지 사진 풀스크린
    // const toggleDeviceLayoutForFullScreenSet = () => {
    //     setLayout((prev) => ({
    //         notchBackgroundColor: prev.notchBackgroundColor === 'white' ? 'black' : 'white',
    //         StatusBarStyle: prev.StatusBarStyle === 'light' ? 'dark' : 'light',
    //         SafeAreaViewEdge: prev.SafeAreaViewEdge.length === 0 ? ['top', 'bottom'] : [],
    //     }));
    //     onResponse({
    //         toggleDeviceLayoutForFullScreenSet: {
    //             message: '변경 완료',
    //         },
    //     });
    // };

    return {
        // toggleDeviceLayoutForFullScreenSet,
        setFullScreenLayout,
        setDefaultLayout,
        layout,
    };
};
