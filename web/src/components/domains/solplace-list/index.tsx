import Image from 'next/image';
import style from './styles.module.css';
import Navigation from '../../commons/navigation';
import Footer from '@/src/commons/layout/footer/footer';

const mockData = [
    {
        image: '/images/placeExample01.png',
        title: 'Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample01.png',
        title: 'Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
];

const imgSrc = {
    location: '/icons/location.png',
    placeAdd: '/icons/place_add.png',
    footerLocation: '/icons/footer_location.png',
    footerMypage: '/icons/footer_mypage.png',
};

export default function SolPlaceList({ isPlace }) {
    return (
        <>
            <main className={style.place_list}>
                {mockData.map((el, index) => (
                    <button key={`${el}_${index}`} className={style.list_wrapper}>
                        <div className={style.place_img}>
                            <Image src={el.image} alt="img" fill></Image>
                        </div>

                        <div>
                            <div className={style.title}>{el.title} </div>
                            <div className={style.contents}>{el.contents} </div>
                        </div>
                        <div className={style.location_wrapper}>
                            <div className={style.location_img}>
                                <Image src={imgSrc.location} alt="location" fill></Image>
                            </div>
                            <div className={style.address}>{el.address} </div>
                        </div>
                    </button>
                ))}
            </main>
            <Footer isPlace={isPlace}></Footer>
        </>
    );
}
