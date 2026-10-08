import { NextResponse } from 'next/server';
import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export async function POST(request:Request){
  const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:'login_required'},{status:401});
  let amount:number;try{amount=Number((await request.json()).amount)}catch{return NextResponse.json({error:'invalid_amount'},{status:400})}
  if(!Number.isInteger(amount)||amount<10||amount>500)return NextResponse.json({error:'amount_must_be_10_to_500'},{status:400});
  const {data:queue,error:qerr}=await db.from('queues').select('id').eq('owner_id',user.id).is('deleted_at',null).order('created_at',{ascending:true}).limit(1).maybeSingle();if(qerr||!queue)return NextResponse.json({error:'business_missing'},{status:404});
  const key=process.env.RAZORPAY_KEY_ID,secret=process.env.RAZORPAY_KEY_SECRET,url=process.env.NEXT_PUBLIC_SUPABASE_URL,service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!key||!secret||!url||!service)return NextResponse.json({error:'payments_not_configured'},{status:503});
  const orderRes=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{authorization:`Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`,'content-type':'application/json'},body:JSON.stringify({amount:amount*100,currency:'INR',receipt:`tok_${crypto.randomUUID().replaceAll('-','').slice(0,24)}`,notes:{queue_id:queue.id,owner_id:user.id}}),cache:'no-store'});
  const order=await orderRes.json();if(!orderRes.ok||!order.id)return NextResponse.json({error:'gateway_order_failed'},{status:502});
  const admin=createAdmin(url,service,{auth:{persistSession:false}});const {error}=await admin.from('payment_orders').insert({owner_id:user.id,queue_id:queue.id,amount_paise:amount*100,razorpay_order_id:order.id});if(error)return NextResponse.json({error:'order_record_failed'},{status:500});
  return NextResponse.json({orderId:order.id,amount:order.amount,currency:order.currency,keyId:key});
}
