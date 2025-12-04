'use client';

import { useEffect } from 'react';

export const requestAPI = {};

export const DeviceSetting = ({ children }) => {
    useEffect(() => {
        // 안드로이드
        document.addEventListener('message', (message: any) => {
            const response = JSON.parse(message.data);
            const query = Object.keys(response)[0];
            const resolver = requestAPI[query];
            resolver({ data: response });
            delete requestAPI[query];
        });

        // IOS
        window.addEventListener('message', (message: any) => {
            const response = JSON.parse(message.data);
            const query = Object.keys(response)[0];
            const resolver = requestAPI[query];
            resolver({ data: response });
            delete requestAPI[query];
        });
    }, []);
    return <>{children}</>;
};
