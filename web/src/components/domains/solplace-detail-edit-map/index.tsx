'use client';

import Link from 'next/link';
import { InputRound } from '../../commons/input';
import style from '../solplace-new-map/styles.module.css';
import { useSearchParams } from 'next/navigation';
import { ButtonFull } from '../../commons/button';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Script from 'next/script';
const MapEdit = dynamic(() => import('../../commons/map').then((mod) => mod.MapEdit), {
    ssr: false,
});

export default function SolPlaceDetailEditMap() {
    const searchParams = useSearchParams();

    const address = searchParams.get('address') || '';
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // 상세페이지 수정
    const id = searchParams.get('id');

    // 카카오skd가 로드 완료되었는지 확인하기
    const [kakaoLoaded, setKakaoLoaded] = useState(false);
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
                onLoad={() => {
                    // autoload=false일 때 load()호출하기
                    window.kakao.maps.load(() => {
                        setKakaoLoaded(true);
                    });
                }}
            />

            {!kakaoLoaded && (
                <div className={style.kakaoLoad}>
                    <CircularProgress />
                </div>
            )}

            {kakaoLoaded && (
                <>
                    <div className={style.mapWrapper}>
                        <MapEdit></MapEdit>
                    </div>
                    <div className={style.flexWrapper}>
                        <div>
                            <InputRound value={address} readOnly />
                        </div>

                        <Link
                            replace
                            href={`/solplace-logs/${id}/edit?lat=${lat}&lng=${lng}&address=${encodeURIComponent(
                                address,
                            )}`}
                            shallow
                        >
                            <ButtonFull text={'이 위치로 등록'} />
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
