'use client';

import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import Image from 'next/image';
import style from './styles.module.css';

const imgSrc = {
    add_img: '/images/add_img.png',
};

interface ImageUploadProps {
    setFile: Dispatch<SetStateAction<File[]>>;
}

export default function ImageUpload({ setFile }: ImageUploadProps) {
    // 미리보기용 이미지
    const [imgUrl, setImgUrl] = useState<string[]>([]);

    // 이미지 추가하기
    const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file?.size > 5 * 1024 * 1024) {
            alert('5MB 이하의 사진만 업로드 가능합니다.');
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                setImgUrl((prev) => [...prev, result]);
                setFile((prev) => [...prev, file]);
            }
        };
    };

    const fileRef = useRef<HTMLInputElement | null>(null);
    const onClickUploadImage = () => {
        if (!fileRef.current) return;
        fileRef.current.click();
    };

    return (
        <>
            <div className={style.img_wrapper}>
                <input
                    type="file"
                    onChange={onChangeFile}
                    style={{ display: 'none' }}
                    ref={fileRef}
                    accept="image/jpg, image/png"
                />
                <Image
                    src={imgSrc.add_img}
                    alt="add_img"
                    width={100}
                    height={100}
                    onClick={onClickUploadImage}
                    style={{ flexShrink: 0 }}
                ></Image>
                {imgUrl.map((el, index) => (
                    <div className={style.upload_img} key={`${el}_${index}`}>
                        <Image
                            src={imgUrl[index]}
                            alt="img"
                            width={100}
                            height={100}
                            style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                        ></Image>
                    </div>
                ))}
            </div>
        </>
    );
}
