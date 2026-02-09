'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Map } from 'react-kakao-maps-sdk';
import style from './styles.module.css';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';

interface MapBaseProps {
    address?: string;
    placeLat?: number;
    placeLng?: number;
}

function MapBase({ address, placeLat, placeLng }: MapBaseProps) {
    const [isKakaoReady, setIsKakaoReady] = useState(false);
    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        window.kakao.maps.load(() => {
            setIsKakaoReady(true);
        });
    }, []);

    const { fetchApp } = useDeviceSetting();

    const mapRef = useRef<kakao.maps.Map | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL에서 좌표값 가져오기
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    const initLocation =
        // 게시글 상세일 때, 조회된 위도경도 값 사용
        placeLat && placeLng
            ? { lat: Number(placeLat), lng: Number(placeLng) }
            : lat && lng && Number(lat) !== 0 && Number(lng) !== 0
              ? // 작성/수정할 때, 샬로우라우팅 된 url의 위도경도 값 사용
                { lat: Number(lat), lng: Number(lng) }
              : // 위치 권한 거부 시, 서울시청 값 사용
                { lat: 37.5662952, lng: 126.9779451 };

    // 새 글 작성 시, 현재 위치로 지도 표시하기
    useEffect(() => {
        // 좌표/주소 있으면 현재위치 좌표 가져오기 못하게 하기
        if (searchParams.get('lat') && searchParams.get('lng') && searchParams.get('address')) {
            return;
        }

        const fetchLocation = async () => {
            // 현재 위치 좌표값 가져오기
            const result = (await fetchApp({ query: 'fetchDeviceLocationForLatLngSet' })) as {
                // result 타입
                data: {
                    fetchDeviceLocationForLatLngSet: {
                        status: 'granted' | 'denied';
                        lat?: number;
                        lng?: number;
                    };
                };
            };

            if (!result?.data?.fetchDeviceLocationForLatLngSet) return;

            const status = result.data.fetchDeviceLocationForLatLngSet.status;
            const currentLat = result.data.fetchDeviceLocationForLatLngSet.lat;
            const currentLng = result.data.fetchDeviceLocationForLatLngSet.lng;

            // 아직 현재 위치 좌표 안 왔으면 그냥 대기
            if (
                status === 'granted' &&
                (typeof currentLat !== 'number' || typeof currentLng !== 'number')
            )
                return;

            const params = new URLSearchParams(searchParams.toString());

            let nextLat: number;
            let nextLng: number;

            // 위치 권한 허락 시, 현재 위치 보여주기
            if (
                status === 'granted' &&
                typeof currentLat === 'number' &&
                typeof currentLng === 'number' &&
                currentLat !== 0 &&
                currentLng !== 0
            ) {
                nextLat = currentLat;
                nextLng = currentLng;
            } else if (status === 'denied') {
                nextLat = 37.5668242; // 서울시청
                nextLng = 126.9786465;

                params.set('lat', String(nextLat));
                params.set('lng', String(nextLng));
                params.set('address', '서울특별시 중구 세종대로 110');

                params.delete('from');
                router.replace(`?${params.toString()}`);

                return;
            } else {
                return; // 아직 좌표 안 온 상태
            }

            params.set('lat', String(nextLat));
            params.set('lng', String(nextLng));

            // 카카오 SDK 로드 확인 (지도 SDK 로드는 위치권한 허용/거부 상관없이 무조건 실행)
            if (!window.kakao || !window.kakao.maps) {
                router.replace(`?${params.toString()}`);
                return;
            }

            // 지도 로드 완료 후, 현재 위치의 위도경도로 주소 역지오코딩
            window.kakao.maps.load(() => {
                if (!window.kakao.maps.services) return;

                // 위치 권한 허용일 때만 주소 역지오코딩
                if (status === 'granted') {
                    const geocoder = new window.kakao.maps.services.Geocoder();

                    geocoder.coord2Address(nextLng, nextLat, (result, status) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const addr =
                                result[0].road_address?.address_name ||
                                result[0].address.address_name;

                            params.set('address', addr);
                        }

                        params.delete('from');
                        router.replace(`?${params.toString()}`);
                    });
                } else {
                    // 위치권한 거부일 때 서울 시청 주소
                    params.set('address', '서울특별시 중구 세종대로 110');
                    params.delete('from');
                    router.replace(`?${params.toString()}`);
                }
            });
        };
        fetchLocation();
    }, []);

    // 주소 → 좌표 변환 (지도 이동 없이 URL만 갱신)
    useEffect(() => {
        if (!address) return;
        if (!isKakaoReady) return;

        window.kakao.maps.load(() => {
            if (!window.kakao.maps.services) return;
            // 주소 → 좌표 변환용 객체 생성
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const newLoc = {
                        lat: Number(result[0].y),
                        lng: Number(result[0].x),
                    };

                    // edit-map 이동 시, from=edit 쿼리스트링 유지하기
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('lat', String(newLoc.lat));
                    params.set('lng', String(newLoc.lng));
                    params.set('address', address);

                    router.replace(`?${params.toString()}`);
                }
            });
        });
    }, [address, isKakaoReady]);

    // 이전 좌표 기억용 ref
    const lastCenterRef = useRef<{ lat: number; lng: number } | null>(null);
    // 역지오코딩 Geocoder 기억용 ref (처음 만든 Geocoder 재사용)
    const geocoderRef = useRef<kakao.maps.services.Geocoder | null>(null);

    // 지도 이동 → 역지오코딩 + URL 업데이트
    const onIdle = () => {
        if (!window.kakao?.maps?.services) return;
        if (!isKakaoReady) return;

        const map = mapRef.current;
        if (!map) return;

        // geocoder가 없으면 최초 1회만 생성
        if (!geocoderRef.current) {
            geocoderRef.current = new window.kakao.maps.services.Geocoder();
        }

        const latlng = map.getCenter();
        const nextLat = latlng.getLat();
        const nextLng = latlng.getLng();

        // 이전 좌표와 같으면 아무것도 안 함
        if (
            lastCenterRef.current &&
            lastCenterRef.current.lat === nextLat &&
            lastCenterRef.current.lng === nextLng
        ) {
            return;
        }

        // 현재 좌표를 이전 좌표로 저장
        lastCenterRef.current = { lat: nextLat, lng: nextLng };

        if (!geocoderRef.current) return;
        geocoderRef.current.coord2Address(nextLng, nextLat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const addr = result[0].road_address?.address_name || result[0].address.address_name;

                // 바뀐 위도경도값으로 url 바꾸기
                const params = new URLSearchParams(searchParams.toString());
                params.set('lat', String(nextLat));
                params.set('lng', String(nextLng));
                params.set('address', addr);

                router.replace(`?${params.toString()}`, { scroll: false });
            }
        });
    };

    return (
        <>
            <div className={style.mapWrapper}>
                <Map
                    center={initLocation} //지도의 중심을 이 좌표로 맞추기
                    level={3}
                    onIdle={onIdle}
                    className={style.mapElement}
                    onCreate={(map) => {
                        mapRef.current = map;
                    }}
                >
                    <div className={style.centerMarker} />
                </Map>
            </div>
        </>
    );
}

export function MapNew(props: MapBaseProps) {
    return <MapBase {...props} />;
}

export function MapEdit(props: MapBaseProps) {
    return <MapBase {...props} />;
}
