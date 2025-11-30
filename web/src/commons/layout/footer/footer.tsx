import style from './styles.module.css';

interface IFooterProps {
    children: React.ReactNode;
}

export default function Footer({ children }: IFooterProps) {
    return (
        <>
            <div className={style.footer_layer}></div>
            <footer className={style.form_btn}>{children}</footer>
        </>
    );
}
