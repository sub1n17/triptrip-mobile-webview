import { HeaderGlobal } from './header/header';
import style from './styles.module.css';

interface ILayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
    return (
        <>
            <div className={style.layout_wrapper}>
                <HeaderGlobal></HeaderGlobal>
                <>{children} </>
            </div>
        </>
    );
}
