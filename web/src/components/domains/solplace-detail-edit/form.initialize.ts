'use client';

import { editSchemaType } from './schema';

export const useInitializeEdit = () => {
    const onClickSubmit = (data: editSchemaType) => {
        console.log(data);
        alert('수정 완료');
    };
    return {
        onClickSubmit,
    };
};
