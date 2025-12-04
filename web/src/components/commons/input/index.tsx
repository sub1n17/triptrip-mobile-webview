'use client';

import { useFormContext } from 'react-hook-form';
import style from './styles.module.css';

function InputBase({ ...rest }) {
    // const { register, formState } = useFormContext();
    // const error = formState.errors?.[rest.keyname]?.message?.toString();

    const formContext = useFormContext();
    const register = formContext?.register;
    const error = formContext?.formState?.errors?.[rest.keyname]?.message?.toString();

    // 지도 인풋

    return (
        <>
            {register ? (
                <input
                    type="text"
                    placeholder={rest.placeholder}
                    {...register(rest.keyname)}
                    className={rest.className}
                />
            ) : (
                <input type="text" className={rest.className} value={rest.value} readOnly></input>
            )}

            {error && <div className={style.error_txt}>{error}</div>}
        </>
    );
}

export function InputNormal(rest) {
    return <InputBase {...rest} className={style.input_normal}></InputBase>;
}

export function InputRound(rest) {
    return <InputBase {...rest} className={style.input_round}></InputBase>;
}

/* 
formState.errors는 객체라서 formState.errors.title = formState.errors['title']
    => formState.errors = {
            title: { message: "제목을 입력하세요" },
            contents: { message: "내용을 입력하세요" }
    }
*/
