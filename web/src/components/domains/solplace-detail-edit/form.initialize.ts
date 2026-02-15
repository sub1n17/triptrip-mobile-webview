'use client';

import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import { editSchemaType } from './schema';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { message } from 'antd';
import { useSolPlaceEditStore } from '@/commons/stores/solplaceEdit-store';

const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload) {
        uploadFile(file: $file) {
            url
        }
    }
`;

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

const UPDATE_LOG = gql`
    mutation updateSolplaceLog($id: ID!, $updateSolplaceLogInput: UpdateSolplaceLogInput!) {
        updateSolplaceLog(id: $id, updateSolplaceLogInput: $updateSolplaceLogInput) {
            id
            title
            contents
            address
            lat
            lng
            images
            addressCity
            addressTown
        }
    }
`;

export const useInitializeEdit = () => {
    const router = useRouter();
    const [update_log] = useMutation(UPDATE_LOG);
    const params = useParams();
    const { files, existingImages } = useSolPlaceEditStore();

    const { data } = useQuery(FETCH_PLACE, {
        variables: {
            id: params.solplaceLogId,
        },
    });

    const searchParams = useSearchParams();

    // 수정된 주소가 있으면 그걸 쓰고, 없으면 원래 주소 사용
    const editPlace =
        searchParams.get('address') && searchParams.get('lat') && searchParams.get('lng')
            ? {
                  address: searchParams.get('address'),
                  lat: Number(searchParams.get('lat')),
                  lng: Number(searchParams.get('lng')),
              }
            : null;

    // 원래 주소 또는 변경된 주소로 저장하기
    const address = editPlace?.address ?? data?.fetchSolplaceLog.address;
    const lat = editPlace?.lat ?? data?.fetchSolplaceLog.lat;
    const lng = editPlace?.lng ?? data?.fetchSolplaceLog.lng;

    // 이미지 추가하면 url 받아오기
    const [uploadFile] = useMutation(UPLOAD_FILE);

    // 수정하기
    const onClickSubmit = async (data: editSchemaType) => {
        try {
            // 사진 업로드 후 url 받아오기
            const imagesUrls = await Promise.all(
                files.map(async (el) => {
                    const result = await uploadFile({ variables: { file: el } });
                    return result.data.uploadFile.url;
                }),
            );

            // 기존 이미지와 새로 추가한 이미지 같이 보여주기
            const editImages = [...existingImages, ...imagesUrls];

            await update_log({
                variables: {
                    id: params.solplaceLogId,
                    updateSolplaceLogInput: {
                        title: data.title,
                        contents: data.contents,
                        address: address,
                        lat: lat,
                        lng: lng,
                        images: editImages,
                    },
                },
            });

            router.replace(`/solplace-logs/${params.solplaceLogId}?updated=true`);
            return true;
        } catch (error) {
            const err = error as Error;
            if (err.message.includes('작성자')) {
                message.error({
                    content: err.message,
                    duration: 2,
                });

                router.replace(`/solplace-logs/${params.solplaceLogId}`);
                return false;
            }
            // UNAUTHENTICATED 에러 있으면 토스트 띄우지 않기
            if (
                err instanceof ApolloError &&
                err?.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED'
            ) {
                return false;
            }
            message.error(err.message);
            return false;
        }
    };

    return {
        onClickSubmit,
    };
};
