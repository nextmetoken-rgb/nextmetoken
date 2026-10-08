-- Part 5: customer scan + token. SQL Editor me poori file ek baar chalayein (001 ke baad).
-- queues table ka select sirf owner ke liye hi rehta hai (001 ki queues_owner policy). Customer ko code se
-- sirf neeche ke functions milte hain, isliye queue codes ki public listing nahi ho sakti.

-- Queue ki live halat (logged-out bhi dekh sakta hai). Sirf zaroori fields.
create or replace function public.queue_public(p_code text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare q public.queues; s public.sessions; serving int; issued int; waiting int; st text;
begin
  select * into q from public.queues where code = p_code and deleted_at is null;
  if not found then return jsonb_build_object('state', 'invalid'); end if;
  select * into s from public.sessions where queue_id = q.id and ended_at is null order by started_at desc limit 1;
  if q.status = 'closed' or s.id is null then return jsonb_build_object('state', 'closed', 'name', q.name, 'counter_name', q.counter_name); end if;
  select t.number into serving from public.tokens t where t.session_id = s.id and t.status = 'serving' limit 1;
  select count(*) into issued from public.tokens t where t.session_id = s.id;
  select count(*) into waiting from public.tokens t where t.session_id = s.id and t.status = 'waiting';
  st := case when q.token_limit is not null and issued >= q.token_limit then 'limit'
             when q.status = 'paused' then 'paused' else 'live' end;
  return jsonb_build_object('state', st, 'name', q.name, 'counter_name', q.counter_name, 'started_at', s.started_at,
    'serving', serving, 'next_number', q.next_number, 'waiting', waiting, 'avg_time_min', q.avg_time_min);
end $$;

-- Is user ka is queue me pehle se active token (waiting/serving)?
create or replace function public.my_active_token(p_code text) returns uuid
language sql stable security definer set search_path = '' as $$
  select t.id from public.tokens t
  join public.sessions s on s.id = t.session_id and s.ended_at is null
  join public.queues q on q.id = s.queue_id and q.code = p_code and q.deleted_at is null
  where t.user_id = auth.uid() and t.status in ('waiting', 'serving')
  order by t.created_at desc limit 1 $$;

-- Atomic token: queue row lock, isliye do phone ek saath scan karein toh alag number milta hai.
create or replace function public.issue_token(p_code text, p_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); q public.queues; s public.sessions; n text := btrim(coalesce(p_name, ''));
        existing uuid; issued int; num int; tid uuid;
begin
  if uid is null then return jsonb_build_object('result', 'auth'); end if;
  if char_length(n) < 2 or char_length(n) > 40 or n ~ '^\d+$' then return jsonb_build_object('result', 'name'); end if;
  if (select count(*) from public.tokens where user_id = uid and created_at > now() - interval '1 minute') >= 10 then
    return jsonb_build_object('result', 'rate');
  end if;
  select * into q from public.queues where code = p_code and deleted_at is null for update;
  if not found then return jsonb_build_object('result', 'invalid'); end if;
  select * into s from public.sessions where queue_id = q.id and ended_at is null order by started_at desc limit 1;
  if q.status = 'closed' or s.id is null then return jsonb_build_object('result', 'closed'); end if;
  select t.id into existing from public.tokens t where t.session_id = s.id and t.user_id = uid and t.status in ('waiting', 'serving') limit 1;
  if existing is not null then return jsonb_build_object('result', 'existing', 'token_id', existing); end if;
  if q.status = 'paused' then return jsonb_build_object('result', 'paused'); end if;
  select count(*) into issued from public.tokens t where t.session_id = s.id;
  if q.token_limit is not null and issued >= q.token_limit then return jsonb_build_object('result', 'limit'); end if;
  num := q.next_number;
  insert into public.tokens (session_id, user_id, number, display_name) values (s.id, uid, num, n) returning id into tid;
  update public.queues set next_number = num + 1 where id = q.id;
  return jsonb_build_object('result', 'issued', 'token_id', tid, 'number', num);
end $$;

revoke all on function public.queue_public(text), public.my_active_token(text), public.issue_token(text, text) from public;
grant execute on function public.queue_public(text) to anon, authenticated;
grant execute on function public.my_active_token(text), public.issue_token(text, text) to authenticated;
