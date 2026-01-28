import { StatusBarStyle } from 'expo-status-bar';
import { Edge } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

export type WebViewRef = React.RefObject<WebView | null>;

export interface ApiQueryWrap {
    // 디바이스 정보
    fetchDeviceSystemForAppSet: (variables?: any) => any;
    fetchDeviceSystemForPlatformSet: (variables?: any) => any;
    openDeviceSystemForSettingSet: (variables?: any) => any;
    fetchDeviceSystemForAppStateSet: (variables?: any) => any;
    // 위치 권한
    fetchDeviceLocationForLatLngSet: (variables?: any) => any;
    fetchDeviceLocationForPermissionSet: (variables?: any) => any;
    // 알림 권한
    requestDeviceNotificationsForPermissionSolplaceLogNewSet: (variables?: any) => any;
    createDeviceNotificationsForSolplaceLogNewSet: (variables?: any) => any;
    fetchDeviceNotificationForPermissionSet: (variables?: any) => any;
    // 앱 종료
    exitDeviceRoutingForBackSet: (variables?: any) => any;
    // 토큰
    updateDeviceAuthForAccessTokenSet: (variables?: any) => any;
    updateDeviceAuthForRefreshTokenSet: (variables?: any) => any;
    deleteDeviceAuthForAccessTokenSet: (variables?: any) => any;
    deleteDeviceAuthForRefreshTokenSet: (variables?: any) => any;
    fetchDeviceAuthForRefreshTokenSet: (variables?: any) => any;
    fetchDeviceAuthForAccessTokenSet: (variables?: any) => any;
    // 레이아웃
    layout: DeviceLayout;
}
export type ApiQuery = Exclude<keyof ApiQueryWrap, 'layout'>;
// ㄴ> ApiQueryWrap에 들어있는 모든 키 중에서 layout만 빼고 나머지 사용하겠다는 의미
// APIS[query](variables)는 ()로 호출 가능한 함수인데 layout은 state로 바꾸는 상태객체 타입 에러남

export type DeviceLayout = {
    notchBackgroundColor: string;
    statusBarStyle: StatusBarStyle;
    safeAreaViewEdge: readonly Edge[];
};

export type onResponse = (result: unknown) => void;
