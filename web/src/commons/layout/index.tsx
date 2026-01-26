import { HeaderGlobal, HeaderLocal } from './header/header';
import style from './styles.module.css';

interface ILayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
    return (
        <>
            <div className={style.layout_wrapper}>
                <HeaderGlobal></HeaderGlobal>
                <HeaderLocal></HeaderLocal>
                <div
                    className={style.page_container}
                    // style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
