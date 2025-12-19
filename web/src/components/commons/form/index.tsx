'use client';

import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IFormProps {
    children: React.ReactNode;
    schema: any;
    onClickSubmit: (data: any) => void;
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

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onClickSubmit)} className={className}>
                {children}
            </form>
        </FormProvider>
    );
}
