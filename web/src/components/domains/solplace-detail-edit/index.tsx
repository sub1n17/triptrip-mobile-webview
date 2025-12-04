'use client';

import style from '../solplace-new/styles.module.css';
import { InputNormal } from '@/src/components/commons/input';

import Form from '../../commons/form';
import { ButtonFull } from '../../commons/button';
import Textarea from '../../commons/textarea';
import Footer from '@/src/commons/layout/footer/footer';
import ImageUpload from '../../commons/image-upload';
import { AddressLink } from '../../commons/link';
import { editSchema } from './schema';
import { useInitializeEdit } from './form.initialize';

export default function SolPlaceDetailEdit() {
    const { onClickSubmit } = useInitializeEdit();

    return (
        <>
            <main className={style.container}>
                <Form
                    schema={editSchema}
                    onClickSubmit={onClickSubmit}
                    className={style.form_wrapper}
                >
                    <ImageUpload></ImageUpload>

                    <div>
                        <div className={style.form_title}>
                            플레이스 이름 <span>*</span>
                        </div>
                        <InputNormal
                            keyname={'title'}
                            placeholder={'플레이스 이름을 입력해 주세요. (1자 이상)'}
                        ></InputNormal>
                    </div>
                    <div>
                        <div className={style.form_title}>플레이스 주소</div>
                        <AddressLink href={''} linkText={'플레이스 주소 입력'}></AddressLink>
                    </div>
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
                    <Footer text={'수정'}></Footer>
                </Form>
            </main>
        </>
    );
}
