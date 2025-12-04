import z from 'zod';

export type editSchemaType = z.infer<typeof editSchema>;

export const editSchema = z.object({
    title: z.string().min(1, { message: '플레이스 이름을 입력해주세요.' }),
    contents: z.string().min(1, { message: '플레이스 내용을 입력해주세요.' }),
});
