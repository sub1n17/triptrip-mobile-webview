'use client';

import { newSchemaType } from './schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { message } from 'antd';
import { useDeviceSetting } from '@/commons/settings/device-setting/hook';
import { useSolPlaceNewStore } from '@/commons/stores/solplaceNew-store';

const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload) {
        uploadFile(file: $file) {
            url
        }
    }
`;

const CREATE_PLACE = gql`
    mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {
        createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {
            id
            title
            contents
            address
            lat
            lng
            addressCity
            addressTown
            images
        }
    }
`;
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

export const useInitializeNew = () => {
    const { fetchApp } = useDeviceSetting();
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const address = searchParams.get('address');

    const [createLog] = useMutation(CREATE_PLACE);
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const router = useRouter();

    // zustand
    const { files } = useSolPlaceNewStore();

    // 게시글 등록
    const onClickSubmit = async (data: newSchemaType) => {
        try {
            // 사진 업로드 후 url 받아오기
            const imagesUrls = await Promise.all(
                files.map(async (el) => {
                    const result = await uploadFile({ variables: { file: el } });
                    return result.data.uploadFile.url;
                }),
            );

            const result = await createLog({
                variables: {
                    createSolplaceLogInput: {
                        title: data.title,
                        contents: data.contents,
                        address: address,
                        lat: Number(lat),
                        lng: Number(lng),
                        images: imagesUrls.filter(Boolean),
                    },
                },
                refetchQueries: [{ query: FETCH_PLACES, variables: { page: 1 } }],
            });

            router.replace(`/solplace-logs/${result.data?.createSolplaceLog?.id}?new=true`);

            // 등록 완료 시, 알람 권한 요청
            await fetchApp({ query: 'requestDeviceNotificationsForPermissionSolplaceLogNewSet' });

            // 등록 완료 시, 알람 요청
            await fetchApp({
                query: 'createDeviceNotificationsForSolplaceLogNewSet',
                variables: { solplaceLogId: result.data.createSolplaceLog.id },
            });

            return true;
        } catch (error) {
            // UNAUTHENTICATED 에러 있으면 토스트 띄우지 않기
            if (
                error instanceof ApolloError &&
                error?.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED'
            ) {
                return false;
            }
            message.error((error as Error).message);
            return false;
        }
    };

    return {
        onClickSubmit,
    };
};
