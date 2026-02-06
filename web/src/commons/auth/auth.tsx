'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import UseAuth from './useAuth';

const notCheck = ['/login', '/signup', '/'];

export default function Auth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { checkToken } = UseAuth();

    // 토큰 유효성 검증 중인 상태
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // 로그인, 회원가입, 스플래시 페이지에서는 중복으로 토큰 체크하지 않기
        if (notCheck.includes(pathname)) {
            setChecked(true);
            return;
        }

        const verify = async () => {
            const isValid = await checkToken();
            if (!isValid) {
                router.replace('/login'); // 토큰 유효 X → 로그인페이지로 이동
                return;
            }
            setChecked(true);
        };

        verify();
    }, [pathname]);
    if (!checked) return null;
    return <>{children}</>;
}
