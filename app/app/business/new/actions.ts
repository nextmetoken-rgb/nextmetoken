'use server';
import { createClient } from '@/lib/supabase/server';
import { toInt, validateAll, type QueueInput } from '@/lib/queueInput';

export type CreateResult = { id: string } | { error: 'invalid' | 'auth' | 'save' | 'exists' | 'book_taken' };
export async function createQueueAction(input: QueueInput, bookId: string): Promise<CreateResult> {
  if (Object.keys(validateAll(input)).length > 0) return { error: 'invalid' };
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'auth' };

  const { data, error } = await supabase.rpc('create_business_queue', {
    p_name: input.name.trim(), p_book_id: bookId.trim().toLowerCase(),
    p_token_limit: input.noLimit ? null : toInt(input.limit), p_avg_mode: input.avgMode,
    p_avg_minutes: input.avgMode === 'manual' ? toInt(input.minutes) : null, p_start: toInt(input.start),
  });
  if (error || !data) return { error: 'save' };
  if (data.result === 'ok' && data.queue_id) return { id: data.queue_id };
  if (data.result === 'invalid') return { error: 'invalid' };
  if (data.result === 'exists') return { error: 'exists' };
  if (data.result === 'book_taken') return { error: 'book_taken' };
  return { error: 'save' };
}
