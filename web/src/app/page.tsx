import { redirect } from 'next/navigation';

export default function Home() {
    // return <div>첫 페이지</div>;

    redirect('/splash');
}
