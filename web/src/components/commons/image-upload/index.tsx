'use client';

import { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import style from './styles.module.css';
import { useSolPlaceNewStore } from '@/src/commons/stores/solplaceNew-store';
import { message } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useSolPlaceEditStore } from '@/src/commons/stores/solplaceEdit-store';

const imgSrc = {
    add_img: '/images/add_img.png',
    delete_img: '/images/imgCloseBtn.png',
};

interface ImageUploadProps {
    isEdit: boolean;
}

export default function ImageUpload({ isEdit }: ImageUploadProps) {
    const store = isEdit ? useSolPlaceEditStore : useSolPlaceNewStore;
    // zustand
    const { previewUrls, setPreviewUrls, files, setFiles, existingImages, setExistingImages } =
        store();

    // 이미지 추가하기
    const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file?.size > 5 * 1024 * 1024) {
            message.error('5MB 이하의 사진만 업로드 가능합니다.');
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                if (isEdit) {
                    setPreviewUrls((prev) => [...prev, result]);
                    setFiles((prev) => [...prev, file]); // 서버 업로드용
                } else {
                    setPreviewUrls((prev) => [...prev, result]); // 새 게시글 작성 시, 미리보기용
                    setFiles((prev) => [...prev, file]); // 새 게시글 작성 시, 서버 업로드용
                }
            }
        };
    };

    const fileRef = useRef<HTMLInputElement | null>(null);
    const onClickUploadImage = () => {
        if (!fileRef.current) return;
        fileRef.current.click();
    };

    // 이미지 삭제하기
    const onClickDelete = (index: number) => {
        if (isEdit) {
            setPreviewUrls(previewUrls.filter((_, i) => i !== index));
            // 삭제된 인덱스 제외하고 existingImages에 넣기
            setExistingImages(existingImages.filter((_, i) => i !== index));
        } else {
            setPreviewUrls(previewUrls.filter((_, i) => i !== index));
        }
        // 서버 업로드용 files도 같이 삭제
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <>
            <Swiper slidesPerView="auto" spaceBetween={12} freeMode className={style.img_wrapper}>
                {/* <div className={style.img_wrapper}> */}
                {/* 파일 인풋 */}
                <input
                    type="file"
                    onChange={onChangeFile}
                    style={{ display: 'none' }}
                    ref={fileRef}
                    accept="image/jpg, image/png"
                />
                <SwiperSlide className={style.slide}>
                    <Image
                        src={imgSrc.add_img}
                        alt="add_img"
                        width={100}
                        height={100}
                        onClick={onClickUploadImage}
                        style={{ flexShrink: 0 }}
                    ></Image>
                </SwiperSlide>

                {/* 기존 이미지 */}
                {isEdit &&
                    existingImages.map((el, index) => (
                        <SwiperSlide key={`exist-${index}`} className={style.slide}>
                            <div className={style.upload_img} key={`${el}_${index}`}>
                                <Image
                                    // "data:image/png;base64,AAA..."  => base64 미리보기
                                    // 사진 추가하면 base64 경로니까 el이 base64인지/서버 URL인지 구분
                                    src={
                                        el.startsWith('data:')
                                            ? el
                                            : `https://storage.googleapis.com/${el}`
                                    }
                                    alt="img"
                                    width={100}
                                    height={100}
                                    style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                                ></Image>
                                <button
                                    onClick={() => onClickDelete(index)}
                                    className={style.closeImg}
                                    type="button"
                                >
                                    <Image
                                        src={imgSrc.delete_img}
                                        alt="삭제"
                                        width={20}
                                        height={20}
                                    ></Image>
                                </button>
                            </div>
                        </SwiperSlide>
                    ))}

                {/* 새로 업로드한 이미지 */}
                {previewUrls.map((el, index) => (
                    <SwiperSlide key={`new-${index}`} className={style.slide}>
                        <div className={style.upload_img} key={`${el}_${index}`}>
                            <Image
                                src={el}
                                alt="img"
                                width={100}
                                height={100}
                                style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                            ></Image>
                            <button
                                onClick={() => onClickDelete(index)}
                                className={style.closeImg}
                                type="button"
                            >
                                <Image
                                    src={imgSrc.delete_img}
                                    alt="삭제"
                                    width={20}
                                    height={20}
                                ></Image>
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
                {/* </div> */}
            </Swiper>
        </>
    );
}
