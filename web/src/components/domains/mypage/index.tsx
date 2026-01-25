'use client';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { Toggle } from '../../commons/toggle';
import { useEffect, useState } from 'react';
import Footer from '@/src/commons/layout/footer/footer';

interface DeviceResponse<T> {
    data: T;
}
interface AppStateResponse {
    fetchDeviceSystemForAppStateSet: {
        isForeground: boolean;
    };
}
interface PermissionResponse {
    status: 'granted' | 'denied' | 'prompt';
}

interface LocationPermissionResponse {
    fetchDeviceLocationForPermissionSet: PermissionResponse;
}

interface NotificationPermissionResponse {
    fetchDeviceNotificationForPermissionSet: PermissionResponse;
}

export default function MyPage() {
    const { fetchApp } = useDeviceSetting();

    // 권한은 아직 값이 없을 수도 있고 (null), 나중에 { location: boolean, notification: boolean } 형태의 객체가 될 것
    // 처음부터 false로 두면 권한 허락된 상태일 때 항상 false->true로 토글이 움직임
    const [permissions, setPermissions] = useState<{
        location: boolean;
        notification: boolean;
    } | null>(null);

    // 위치 권한 토글
    const onClickLocation = async () => {
        await fetchApp({ query: 'openDeviceSystemForSettingSet' });

        const interval = setInterval(async () => {
            // 앱 상태 감지 요청
            const appStatus = (await fetchApp({
                query: 'fetchDeviceSystemForAppStateSet',
            })) as DeviceResponse<AppStateResponse>;

            // 앱 상태가 포그라운드일 때 실행
            const isForeground = appStatus.data.fetchDeviceSystemForAppStateSet.isForeground;
            if (!isForeground) return;

            // 위치 권한 조회
            const permission = (await fetchApp({
                query: 'fetchDeviceLocationForPermissionSet',
            })) as DeviceResponse<LocationPermissionResponse>;
            const permissionStatus = permission.data.fetchDeviceLocationForPermissionSet.status;

            if (permissionStatus === 'granted') {
                // 위치 권한 허용일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;
                    // 이전 값이 null이면 그대로 두기

                    return {
                        ...prev, // null이 아닌 location, notification을 가진 객체라면 스프레드
                        location: true,
                    };
                });
            } else {
                // 위치 권한 거부일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        location: false,
                    };
                });
            }
            clearInterval(interval);
        }, 1000);
    };

    // 알림 권한 토글
    const onClickNotification = async () => {
        await fetchApp({ query: 'openDeviceSystemForSettingSet' });

        const interval = setInterval(async () => {
            // 앱 상태 감지 요청
            const appStatus = (await fetchApp({
                query: 'fetchDeviceSystemForAppStateSet',
            })) as DeviceResponse<AppStateResponse>;

            // 앱 상태가 포그라운드일 때 실행
            const isForeground = appStatus.data.fetchDeviceSystemForAppStateSet.isForeground;
            if (!isForeground) return;

            // 알림 권한 조회
            const permission = (await fetchApp({
                query: 'fetchDeviceNotificationForPermissionSet',
            })) as DeviceResponse<NotificationPermissionResponse>;
            const permissionStatus = permission.data.fetchDeviceNotificationForPermissionSet.status;

            if (permissionStatus === 'granted') {
                // 알림 권한 허용일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        notification: true,
                    };
                });
            } else {
                // 알림 권한 거부일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        notification: false,
                    };
                });
            }
            clearInterval(interval);
        }, 1000);
    };

    // 초기 권한 상태 조회하기
    useEffect(() => {
        const fetchInitialPermissions = async () => {
            // 위치 권한 조회
            const locationPermission = (await fetchApp({
                query: 'fetchDeviceLocationForPermissionSet',
            })) as DeviceResponse<LocationPermissionResponse>;

            const locationStatus =
                locationPermission.data.fetchDeviceLocationForPermissionSet.status;

            // 알람 권한 조회
            const notificationPermission = (await fetchApp({
                query: 'fetchDeviceNotificationForPermissionSet',
            })) as DeviceResponse<NotificationPermissionResponse>;

            const notificationStatus =
                notificationPermission.data.fetchDeviceNotificationForPermissionSet.status;

            // 권한 허용일 때, 토글 변경
            setPermissions({
                location: locationStatus === 'granted' ? true : false,
                notification: notificationStatus === 'granted' ? true : false,
            });
        };
        fetchInitialPermissions();
    }, []);

    if (!permissions) return null;
    return (
        <>
            <Toggle
                title={'위치 권한'}
                onClick={onClickLocation}
                permissions={permissions.location}
                id="location-toggle"
            ></Toggle>
            <Toggle
                title={'알림 권한'}
                onClick={onClickNotification}
                permissions={permissions.notification}
                id="notification-toggle"
            ></Toggle>
            <Footer navActive={'isMypage'}></Footer>
        </>
    );
}
