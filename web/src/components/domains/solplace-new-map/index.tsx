// 'use client';

// import Link from 'next/link';
// import { ButtonFull } from '../../commons/button';
// import { InputRound } from '../../commons/input';
// import { MapNew } from '../../commons/map';
// import style from './styles.module.css';
// import { useEffect, useState } from 'react';

// export default function SolPlaceNewMap() {
//     const [address, setAddress] = useState('서울특별시 중구 세종대로 110');
//     const [location, setLocation] = useState({
//         lat: 37.5662952,
//         lng: 126.9779451,
//     });

//     // 주소 검색 버튼 클릭
//     const handleSearchAddress = () => {
//         const layer = document.getElementById('postLayer');

//         new window.daum.Postcode({
//             oncomplete: function (data) {
//                 setAddress(data.address);
//                 layer.style.display = 'none';
//             },
//             onclose: function () {
//                 layer.style.display = 'none';
//             },
//         }).embed(layer);

//         layer.style.display = 'block';
//     };

//     // 주소 검색 버튼
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
//         script.async = true;
//         document.body.appendChild(script);
//     }, []);

//     return (
//         <>
//             <div id="postLayer"></div>

//             <div className={style.mapWrapper}>
//                 <MapNew
//                     address={address}
//                     setAddress={setAddress}
//                     setLocation={setLocation}
//                     location={location}
//                 ></MapNew>
//             </div>
//             <div className={style.flexWrapper}>
//                 <div>
//                     <InputRound value={address}></InputRound>
//                     <button type="button" onClick={handleSearchAddress} style={{ height: '40px' }}>
//                         주소 검색
//                     </button>
//                 </div>
//                 <Link
//                     href={`/solplace/new?lat=${location.lat}&lng=${
//                         location.lng
//                     }&address=${encodeURIComponent(address)}`}
//                     shallow
//                 >
//                     <ButtonFull text={'이 위치로 등록'}></ButtonFull>
//                 </Link>
//             </div>
//         </>
//     );
// }

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { ButtonFull } from '../../commons/button';
import { InputRound } from '../../commons/input';
import { MapNew } from '../../commons/map';
import style from './styles.module.css';

declare const window: Window & {
    daum: any;
};

export default function SolPlaceNewMap() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // URL에 값 있으면 그걸 우선 사용
    const address = searchParams.get('address') || '서울특별시 중구 세종대로 110';
    const lat = searchParams.get('lat') || '37.5662952';
    const lng = searchParams.get('lng') || '126.9779451';

    const location = {
        lat: Number(lat),
        lng: Number(lng),
    };

    // 주소 검색 버튼 클릭 시 Daum 주소 검색 실행 + 샬로우라이팅
    const handleSearchAddress = () => {
        const layer = document.getElementById('postLayer');
        if (!layer) return;

        new window.daum.Postcode({
            oncomplete: function (data) {
                router.replace(
                    `?lat=${location.lat}&lng=${location.lng}&address=${encodeURIComponent(
                        data.address
                    )}`,
                    { shallow: true }
                );
                layer.style.display = 'none';
            },
            onclose: function () {
                layer.style.display = 'none';
            },
        }).embed(layer);

        layer.style.display = 'block';
    };

    // Daum PostCode 스크립트 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <>
            <div id="postLayer"></div>

            <div className={style.mapWrapper}>
                <MapNew address={address} location={location} />
            </div>

            <div className={style.flexWrapper}>
                <div>
                    <InputRound value={address} readOnly />
                    <button type="button" onClick={handleSearchAddress} style={{ height: '40px' }}>
                        주소 검색
                    </button>
                </div>

                <Link
                    href={`/solplace-logs/new?lat=${location.lat}&lng=${
                        location.lng
                    }&address=${encodeURIComponent(address)}`}
                    shallow
                >
                    <ButtonFull text={'이 위치로 등록'} />
                </Link>
            </div>
        </>
    );
}
