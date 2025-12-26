import { ButtonFull } from '@/src/components/commons/button';
import style from './styles.module.css';
import Navigation from '@/src/components/commons/navigation';
import Link from 'next/link';

interface IFooterProps {
    text?: string;
    isLogin?: boolean;
    navActive?: string;
}

export default function Footer({ text, isLogin, navActive }: IFooterProps) {
    return (
        <>
            <div className={style.footer_layer}></div>

            {/* 기본 버튼 */}
            {!navActive && !isLogin && (
                <div>
                    <ButtonFull text={text}></ButtonFull>
                </div>
            )}

            {/* 로그인 */}
            {!navActive && isLogin && (
                <div>
                    <ButtonFull text={text}></ButtonFull>
                    <Link href="/signup" className={style.signup_link}>
                        회원가입
                    </Link>
                </div>
            )}

            {/* 네비게이션 */}
            {navActive && (
                <div className={style.isPlace_footer}>
                    <Navigation active={navActive}></Navigation>
                </div>
            )}
        </>
    );
}
