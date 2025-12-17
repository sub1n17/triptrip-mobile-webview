'use client';

import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { newSchemaType } from './schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';

const UPLOAD_FILE = gql`
    mutation uploadFile($file: File) {
        uploadFile(file: "") {
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

interface useInitializeNewProps {
    file: File[];
}

export const useInitializeNew = ({ file }: useInitializeNewProps) => {
    const { fetchApp } = useDeviceSetting();
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const address = searchParams.get('address');

    const [createLog] = useMutation(CREATE_PLACE);
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const router = useRouter();

    // 로그인 등록
    const onClickSubmit = async (data: newSchemaType) => {
        // 사진 업로드 후 url 받아오기
        const imagesUrl = await Promise.all(
            file.map((el) => {
                uploadFile({ variables: { file: el } });
            })
        );

        const result = await createLog({
            variables: {
                createSolplaceLogInput: {
                    title: data.title,
                    contents: data.contents,
                    address: address,
                    lat: lat,
                    lng: lng,
                    images: imagesUrl,
                },
            },
        });

        // 등록 완료 시, 알람 권한 요청
        await fetchApp({ query: 'requestDeviceNotificationsForPermissionSolplaceLogNewSet' });

        // 등록 완료 시, 알람 요청
        await fetchApp({
            query: 'createDeviceNotificationsForSolplaceLogNewSet',
            variables: { solplaceLogId: result.data.createSolplaceLog.id },
        });
        router.push(`/solplace-logs/${result.data.createSolplaceLog.id}`);
    };

    return {
        onClickSubmit,
    };
};
