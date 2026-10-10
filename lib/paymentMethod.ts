export type PaymentInfo = { method: string | null; detail: string | null };

/** Razorpay payment entity se UPI / card / bank ka naam nikalta hai. */
export function describePayment(p: any): PaymentInfo {
  if (!p || typeof p !== 'object') return { method: null, detail: null };
  const method = typeof p.method === 'string' ? p.method : null;
  let detail: string | null = null;
  if (method === 'upi') detail = p.vpa || p.upi?.vpa || null;
  else if (method === 'card' && p.card) {
    const net = typeof p.card.network === 'string' ? p.card.network : '';
    detail = [net, p.card.last4 ? `••${p.card.last4}` : ''].filter(Boolean).join(' ') || null;
  } else if (method === 'netbanking') detail = p.bank || null;
  else if (method === 'wallet') detail = p.wallet || null;
  return { method, detail: detail ? String(detail).slice(0, 80) : null };
}

export async function fetchRazorpayPayment(paymentId: string, key: string, secret: string): Promise<PaymentInfo> {
  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` }, cache: 'no-store' });
    if (!res.ok) return { method: null, detail: null };
    return describePayment(await res.json());
  } catch { return { method: null, detail: null }; }
}
