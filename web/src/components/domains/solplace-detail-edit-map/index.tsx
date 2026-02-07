'use client';

import Link from 'next/link';
import { InputRound } from '../../commons/input';
import style from '../solplace-new-map/styles.module.css';
import { useSearchParams } from 'next/navigation';
import { ButtonFull } from '../../commons/button';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';
const MapEdit = dynamic(() => import('../../commons/map').then((mod) => mod.MapEdit), {
    ssr: false,
    loading: () => (
        <div className={style.kakaoLoad}>
            <CircularProgress />
        </div>
    ),
});

export default function SolPlaceDetailEditMap() {
    const searchParams = useSearchParams();

    const address = searchParams.get('address') || '';
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // 상세페이지 수정
    const id = searchParams.get('id');

    return (
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
    );
}
