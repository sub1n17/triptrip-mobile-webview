'use client';

import Image from 'next/image';
import style from './styles.module.css';
import { useEffect, useState } from 'react';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { gql, useQuery } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Link from 'next/link';
import { message } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { useRoutingSetting } from '@/src/commons/settings/routing-setting/hook';
import { useFullscreenStore } from '@/src/commons/stores/fullscreen-store';

const imgSrc = {
    placeImage: '/images/defaultPlaceImg.jpg',
    edit: '/icons/edit.png',
    location: '/icons/location.png',
    mapDown: '/icons/mapDown.png',
    mapUp: '/icons/mapUp.png',
    mapExample: '/images/mapExample.png',
    imageClose: '/images/image_close.png',
};

const FETCH_PLACE = gql`
    query fetchSolplaceLog($id: ID!) {
        fetchSolplaceLog(id: $id) {
            id
            title
            contents
            address
            lat
            lng
            images
            userId
        }
    }
`;

export default function SolPlaceDetail() {
    // 조회하기
    const params = useParams();
    const { data } = useQuery(FETCH_PLACE, {
        variables: {
            id: params.solplaceLogId,
        },
    });
    const placeLat = data?.fetchSolplaceLog.lat === 0 ? null : data?.fetchSolplaceLog.lat;
    const placeLng = data?.fetchSolplaceLog.lng === 0 ? null : data?.fetchSolplaceLog.lng;

    const { fetchApp } = useDeviceSetting();

    // 이미지 풀스크린 상태
    const [isFullScreen, setIsFullScreen] = useState(false);
    // 클릭 상태
    const [scale, setScale] = useState(1);
    // 풀스크린 시 헤더 숨기기 (상세페이지의 헤더 백버튼 숨기기)
    const { setImageFullscreen } = useFullscreenStore();
    // 이미지 풀스크린
    const onclickFullScreen = async () => {
        setIsFullScreen(true);
        setImageFullscreen(true);
        // pushState : 페이지는 안 바꾸고, 뒤로가기 기록만 하나 추가하는 것 (state로 관리해서 뒤로가기 시 목록이 나오는 현상 해결하기 위해 뒤로가기 기록 추가)
        window.history.pushState({ fullscreen: true }, '');

        await fetchApp({ query: 'setFullScreenLayout' });
    };

    const closeFullscreen = async () => {
        setIsFullScreen(false);
        setImageFullscreen(false);
        setScale(1);
        await fetchApp({ query: 'setDefaultLayout' });
    };

    // 이미지 닫기 버튼 (실제 닫기 로직은 popstate에서 처리)
    const onclickClose = () => {
        closeFullscreen();
    };

    // popstate 감지
    useEffect(() => {
        const handlePopState = () => {
            if (isFullScreen) {
                closeFullscreen();
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isFullScreen]);

    // 지도 토글
    const [mapToggle, setMapToggle] = useState(false);
    const onClickMapToggle = () => {
        setMapToggle((prev) => !prev);
    };

    // 수정 후 수정완료 토스트메시지 띄우기
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        if (searchParams.get('updated')) {
            message.success('플레이스 수정 완료');
            router.replace(`/solplace-logs/${params.solplaceLogId}`); // 쿼리 스트링 없애기
        }
    }, [searchParams]);

    const { onRouterPush } = useRoutingSetting();

    return (
        <>
            {!isFullScreen && (
                <div>
                    {/* 이미지 */}
                    <div className={style.image_wrapper}>
                        {/* 이미지 없으면 기본 이미지 */}
                        {data?.fetchSolplaceLog.images.length === 0 ? (
                            <div onClick={onclickFullScreen}>
                                <Image
                                    src={imgSrc.placeImage}
                                    alt="placeImage"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ) : (
                            // 이미지 있을 때
                            <Swiper
                                pagination={{ type: 'fraction' }}
                                navigation={true}
                                modules={[Pagination]}
                                loop={true}
                                className="mySwiper"
                                key={data?.fetchSolplaceLog.images?.length} // 데이터 바뀔 때 Swiper 재생성해서 페이지네이션 NaN 해결
                            >
                                {data?.fetchSolplaceLog.images.map((el, index) => (
                                    <SwiperSlide key={`${el}_${index}`}>
                                        <div
                                            className={style.image_inner}
                                            onClick={onclickFullScreen}
                                        >
                                            <Image
                                                src={`https://storage.googleapis.com/${el}`}
                                                alt={`placeImage_${index}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                    <div className={style.contents_wrapper}>
                        <div className={style.address_wrapper}>
                            {/* 제목 */}
                            <div className={style.title_wrapper}>
                                <div className={style.address_title}>
                                    {data?.fetchSolplaceLog.title}
                                </div>
                                <Link
                                    href={`/solplace-logs/${data?.fetchSolplaceLog.id}/edit`}
                                    className={style.edit_img}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRouterPush(
                                            `/solplace-logs/${data?.fetchSolplaceLog.id}/edit`
                                        );
                                    }}
                                >
                                    <Image src={imgSrc.edit} alt="수정하기" fill></Image>
                                </Link>
                            </div>
                            {/* 주소 */}
                            {placeLat && placeLng && (
                                <div>
                                    <div className={style.addressDetail_wrapper}>
                                        <div className={style.location_img}>
                                            <Image src={imgSrc.location} alt="주소" fill></Image>
                                        </div>
                                        <div className={style.addressDetail}>
                                            {data?.fetchSolplaceLog.address}
                                        </div>
                                        <div>
                                            {/* 지도 보기 */}
                                            <button
                                                className={style.map_toggle}
                                                onClick={onClickMapToggle}
                                            >
                                                <div className={style.map_txt}>
                                                    {mapToggle ? '지도 접기' : '지도 보기'}
                                                </div>
                                                <div className={style.mapArr_img}>
                                                    <Image
                                                        src={
                                                            mapToggle
                                                                ? imgSrc.mapUp
                                                                : imgSrc.mapDown
                                                        }
                                                        alt={mapToggle ? '지도 접기' : '지도 보기'}
                                                        fill
                                                    ></Image>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    {mapToggle && (
                                        <div className={style.map_wrapper}>
                                            <Map
                                                center={{ lat: placeLat, lng: placeLng }}
                                                level={3}
                                                style={{ width: '100%', height: '100%' }}
                                            >
                                                <MapMarker
                                                    position={{ lat: placeLat, lng: placeLng }}
                                                    image={{
                                                        src: '/images/mapMarker.png',
                                                        size: { width: 22, height: 31 },
                                                    }}
                                                />
                                            </Map>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* 내용 */}
                        <div className={style.contents}>{data?.fetchSolplaceLog.contents}</div>
                    </div>
                </div>
            )}

            {/* 풀스크린 이미지 */}
            {isFullScreen && (
                <div className={style.fullscreen_wrapper}>
                    {/* 닫기 버튼은 스케일 영향 받지 않게 하기 */}
                    <button className={style.imageClose_img} onClick={onclickClose}>
                        <Image src={imgSrc.imageClose} alt="이미지 닫기" fill></Image>
                    </button>
                    {/* 페이지네이션은 Swiper 밖에 두기 */}
                    <div className="fullscreen_pagination" />

                    {/* 이미지만 스케일 허용하기 */}
                    <div className={style.zoom_wrapper}>
                        {/* 이미지 없으면 기본 이미지 */}
                        {data?.fetchSolplaceLog.images.length === 0 ? (
                            <div
                                className={style.placeImage_img}
                                style={{
                                    transform: `scale(${scale})`,
                                    transition: 'all 0.2s',
                                }}
                                onDoubleClick={() => {
                                    setScale((prev) => (prev === 1 ? 2 : 1));
                                }}
                            >
                                <Image
                                    src={imgSrc.placeImage}
                                    alt="이미지"
                                    fill
                                    sizes="100vw"
                                    style={{ objectFit: 'contain' }}
                                    unoptimized
                                ></Image>
                            </div>
                        ) : (
                            // 이미지 있을 때
                            <div style={{ width: '100%', height: '100%' }}>
                                <Swiper
                                    pagination={{ type: 'fraction', el: '.fullscreen_pagination' }} // 외부 DOM으로 페이지네이션 지정
                                    navigation={true}
                                    modules={[Pagination, Zoom]}
                                    loop={true}
                                    className="full_Image"
                                    key={data?.fetchSolplaceLog.images?.length} // 데이터 바뀔 때 Swiper 재생성해서 페이지네이션 NaN 해결
                                    zoom={{
                                        maxRatio: 2, // 최대 확대 배수
                                        minRatio: 1, // 최소
                                        toggle: true, // 더블탭으로 토글
                                    }}
                                >
                                    {data?.fetchSolplaceLog.images.map((el, index) => (
                                        <SwiperSlide key={`${el}_${index}`}>
                                            <div className="swiper-zoom-container">
                                                <div className={style.placeImage_img}>
                                                    <Image
                                                        src={`https://storage.googleapis.com/${el}`}
                                                        alt={`placeImage_${index}`}
                                                        fill
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
