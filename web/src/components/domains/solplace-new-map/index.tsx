'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { ButtonFull } from '../../commons/button';
import { InputRound } from '../../commons/input';
// import { MapNew } from '../../commons/map';
import style from './styles.module.css';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Script from 'next/script';
const MapNew = dynamic(() => import('../../commons/map').then((mod) => mod.MapNew), {
    ssr: false,
});

export default function SolPlaceNewMap() {
    const searchParams = useSearchParams();

    // URL에 값 있으면 그걸 우선 사용
    const address = searchParams.get('address') || '서울특별시 중구 세종대로 110';
    const lat = searchParams.get('lat') ?? '';
    const lng = searchParams.get('lng') ?? '';

    // 상세페이지 수정
    const from = searchParams.get('from') ?? 'new';
    const id = searchParams.get('id');

    const [kakaoLoaded, setKakaoLoaded] = useState(false);

    // 카카오skd가 로드 완료되었는지 확인하기
    useEffect(() => {
        const mapLoad = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                setKakaoLoaded(true);
                clearInterval(mapLoad);
            }
        }, 100);
        return () => clearInterval(mapLoad);
    }, []);

    return (
        <>
            <Script
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
                strategy="afterInteractive"
            />

            {!kakaoLoaded && (
                <div className={style.kakaoLoad}>
                    <CircularProgress />
                </div>
            )}

            {kakaoLoaded && (
                <>
                    <div className={style.mapWrapper}>
                        <MapNew address={address} />
                    </div>

                    <div className={style.flexWrapper}>
                        <div>
                            <InputRound value={address} readOnly />
                        </div>

                        <Link
                            replace
                            href={
                                from === 'edit'
                                    ? `/solplace-logs/${id}/edit?lat=${lat}&lng=${lng}&address=${encodeURIComponent(
                                          address,
                                      )}`
                                    : `/solplace-logs/new?lat=${lat}&lng=${lng}&address=${encodeURIComponent(
                                          address,
                                      )}`
                            }
                        >
                            <ButtonFull text={'이 위치로 등록'} />
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
