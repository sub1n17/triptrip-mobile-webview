'use client';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { useRef } from 'react';
import { useApis } from '@/apis';

export default function Index() {
    const webviewRef = useRef<WebView>(null);
    const { onRequest } = useApis(webviewRef);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'bottom']}>
            <StatusBar style="light"></StatusBar>
            <WebView
                javaScriptEnabled
                domStorageEnabled
                geolocationEnabled
                originWhitelist={['*']}
                source={{ uri: 'http://192.168.55.42:3000/solplace-logs/new/map' }}
                ref={webviewRef}
                onMessage={(event) => {
                    if (!event.nativeEvent.data) return;
                    const request = JSON.parse(event.nativeEvent.data);

                    // 웹에게 API 응답 보내기
                    onRequest(request);
                }}
            ></WebView>
        </SafeAreaView>
    );
}
