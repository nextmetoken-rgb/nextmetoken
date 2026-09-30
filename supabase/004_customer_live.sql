-- Part 7 customer live-token access and withdrawal. Run after 003_owner_console.sql.
create or replace function public.customer_token_detail(p_token_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare t public.tokens; s public.sessions; q public.queues; ahead int; current_no int;
begin
  select * into t from public.tokens where id=p_token_id and user_id=auth.uid();
  if not found then return jsonb_build_object('result','missing'); end if;
  select * into s from public.sessions where id=t.session_id;
  select * into q from public.queues where id=s.queue_id;
  select count(*) into ahead from public.tokens x where x.session_id=t.session_id and x.status='waiting' and x.number<t.number;
  current_no:=s.current_number;
  return jsonb_build_object('result','ok','id',t.id,'number',t.number,'token_status',t.status,'display_name',t.display_name,
    'created_at',t.created_at,'called_at',t.called_at,'done_at',t.done_at,'eta_at_issue',t.eta_at_issue,
    'queue_id',q.id,'queue_name',q.name,'avg_time_min',q.avg_time_min,'session_id',s.id,'started_at',s.started_at,
    'ended_at',s.ended_at,'current_number',current_no,'ahead',ahead,'queue_status',q.status);
end $$;

create or replace function public.customer_token_people(p_token_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare t public.tokens; result jsonb;
begin
  select * into t from public.tokens where id=p_token_id and user_id=auth.uid();
  if not found then return jsonb_build_object('result','missing'); end if;
  select jsonb_build_object('result','ok','rows',coalesce(jsonb_agg(jsonb_build_object(
    'number',x.number,'display_name',x.display_name,'status',x.status,'is_walkin',x.is_walkin,'is_you',x.id=t.id
  ) order by x.number),'[]'::jsonb)) into result
  from public.tokens x where x.session_id=t.session_id and x.status in ('waiting','serving','left','removed','done');
  return result;
end $$;

create or replace function public.customer_withdraw_token(p_token_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare t public.tokens; s public.sessions; q public.queues;
begin
  select * into t from public.tokens where id=p_token_id and user_id=auth.uid() for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  if t.status not in ('waiting','serving') then return jsonb_build_object('result','not_active'); end if;
  update public.tokens set status='left' where id=t.id;
  select * into s from public.sessions where id=t.session_id;
  select * into q from public.queues where id=s.queue_id;
  insert into public.queue_events(queue_id,type,payload) values(q.id,'customer_left',jsonb_build_object('session_id',s.id,'token_id',t.id,'number',t.number));
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.issue_token(p_code text, p_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); q public.queues; s public.sessions; n text := btrim(coalesce(p_name, ''));
        existing uuid; issued int; num int; tid uuid; wait_min int;
begin
  if uid is null then return jsonb_build_object('result', 'auth'); end if;
  if char_length(n) < 2 or char_length(n) > 40 or n ~ '^\d+$' then return jsonb_build_object('result', 'name'); end if;
  if (select count(*) from public.tokens where user_id = uid and created_at > now() - interval '1 minute') >= 10 then return jsonb_build_object('result', 'rate'); end if;
  select * into q from public.queues where code=p_code and deleted_at is null for update;
  if not found then return jsonb_build_object('result','invalid'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1;
  if q.status='closed' or s.id is null then return jsonb_build_object('result','closed'); end if;
  select t.id into existing from public.tokens t where t.session_id=s.id and t.user_id=uid and t.status in ('waiting','serving') limit 1;
  if existing is not null then return jsonb_build_object('result','existing','token_id',existing); end if;
  if q.status='paused' then return jsonb_build_object('result','paused'); end if;
  select count(*) into issued from public.tokens t where t.session_id=s.id;
  if q.token_limit is not null and issued>=q.token_limit then return jsonb_build_object('result','limit'); end if;
  num:=q.next_number;
  wait_min:=greatest(3,coalesce(q.avg_time_min,3)*(select count(*)::int from public.tokens x where x.session_id=s.id and x.status in ('waiting','serving')));
  insert into public.tokens(session_id,user_id,number,display_name,eta_at_issue) values(s.id,uid,num,n,now()+make_interval(mins=>wait_min)) returning id into tid;
  update public.queues set next_number=num+1 where id=q.id;
  return jsonb_build_object('result','issued','token_id',tid,'number',num);
end $$;

create or replace function public.customer_my_tokens() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  select coalesce(jsonb_agg(public.customer_token_detail(t.id) order by
    case when t.status='serving' then 0 when t.status='waiting' then 1 else 2 end, t.number),'[]'::jsonb)
  into result from public.tokens t where t.user_id=auth.uid();
  return result;
end $$;

revoke all on function public.customer_token_detail(uuid),public.customer_token_people(uuid),public.customer_withdraw_token(uuid),public.customer_my_tokens() from public;
grant execute on function public.customer_token_detail(uuid),public.customer_token_people(uuid),public.customer_withdraw_token(uuid),public.customer_my_tokens() to authenticated;
