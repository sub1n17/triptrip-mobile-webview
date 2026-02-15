'use client';
import Image from 'next/image';
import style from './styles.module.css';
import Link from 'next/link';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ButtonCircle } from '../../commons/button';
import { gql, useQuery } from '@apollo/client';
import { useRoutingSetting } from '@/commons/settings/routing-setting/hook';
import { FetchSolplaceLogsDocument } from '@/commons/graphql/graphql';
import { useSolPlaceNewStore } from '@/commons/stores/solplaceNew-store';
import Footer from '@/commons/layout/footer/footer';

const imgSrc = {
    location: '/icons/location.png',
    placeAdd: '/icons/place_add.png',
    footerLocation: '/icons/footer_location.png',
    footerMypage: '/icons/footer_mypage.png',
    defaultPlaceImg: '/images/defaultPlaceImg.jpg',
};

const FETCH_PLACES = gql`
    query fetchSolplaceLogs($page: Int) {
        fetchSolplaceLogs(page: $page) {
            id
            title
            contents
            address
            # addressCity
            # addressTown
            images
        }
    }
`;
export default function SolPlaceList() {
    const { onRouterPush } = useRoutingSetting();

    // 게시글 조회
    const { data, fetchMore, refetch } = useQuery(FetchSolplaceLogsDocument, {
        variables: { page: 1 },
        fetchPolicy: 'cache-first',
    });

    const [page, setPage] = useState(1);
    const list = data?.fetchSolplaceLogs ?? [];

    // hasMore={true} 하면 리스트가 0개여도 아직 로딩할 게 있다고 판단돼서 loader를 보여줌 -> state로 관리
    const [hasMore, setHasMore] = useState(true);

    // 무한 스크롤
    const onNext = () => {
        fetchMore({
            variables: {
                page: page + 1,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                // 더 이상 불러올 데이터 없으면 이전 값으로 두기
                if (!fetchMoreResult.fetchSolplaceLogs.length) {
                    setHasMore(false);
                    return prev;
                }

                // 데이터가 더 있으면 페이지 업데이트
                setPage((prev) => prev + 1);

                // 기존 데이터와 새로 불러온 데이터 합쳐서 보여주기
                return {
                    fetchSolplaceLogs: [
                        ...(prev.fetchSolplaceLogs ?? []),
                        ...fetchMoreResult.fetchSolplaceLogs,
                    ],
                };
            },
        });
    };

    // 당겨서 새로고침 (4개 보여주기)
    const onRefresh = () => {
        setPage(1);
        setHasMore(true);
        refetch({ page: 1 });
    };

    const { setIsFirstNew } = useSolPlaceNewStore();

    return (
        <>
            <main className={style.place_wrapper}>
                <InfiniteScroll
                    hasMore={hasMore}
                    next={onNext}
                    loader={null}
                    dataLength={list.length}
                    // pull-to-refresh 새로고침
                    pullDownToRefresh={true}
                    refreshFunction={onRefresh}
                    pullDownToRefreshThreshold={100}
                >
                    <div className={style.place_list}>
                        {list.map((el, index) => {
                            const imageSrc =
                                typeof el.images?.[0] === 'string' && el.images[0].trim() !== ''
                                    ? el.images[0].startsWith('http')
                                        ? el.images[0]
                                        : `https://storage.googleapis.com/${el.images[0]}`
                                    : imgSrc.defaultPlaceImg;
                            return (
                                <Link
                                    href={`/solplace-logs/${el.id}`}
                                    key={`${el}_${index}`}
                                    className={style.list_wrapper}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRouterPush(`/solplace-logs/${el.id}`);
                                    }}
                                >
                                    <div className={style.place_img}>
                                        {/* eslint-disable @next/next/no-img-element */}
                                        <img
                                            src={imageSrc}
                                            alt="플레이스"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/defaultPlaceImg.jpg';
                                            }}
                                        />
                                        {/* ㄴ> 사진 파일이 이상한 게시글이 있는데 next/image는 조금이라도 이상하면 reject 시켜서 엄격한데 img는 그냥 브라우저가 대충 렌더링 시도해서 깨진 이미지 자동 fallback시킴 -> 손상된 이미지가 안전함 */}
                                    </div>
                                    <div>
                                        <div className={style.title}>{el.title} </div>
                                        <div className={style.contents}>{el.contents} </div>
                                    </div>

                                    {el.address && (
                                        <div className={style.location_wrapper}>
                                            <div className={style.location_img}>
                                                <Image
                                                    src={imgSrc.location}
                                                    alt="location"
                                                    fill
                                                    sizes="16px"
                                                />
                                            </div>
                                            <div className={style.address}>
                                                {el.address.split(' ').slice(0, 2).join(' ')}
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </InfiniteScroll>
                {!(hasMore && list.length > 0) && (
                    <div className={style.list_end}>마지막 플레이스입니다.</div>
                )}
                <Link
                    href={'/solplace-logs/new'}
                    onClick={() => setIsFirstNew(true)}
                    className={style.add_place}
                >
                    <ButtonCircle>
                        <Image
                            src={imgSrc.placeAdd}
                            alt="플레이스 등록"
                            width={36}
                            height={36}
                        ></Image>
                    </ButtonCircle>
                </Link>
            </main>
            <Footer navActive={'isPlace'}></Footer>
        </>
    );
}
