'use client';

import style from '../solplace-new/styles.module.css';
import Form from '../../commons/form';
import Textarea from '../../commons/textarea';
import ImageUpload from '../../commons/image-upload';
import { AddressLink } from '../../commons/link';
import { editSchema } from './schema';
import { useInitializeEdit } from './form.initialize';
import { gql, useQuery } from '@apollo/client';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSolPlaceEditStore } from '@/commons/stores/solplaceEdit-store';
import { InputNormal } from '@/components/commons/input';
import Footer from '@/commons/layout/footer/footer';

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
    const {
        setTitle,
        setContents,
        title,
        contents,
        reset,
        setExistingImages,
        editingId,
        setEditingId,
    } = useSolPlaceEditStore();

    // 조회하기
    const params = useParams();

    const { data } = useQuery(FETCH_PLACE, {
        variables: {
            id: params.solplaceLogId,
        },
    });

    // 수정된 주소가 있으면 그걸 쓰고, 없으면 원래 주소 사용
    const searchParams = useSearchParams();
    const placeAddress = searchParams.get('address') ?? data?.fetchSolplaceLog.address ?? '';
    const placeLat = searchParams.get('lat') ?? data?.fetchSolplaceLog.lat;
    const placeLng = searchParams.get('lng') ?? data?.fetchSolplaceLog.lng;
    // 등록된 주소가 없을 때 기본텍스트 보여주기
    const linkTxtAddress = placeAddress.trim() === '' ? '플레이스 주소 입력' : placeAddress;

    // 게시글 ID 변경 시에만 reset
    useEffect(() => {
        const currentId = String(params.solplaceLogId);

        if (editingId !== currentId) {
            reset(); // 이전 게시글 데이터 제거
            setEditingId(currentId); // 지금 게시글 등록
        }
    }, [params.solplaceLogId]);

    // 서버 데이터 초기 주입 (store가 비어 있을 때만)
    useEffect(() => {
        if (!data?.fetchSolplaceLog) return;
        if (title || contents) return;
        // zustand에 넣기
        setTitle(data.fetchSolplaceLog.title);
        setContents(data.fetchSolplaceLog.contents);
        setExistingImages(data.fetchSolplaceLog.images);
    }, [data?.fetchSolplaceLog?.id]);

    return (
        <>
            <main className={style.container}>
                <Form
                    schema={editSchema}
                    onClickSubmit={onClickSubmit}
                    className={style.form_wrapper}
                    defaultValues={{
                        title: title || data?.fetchSolplaceLog.title,
                        contents: contents || data?.fetchSolplaceLog.contents,
                    }}
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
                            value={title}
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
                            value={contents}
                        ></Textarea>
                    </div>
                    <Footer text={'수정'}></Footer>
                </Form>
            </main>
        </>
    );
}
