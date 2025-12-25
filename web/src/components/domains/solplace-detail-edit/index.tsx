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
import { useEffect } from 'react';

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
        }
    }
`;

export default function SolPlaceDetailEdit() {
    const { onClickSubmit } = useInitializeEdit();
    const { setTitle, setContents, title, contents, reset } = useSolPlaceNewStore();

    // 조회하기
    const params = useParams();
    // const router = useRouter();

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

    // 처음엔 인풋과 이미지 모두 초기화시키기
    useEffect(() => {
        reset();
    }, []);

    // 이미지 있으면 store에 저장
    const { setExistingImages } = useSolPlaceNewStore();
    useEffect(() => {
        if (data?.fetchSolplaceLog) {
            // setTitle(data?.fetchSolplaceLog.title);
            // setContents(data?.fetchSolplaceLog.components);
            setExistingImages(data?.fetchSolplaceLog.images);
        }
    }, [data]);

    // 수정된 주소가 있으면 그걸 쓰고, 없으면 원래 주소 사용
    const searchParams = useSearchParams();
    const placeAddress = searchParams.get('address') ?? data?.fetchSolplaceLog.address;
    const placeLat = searchParams.get('lat') ?? data?.fetchSolplaceLog.lat;
    const placeLng = searchParams.get('lng') ?? data?.fetchSolplaceLog.lng;

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
                                placeAddress ?? ''
                            )}`}
                            placeAddress={placeAddress}
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
