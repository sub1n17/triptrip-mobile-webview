'use client';

import Image from 'next/image';
import style from './styles.module.css';
import Link from 'next/link';
import { InputNormal } from '@/src/components/commons/input';

import Form from '../../commons/form';
import { newSchema, newSchemaType } from './schema';
import { ButtonFull } from '../../commons/button';
import { useInitializeNew } from './form.initialize';
import Textarea from '../../commons/textarea';
import Footer from '@/src/commons/layout/footer/footer';
import ImageUpload from '../../commons/image-upload';

const imgSrc = {
    arr_left: '/icons/left_icon.png',
    arr_right: '/icons/right_icon.png',
    add_img: '/images/add_img.png',
};

export default function SolPlaceNew() {
    const { onClickSubmit } = useInitializeNew();

    return (
        <>
            <main className={style.container}>
                <Form<newSchemaType>
                    schema={newSchema}
                    onClickSubmit={onClickSubmit}
                    className={style.form_wrapper}
                >
                    {/* 사진 등록 */}
                    <ImageUpload></ImageUpload>
                    {/* <div className={style.img_wrapper}>
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
                    </div> */}
                    {/* 플레이스 이름 */}
                    <div>
                        <div className={style.form_title}>
                            플레이스 이름 <span>*</span>
                        </div>
                        <InputNormal
                            keyname={'title'}
                            placeholder={'플레이스 이름을 입력해 주세요. (1자 이상)'}
                        ></InputNormal>
                    </div>
                    {/* 플레이스 주소 */}
                    <div>
                        <div className={style.form_title}>플레이스 주소</div>
                        <Link href={''} className={style.address_button}>
                            <div className={style.address_txt}>플레이스 주소 입력</div>
                            <div className={style.icon_right}>
                                <Image src={imgSrc.arr_right} alt=" arr_right" fill></Image>
                            </div>
                        </Link>
                    </div>
                    {/* 플레이스 내용 */}
                    <div>
                        <div className={style.form_title}>
                            플레이스 내용 <span>*</span>
                        </div>

                        <Textarea
                            placeholder={'플레이스 내용을 입력해 주세요. (1자 이상)'}
                            keyname={'contents'}
                            className={style.form_textarea}
                        ></Textarea>
                    </div>
                </Form>
            </main>
            <Footer>
                <ButtonFull text={'로그 등록'} type="submit"></ButtonFull>
            </Footer>
        </>
    );
}
