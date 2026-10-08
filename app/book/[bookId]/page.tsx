import { notFound,redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export default async function BookPage({params}:{params:{bookId:string}}){const {data,error}=await createClient().rpc('queue_book_public',{p_book_id:params.bookId});if(error||data?.result!=='ok')notFound();redirect(`/q/${data.code}`)}
