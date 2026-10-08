import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient as createAdmin } from '@supabase/supabase-js';
export const dynamic='force-dynamic';
export async function POST(request:Request){
  const secret=process.env.RAZORPAY_WEBHOOK_SECRET,url=process.env.NEXT_PUBLIC_SUPABASE_URL,service=process.env.SUPABASE_SERVICE_ROLE_KEY,signature=request.headers.get('x-razorpay-signature');if(!secret||!url||!service||!signature)return NextResponse.json({error:'not_configured'},{status:503});
  const raw=await request.text();const expected=createHmac('sha256',secret).update(raw).digest();let received:Buffer;try{received=Buffer.from(signature,'hex')}catch{return NextResponse.json({error:'invalid_signature'},{status:400})}if(received.length!==expected.length||!timingSafeEqual(received,expected))return NextResponse.json({error:'invalid_signature'},{status:400});
  const event=JSON.parse(raw);if(event.event==='payment.captured'||event.event==='order.paid'){const entity=event.payload?.payment?.entity||event.payload?.order?.entity;const orderId=entity?.order_id||entity?.id;const paymentId=event.payload?.payment?.entity?.id||`webhook_${orderId}`;if(orderId){const admin=createAdmin(url,service,{auth:{persistSession:false}});const {error}=await admin.rpc('mark_payment_success',{p_order_id:orderId,p_payment_id:paymentId});if(error)return NextResponse.json({error:'credit_failed'},{status:500})}}
  return NextResponse.json({ok:true});
}
