import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export async function POST(request:Request){
  const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:'login_required'},{status:401});
  let p:{razorpay_order_id?:string;razorpay_payment_id?:string;razorpay_signature?:string};try{p=await request.json()}catch{return NextResponse.json({error:'invalid'},{status:400})}
  if(!p.razorpay_order_id||!p.razorpay_payment_id||!p.razorpay_signature)return NextResponse.json({error:'invalid'},{status:400});
  const secret=process.env.RAZORPAY_KEY_SECRET,url=process.env.NEXT_PUBLIC_SUPABASE_URL,service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!secret||!url||!service)return NextResponse.json({error:'payments_not_configured'},{status:503});
  const expected=createHmac('sha256',secret).update(`${p.razorpay_order_id}|${p.razorpay_payment_id}`).digest();let received:Buffer;try{received=Buffer.from(p.razorpay_signature,'hex')}catch{return NextResponse.json({error:'signature_invalid'},{status:400})}
  if(received.length!==expected.length||!timingSafeEqual(received,expected))return NextResponse.json({error:'signature_invalid'},{status:400});
  const admin=createAdmin(url,service,{auth:{persistSession:false}});const {data:order}=await admin.from('payment_orders').select('owner_id').eq('razorpay_order_id',p.razorpay_order_id).maybeSingle();if(order?.owner_id!==user.id)return NextResponse.json({error:'order_forbidden'},{status:403});
  const {data,error}=await admin.rpc('mark_payment_success',{p_order_id:p.razorpay_order_id,p_payment_id:p.razorpay_payment_id});if(error||!['ok','duplicate'].includes(data?.result))return NextResponse.json({error:'credit_failed'},{status:500});return NextResponse.json({ok:true,result:data.result,days:data.days||0});
}
