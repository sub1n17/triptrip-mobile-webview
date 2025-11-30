import style from './styles.module.css';

function ButtonBase({ text, onClick, className }) {
    return (
        <button onClick={onClick} className={className}>
            {text}
        </button>
    );
}

export function ButtonFull(props) {
    return <ButtonBase {...props} className={style.button_normal}></ButtonBase>;
}

export function ButtonSmall(props) {
    return <ButtonBase {...props}></ButtonBase>;
}

export function ButtonCircle(props) {
    return <ButtonBase {...props}></ButtonBase>;
}
