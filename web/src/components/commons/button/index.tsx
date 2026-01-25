'use client';

import style from './styles.module.css';

interface IButtonBaseProps {
    text?: string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

function ButtonBase({ text, onClick, className, children }: IButtonBaseProps) {
    return (
        <button onClick={onClick} className={className}>
            {children ?? text}
        </button>
    );
}

export function ButtonFull(props: IButtonBaseProps) {
    return <ButtonBase {...props} className={style.button_normal}></ButtonBase>;
}

export function ButtonSmall(props: IButtonBaseProps) {
    return <ButtonBase {...props}></ButtonBase>;
}

export function ButtonCircle(props: IButtonBaseProps) {
    return <ButtonBase {...props} className={style.button_circle}></ButtonBase>;
}
