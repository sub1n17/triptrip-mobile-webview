'use client';

import { useDeviceSetting } from '@/commons/settings/device-setting/hook';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Splash() {
    const router = useRouter();
    const { fetchApp } = useDeviceSetting();

    useEffect(() => {
        fetchApp({ query: 'setFullScreenLayout' }); // 풀스크린으로 전환

        return () => {
            fetchApp({ query: 'setDefaultLayout' }); // 기본 상태로 전환
        };
    }, [router]);

    return (
        <>
            <div
                style={{
                    height: '100vh',
                    position: 'relative',
                    marginInline: '-1.25rem',
                }}
            >
                <Image
                    src={'/images/splash1.png'}
                    alt="트립트립"
                    fill
                    style={{ objectFit: 'cover' }}
                    loading="eager"
                    sizes="430px"
                    priority
                ></Image>
            </div>
        </>
    );
}
