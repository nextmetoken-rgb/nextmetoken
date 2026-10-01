'use server';
import { randomBytes } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { toInt, validateAll, type QueueInput } from '@/lib/queueInput';

export type CreateResult = { id: string } | { error: 'invalid' | 'auth' | 'save' };

const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const makeCode = (len = 12) => Array.from(randomBytes(len), b => ALPHABET[b % ALPHABET.length]).join('');

export async function createQueueAction(input: QueueInput): Promise<CreateResult> {
  if (Object.keys(validateAll(input)).length > 0) return { error: 'invalid' };
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'auth' };

  const start = toInt(input.start) as number;
  const row = {
    owner_id: user.id,
    name: input.name.trim(),
    counter_name: input.counter.trim() || null,
    next_number: start,
    start_number: start,
    token_limit: input.noLimit ? null : toInt(input.limit),
    avg_time_mode: input.avgMode,
    avg_time_min: input.avgMode === 'manual' ? toInt(input.minutes) : null,
    status: 'live',
  };

  let queueId: string | null = null;
  for (let i = 0; i < 3 && !queueId; i++) {
    const { data, error } = await supabase.from('queues').insert({ ...row, code: makeCode() }).select('id').single();
    if (data) queueId = data.id;
    else if (error?.code !== '23505') return { error: 'save' };
  }
  if (!queueId) return { error: 'save' };

  const { error: sErr } = await supabase.from('sessions').insert({ queue_id: queueId, start_number: start, current_number: null });
  if (sErr) {
    await supabase.from('queues').delete().eq('id', queueId);
    return { error: 'save' };
  }
  return { id: queueId };
}
