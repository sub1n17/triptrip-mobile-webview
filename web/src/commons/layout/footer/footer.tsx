import { ButtonFull } from '@/src/components/commons/button';
import style from './styles.module.css';
import Navigation from '@/src/components/commons/navigation';

interface IFooterProps {
    text?: string;
    isPlace?: boolean;
}

export default function Footer({ text, isPlace }: IFooterProps) {
    return (
        <>
            <div className={style.footer_layer}></div>

            {!isPlace && (
                <div>
                    <ButtonFull text={text}></ButtonFull>
                </div>
            )}

            {isPlace && (
                <div className={style.isPlace_footer}>
                    <Navigation isPlace={isPlace}></Navigation>
                </div>
            )}
        </>
    );
}
