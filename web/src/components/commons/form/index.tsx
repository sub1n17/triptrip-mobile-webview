'use client';

import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IFormProps {
    children: React.ReactNode;
    schema: any;
    onClickSubmit: (data: any) => Promise<boolean>;
    className?: string;
    defaultValues?: any;
}

export default function Form<T extends FieldValues>({
    children,
    schema,
    onClickSubmit,
    className,
    defaultValues,
}: IFormProps) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues,
    });

    const handleSubmit = async (data: T) => {
        const isSuccess = await onClickSubmit(data); // props로 받은 onclick함수 실행시키기
        if (isSuccess) {
            methods.reset(); // ✅ 성공했을 때만 초기화
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className={className}>
                {children}
            </form>
        </FormProvider>
    );
}
