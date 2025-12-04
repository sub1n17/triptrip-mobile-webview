'use client';

import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { newSchemaType } from './schema';

export const useInitializeNew = () => {
    const { fetchApp } = useDeviceSetting();

    const onClickSubmit = async (data: newSchemaType) => {
        try {
            const result = await fetchApp('CreatePlace', data);
            alert(result?.data.CreatePlace.title);
        } catch {
            alert('에러가 발생하였습니다.');
        }
    };

    return {
        onClickSubmit,
    };
};
