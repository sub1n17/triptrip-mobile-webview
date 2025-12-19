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
import { useParams, useRouter } from 'next/navigation';

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

    // 조회하기
    const params = useParams();
    const router = useRouter();

    const { data } = useQuery(FETCH_PLACE, {
        variables: {
            id: params.solplaceLogId,
        },
    });
    // if (!data?.fetchSolplaceLog) return null;

    const placeAddress = data?.fetchSolplaceLog.address;
    const placeLat = data?.fetchSolplaceLog.lat;
    const placeLng = data?.fetchSolplaceLog.lng;

    // form 값 넣기
    const defaultValues = data?.fetchSolplaceLog
        ? {
              title: data.fetchSolplaceLog.title,
              contents: data.fetchSolplaceLog.contents,
          }
        : {};

    // 주소 변경 시 url 전달하기
    const mapParams = new URLSearchParams({
        from: 'edit',
        id: String(params.solplaceLogId),
        lat: String(placeLat),
        lng: String(placeLng),
        address: placeAddress,
    });

    const handleAddressClick = () => {
        router.push(`/solplace-logs/new/map?${mapParams.toString()}`);
    };

    return (
        <>
            <main className={style.container}>
                <Form
                    schema={editSchema}
                    onClickSubmit={onClickSubmit}
                    className={style.form_wrapper}
                    defaultValues={defaultValues}
                >
                    <ImageUpload></ImageUpload>

                    <div>
                        <div className={style.form_title}>
                            플레이스 이름 <span>*</span>
                        </div>
                        <InputNormal
                            keyname={'title'}
                            placeholder={'플레이스 이름을 입력해 주세요. (1자 이상)'}
                        ></InputNormal>
                    </div>
                    <div>
                        <div className={style.form_title}>플레이스 주소</div>
                        <AddressLink
                            // href={`/solplace-logs/new/map?from=edit&id=${
                            //     params.solplaceLogId
                            // }&lat=${placeLat}&lng=${placeLng}&address=${encodeURIComponent(
                            //     placeAddress
                            // )}`}
                            href={`/solplace-logs/new/map/?${mapParams.toString()}`}
                            placeAddress={placeAddress}
                        ></AddressLink>
                        {/* <button
                            onClick={handleAddressClick}
                            className={style.address_button}
                            type="button"
                        >
                            <div>{placeAddress}</div>
                        </button> */}
                    </div>
                    <div>
                        <div className={style.form_title}>
                            플레이스 내용 <span>*</span>
                        </div>

                        <Textarea
                            placeholder={'플레이스 내용을 입력해 주세요. (1자 이상)'}
                            keyname={'contents'}
                            className={style.form_textarea}
                        ></Textarea>
                    </div>
                    <Footer text={'수정'}></Footer>
                </Form>
            </main>
        </>
    );
}
