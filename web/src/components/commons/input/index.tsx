'use client';

import { useFormContext } from 'react-hook-form';
import style from './styles.module.css';
import { ChangeEvent } from 'react';

interface InputBaseProps {
    placeholder?: string;
    keyname?: string;
    className?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    type?: string;
}

function InputBase({
    placeholder,
    keyname,
    className,
    value,
    onChange,
    readOnly,
    type,
}: InputBaseProps) {
    // const { register, formState } = useFormContext();
    // const error = formState.errors?.[rest.keyname]?.message?.toString();

    const formContext = useFormContext();
    const register = formContext?.register;
    const error = keyname
        ? formContext?.formState?.errors?.[keyname]?.message?.toString()
        : undefined;

    return (
        <>
            <input
                type={!type ? 'text' : 'password'}
                placeholder={placeholder}
                {...(formContext && keyname ? register(keyname) : {})}
                className={className}
                value={value}
                onChange={onChange}
                readOnly={!formContext || !keyname ? readOnly : false}
            />

            {error && <div className={style.error_txt}>{error}</div>}
        </>
    );
}

export function InputNormal(rest: InputBaseProps) {
    return <InputBase {...rest} className={style.input_normal}></InputBase>;
}

export function InputRound(rest: InputBaseProps) {
    return <InputBase {...rest} className={style.input_round}></InputBase>;
}

/* 
formState.errors는 객체라서 formState.errors.title = formState.errors['title']
    => formState.errors = {
            title: { message: "제목을 입력하세요" },
            contents: { message: "내용을 입력하세요" }
    }
*/
