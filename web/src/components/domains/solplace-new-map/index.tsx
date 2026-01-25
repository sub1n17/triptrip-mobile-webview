'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { ButtonFull } from '../../commons/button';
import { InputRound } from '../../commons/input';
// import { MapNew } from '../../commons/map';
import style from './styles.module.css';

import dynamic from 'next/dynamic';
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

    return (
        <>
            <div className={style.mapWrapper}>
                <MapNew address={address} />
            </div>

            <div className={style.flexWrapper}>
                <div>
                    <InputRound
                        // defaultValue={address}
                        value={address}
                        readOnly
                    />
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
    );
}
