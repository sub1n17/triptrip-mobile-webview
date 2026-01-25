import Image from 'next/image';
import style from './styles.module.css';
import Link from 'next/link';

const imgSrc = {
    locationActive: '/icons/nv_locationActive.png',
    location: '/icons/nv_location.png',
    mypageActive: '/icons/nv_myActive.png',
    mypage: '/icons/nv_my.png',
};

interface NavigationProps {
    active?: 'isPlace' | 'isMypage';
}

export default function Navigation({ active }: NavigationProps) {
    const isPlace = active === 'isPlace';
    const isMypage = active === 'isMypage';
    return (
        <div className={style.nav_wrapper}>
            {/* 플레이스 */}
            <Link href={'/solplace-logs'} className={style.nav_btn}>
                <div className={style.icon_img}>
                    <Image
                        src={isPlace ? imgSrc.locationActive : imgSrc.location}
                        alt={isPlace ? '플레이스 활성' : '플레이스 비활성'}
                        fill
                        sizes="24px"
                    ></Image>
                </div>
                <div className={isPlace ? style.navText_active : style.navText}>플레이스</div>
            </Link>

            {/* 내 설정 */}
            <Link href={'/mypage'} className={style.nav_btn}>
                <div className={style.icon_img}>
                    <Image
                        src={isMypage ? imgSrc.mypageActive : imgSrc.mypage}
                        alt={isMypage ? '마이페이지 비활성' : '마이페이지 활성'}
                        fill
                        sizes="24px"
                    ></Image>
                </div>
                <div className={isMypage ? style.navText_active : style.navText}>내 설정</div>
            </Link>
        </div>
    );
}
