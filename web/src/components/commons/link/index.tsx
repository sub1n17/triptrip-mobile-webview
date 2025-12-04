import Link from 'next/link';
import Image from 'next/image';
import style from './styles.module.css';

const imgSrc = {
    arr_right: '/icons/right_icon.png',
};

function LinkBase({ linkText, href }) {
    return (
        <>
            <Link href={href} className={style.address_button}>
                <div className={style.address_txt}>{linkText}</div>
                <div className={style.icon_right}>
                    <Image src={imgSrc.arr_right} alt=" arr_right" fill></Image>
                </div>
            </Link>
        </>
    );
}

export function AddressLink(props) {
    return <LinkBase {...props}></LinkBase>;
}
