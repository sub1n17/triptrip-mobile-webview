import z from 'zod';

export type signUpSchemaType = z.infer<typeof signupSchema>;

export const signupSchema = z
    .object({
        email: z
            .string()
            .min(1, { message: '이메일을 입력해주세요.' })
            .email({ message: '이메일 형식이 올바르지 않습니다.' }),
        name: z.string().min(1, { message: '이름을 입력해주세요.' }),
        password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
        passwordCheck: z.string().min(1, { message: '비밀번호를 한번 더 입력해주세요.' }),
    })
    // refine : 객체 전체를 검사
    .refine((data) => data.password === data.passwordCheck, {
        message: '비밀번호가 일치하지 않습니다.',
        path: ['passwordCheck'],
    });
