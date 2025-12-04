import Image from 'next/image';
import style from './styles.module.css';

const imgSrc = {
    locationActive: '/icons/nv_locationActive.png',
    location: '/icons/nv_location.png',
    mypageActive: '/icons/nv_myActive.png',
    mypage: '/icons/nv_my.png',
};

export default function Navigation({ isPlace }) {
    return (
        <div className={style.nav_wrapper}>
            {/* 플레이스 */}
            <button className={style.nav_btn}>
                <div className={style.icon_img}>
                    <Image
                        src={isPlace ? imgSrc.locationActive : imgSrc.location}
                        alt={isPlace ? '플레이스 활성' : '플레이스 비활성'}
                        fill
                    ></Image>
                </div>
                <div className={isPlace ? style.navText_active : style.navText}>플레이스</div>
            </button>

            {/* 내 설정 */}
            <button className={style.nav_btn}>
                <div className={style.icon_img}>
                    <Image
                        src={isPlace ? imgSrc.mypage : imgSrc.mypageActive}
                        alt={isPlace ? '마이페이지 비활성' : '마이페이지 활성'}
                        fill
                    ></Image>
                </div>
                <div className={isPlace ? style.navText : style.navText_active}>내 설정</div>
            </button>
        </div>
    );
}
