'use client';

import style from '../solplace-new/styles.module.css';
import { InputNormal } from '@/src/components/commons/input';

import Form from '../../commons/form';
import Textarea from '../../commons/textarea';
import Footer from '@/src/commons/layout/footer/footer';
import ImageUpload from '../../commons/image-upload';
import { AddressLink } from '../../commons/link';
import { editSchema } from './schema';
import { useInitializeEdit } from './form.initialize';
import { gql, useQuery } from '@apollo/client';
import { useParams, useSearchParams } from 'next/navigation';
import { useSolPlaceNewStore } from '@/src/commons/stores/solplaceNew-store';
import { useEffect, useRef } from 'react';

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

export default function SolPlaceDetailEdit() {
    const { onClickSubmit } = useInitializeEdit();
    const { setTitle, setContents, title, contents, setPreviewUrls, setFiles } =
        useSolPlaceNewStore();

    // 조회하기
    const params = useParams();

    const { data } = useQuery(FETCH_PLACE, {
        variables: {
            id: params.solplaceLogId,
        },
    });

    // form 값 넣기, 지도 페이지에서 다시 돌아왔을 때 store에 있는 값 불러와서 수정값 그대로 보이게 하기
    const defaultValues = data?.fetchSolplaceLog
        ? {
              title: title || data.fetchSolplaceLog.title,
              contents: contents || data.fetchSolplaceLog.contents,
          }
        : {};

    // 수정된 주소가 있으면 그걸 쓰고, 없으면 원래 주소 사용
    const searchParams = useSearchParams();
    const placeAddress = searchParams.get('address') ?? data?.fetchSolplaceLog.address ?? '';
    const placeLat = searchParams.get('lat') ?? data?.fetchSolplaceLog.lat;
    const placeLng = searchParams.get('lng') ?? data?.fetchSolplaceLog.lng;
    // 등록된 주소가 없을 때 기본텍스트 보여주기
    const linkTxtAddress = placeAddress.trim() === '' ? '플레이스 주소 입력' : placeAddress;

    const paramsAddress = searchParams.has('address');
    const paramsLat = searchParams.has('lat');
    const paramsLng = searchParams.has('lng');

    // 이미지 있으면 store에 저장
    const { setExistingImages } = useSolPlaceNewStore();
    const initializedRef = useRef(false);
    useEffect(() => {
        if (!data?.fetchSolplaceLog) return;
        if (initializedRef.current) return; // 주소등록 후 수정페이지로 돌아왔을 때도 추가된 이미지가 보이게 함

        const isFromMap = paramsAddress && paramsLat && paramsLng;
        // 지도에서 돌아온 게 아니면 (최초 진입)
        if (!isFromMap) {
            setExistingImages(data.fetchSolplaceLog.images);
            setPreviewUrls([]);
            setFiles([]);
        }

        initializedRef.current = true;
    }, [data?.fetchSolplaceLog?.id]);
    // useRef는 참조용으로 DOM을 가리킬 수도 있고, 값을 기억하는 욛도로 사용됨, 지금은 후자 (이미지 업로드는 전자)
    // 컴포넌트가 마운트될 때 1번 생성되고 언마운트될 때(수정 페이지 벗어날 때) 사라짐 -> 다시 수정페이지 새로 진입 시 false
    // 주소 등록 후 수정페이지로 돌아오는 건 샬로우라우팅이라서 언마운트되는게 아니기 때문에 계속 true 유지
    return (
        <>
            <main className={style.container}>
                <Form
                    schema={editSchema}
                    onClickSubmit={onClickSubmit}
                    className={style.form_wrapper}
                    defaultValues={defaultValues}
                >
                    <ImageUpload isEdit={true}></ImageUpload>

                    <div>
                        <div className={style.form_title}>
                            플레이스 이름 <span>*</span>
                        </div>
                        <InputNormal
                            keyname={'title'}
                            placeholder={'플레이스 이름을 입력해 주세요. (1자 이상)'}
                            onChange={(event) => setTitle(event.target.value)}
                        ></InputNormal>
                    </div>
                    <div>
                        <div className={style.form_title}>플레이스 주소</div>
                        <AddressLink
                            href={`/solplace-logs/${params.solplaceLogId}/edit/map?from=edit&id=${
                                params.solplaceLogId
                            }&lat=${placeLat}&lng=${placeLng}&address=${encodeURIComponent(
                                placeAddress ?? '',
                            )}`}
                            placeAddress={linkTxtAddress}
                        ></AddressLink>
                    </div>
                    <div>
                        <div className={style.form_title}>
                            플레이스 내용 <span>*</span>
                        </div>

                        <Textarea
                            placeholder={'플레이스 내용을 입력해 주세요. (1자 이상)'}
                            keyname={'contents'}
                            className={style.form_textarea}
                            onChange={(event) => setContents(event.target.value)}
                        ></Textarea>
                    </div>
                    <Footer text={'수정'}></Footer>
                </Form>
            </main>
        </>
    );
}
