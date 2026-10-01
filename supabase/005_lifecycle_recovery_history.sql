-- Part 8 lifecycle, recovery and owner history. Run after migrations 001-004.
alter table public.sessions add column if not exists deleted_at timestamptz;
alter table public.sessions add column if not exists purge_at timestamptz;
alter table public.users add column if not exists helper_tips_enabled boolean not null default false;
alter table public.users add column if not exists language text not null default 'hi';
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);
alter table public.feedback enable row level security;
create policy feedback_insert_own on public.feedback for insert to authenticated with check(user_id=auth.uid());

create table if not exists public.customer_history (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  queue_id uuid,
  queue_name text not null,
  session_id uuid,
  session_started_at timestamptz not null,
  session_ended_at timestamptz,
  number integer not null,
  display_name text not null,
  is_walkin boolean not null default false,
  status text not null,
  created_at timestamptz not null,
  called_at timestamptz,
  done_at timestamptz,
  eta_at_issue timestamptz,
  archived_at timestamptz not null default now()
);
create index if not exists customer_history_user_idx on public.customer_history(user_id, created_at desc);
alter table public.customer_history enable row level security;

create or replace function public.archive_customer_tokens(p_session_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare s public.sessions; q public.queues; t public.tokens;
begin
  select * into s from public.sessions where id=p_session_id;
  select * into q from public.queues where id=s.queue_id;
  if q.id is null then return; end if;
  for t in select * from public.tokens where session_id=s.id and user_id is not null loop
    insert into public.customer_history(id,user_id,queue_id,queue_name,session_id,session_started_at,session_ended_at,number,display_name,is_walkin,status,created_at,called_at,done_at,eta_at_issue)
    values(t.id,t.user_id,q.id,q.name,s.id,s.started_at,s.ended_at,t.number,t.display_name,t.is_walkin,t.status,t.created_at,t.called_at,t.done_at,t.eta_at_issue) on conflict(id) do nothing;
  end loop;
end $$;

create or replace function public.owner_end_day(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if s.id is not null then
    update public.tokens set status='expired' where session_id=s.id and status='waiting';
    update public.tokens set status='done', done_at=coalesce(done_at,now()) where session_id=s.id and status='serving';
    update public.sessions set ended_at=now(), current_number=null, version=version+1 where id=s.id;
  end if;
  update public.queues set status='closed' where id=q.id;
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.owner_restart(p_queue_id uuid, p_start_number integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions;
begin
  if p_start_number < 1 or p_start_number > 9999 then return jsonb_build_object('result','number'); end if;
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  if q.status <> 'closed' then return jsonb_build_object('result','not_closed'); end if;
  insert into public.sessions(queue_id,start_number,current_number) values(q.id,p_start_number,null) returning * into s;
  update public.queues set status='live',start_number=p_start_number,next_number=p_start_number where id=q.id;
  return jsonb_build_object('result','ok','session_id',s.id,'start_number',p_start_number);
end $$;

create or replace function public.owner_delete_queue(p_queue_id uuid, p_permanent boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  if p_permanent then
    if q.deleted_at is null then return jsonb_build_object('result','not_deleted'); end if;
    for s in select * from public.sessions where queue_id=q.id loop perform public.archive_customer_tokens(s.id); end loop;
    delete from public.queues where id=q.id;
  else
    update public.queues set deleted_at=now(),purge_at=now()+interval '72 hours',status='closed' where id=q.id;
    for s in select * from public.sessions where queue_id=q.id and ended_at is null for update loop
      update public.tokens set status='expired' where session_id=s.id and status='waiting';
      update public.tokens set status='done',done_at=coalesce(done_at,now()) where session_id=s.id and status='serving';
      update public.sessions set ended_at=now(),current_number=null,version=version+1 where id=s.id;
    end loop;
  end if;
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.owner_delete_history(p_session_id uuid, p_permanent boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare s public.sessions;
begin
  select * into s from public.sessions where id=p_session_id and public.owns_queue(queue_id) for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  if p_permanent then
    if s.deleted_at is null then return jsonb_build_object('result','not_deleted'); end if;
    perform public.archive_customer_tokens(s.id);
    delete from public.sessions where id=s.id;
  else
    update public.sessions set deleted_at=now(),purge_at=now()+interval '72 hours' where id=s.id;
  end if;
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.owner_recently_deleted() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  select jsonb_build_object('queues',coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'name',q.name,'deleted_at',q.deleted_at,'purge_at',q.purge_at,'kind','queue') order by q.deleted_at desc) from public.queues q where q.owner_id=auth.uid() and q.deleted_at is not null),'[]'::jsonb),
    'sessions',coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'queue_id',q.id,'name',q.name,'started_at',s.started_at,'ended_at',s.ended_at,'deleted_at',s.deleted_at,'purge_at',s.purge_at,'kind','history') order by s.deleted_at desc) from public.sessions s join public.queues q on q.id=s.queue_id where q.owner_id=auth.uid() and s.deleted_at is not null),'[]'::jsonb)) into result;
  return result;
end $$;

create or replace function public.owner_recover_item(p_item_id uuid, p_kind text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions;
begin
  if p_kind='queue' then
    update public.queues set deleted_at=null,purge_at=null,status='closed' where id=p_item_id and owner_id=auth.uid() and purge_at>now() returning * into q;
    if q.id is null then return jsonb_build_object('result','expired'); end if;
  elsif p_kind='history' then
    update public.sessions set deleted_at=null,purge_at=null where id=p_item_id and purge_at>now() and public.owns_queue(queue_id) returning * into s;
    if s.id is null then return jsonb_build_object('result','expired'); end if;
  else return jsonb_build_object('result','invalid'); end if;
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.owner_recover_queue_by_code(p_code text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues;
begin
  select * into q from public.queues where code=p_code and owner_id=auth.uid() for update;
  if not found then return jsonb_build_object('result','not_owner'); end if;
  if q.deleted_at is null then return jsonb_build_object('result','active','queue_id',q.id); end if;
  if q.purge_at<=now() then return jsonb_build_object('result','expired'); end if;
  update public.queues set deleted_at=null,purge_at=null,status='closed' where id=q.id;
  return jsonb_build_object('result','restored','queue_id',q.id);
end $$;

create or replace function public.owner_history(p_queue_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not exists(select 1 from public.queues where id=p_queue_id and owner_id=auth.uid()) then return jsonb_build_object('result','forbidden'); end if;
  select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'started_at',s.started_at,'ended_at',s.ended_at,
    'token_count',(select count(*) from public.tokens t where t.session_id=s.id),
    'avg_wait',(select coalesce(round(avg(extract(epoch from (t.called_at-t.created_at))/60)),0) from public.tokens t where t.session_id=s.id and t.called_at is not null)) order by s.started_at desc),'[]'::jsonb)
  into result from public.sessions s where s.queue_id=p_queue_id and s.ended_at is not null and s.deleted_at is null;
  return jsonb_build_object('result','ok','sessions',result);
end $$;

create or replace function public.owner_history_detail(p_session_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare s public.sessions; q public.queues; tokens jsonb; avg_wait numeric;
begin
  select * into s from public.sessions where id=p_session_id and public.owns_queue(queue_id) and deleted_at is null;
  if not found then return jsonb_build_object('result','missing'); end if;
  select * into q from public.queues where id=s.queue_id;
  select coalesce(jsonb_agg(jsonb_build_object('id',t.id,'number',t.number,'name',t.display_name,'status',t.status,'is_walkin',t.is_walkin,'created_at',t.created_at,'called_at',t.called_at,'done_at',t.done_at) order by t.number),'[]'::jsonb),
    coalesce(round(avg(extract(epoch from (t.called_at-t.created_at))/60) filter(where t.called_at is not null)),0)
  into tokens,avg_wait from public.tokens t where t.session_id=s.id;
  return jsonb_build_object('result','ok','queue_name',q.name,'session_id',s.id,'started_at',s.started_at,'ended_at',s.ended_at,'tokens',tokens,'token_count',jsonb_array_length(tokens),'avg_wait',avg_wait,'walkins',(select count(*) from public.tokens t where t.session_id=s.id and t.is_walkin));
end $$;

create or replace function public.purge_expired_items() returns integer
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions; t public.tokens; removed int:=0;
begin
  for q in select * from public.queues where deleted_at is not null and purge_at<=now() loop
    for s in select * from public.sessions where queue_id=q.id loop
      for t in select * from public.tokens where session_id=s.id and user_id is not null loop
        insert into public.customer_history(id,user_id,queue_id,queue_name,session_id,session_started_at,session_ended_at,number,display_name,is_walkin,status,created_at,called_at,done_at,eta_at_issue)
        values(t.id,t.user_id,q.id,q.name,s.id,s.started_at,s.ended_at,t.number,t.display_name,t.is_walkin,t.status,t.created_at,t.called_at,t.done_at,t.eta_at_issue) on conflict(id) do nothing;
      end loop;
    end loop;
    delete from public.queues where id=q.id;
    removed:=removed+1;
  end loop;
  for s in select * from public.sessions where deleted_at is not null and purge_at<=now() loop
    select * into q from public.queues where id=s.queue_id;
    if q.id is not null then
      for t in select * from public.tokens where session_id=s.id and user_id is not null loop
        insert into public.customer_history(id,user_id,queue_id,queue_name,session_id,session_started_at,session_ended_at,number,display_name,is_walkin,status,created_at,called_at,done_at,eta_at_issue)
        values(t.id,t.user_id,q.id,q.name,s.id,s.started_at,s.ended_at,t.number,t.display_name,t.is_walkin,t.status,t.created_at,t.called_at,t.done_at,t.eta_at_issue) on conflict(id) do nothing;
      end loop;
    end if;
    delete from public.sessions where id=s.id;
    removed:=removed+1;
  end loop;
  return removed;
end $$;

create or replace function public.owner_notification_targets(p_queue_id uuid,p_event_type text,p_token_id uuid default null) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not exists(select 1 from public.queues where id=p_queue_id and owner_id=auth.uid()) then return '[]'::jsonb; end if;
  select coalesce(jsonb_agg(jsonb_build_object('endpoint',ps.endpoint,'keys',ps.keys,'message',case
    when p_event_type='removed' then 'Owner ne aapko '||q.name||' ki line se hata diya'
    when p_event_type='paused' then q.name||' ki line ruki hai'
    when p_event_type='closed' then q.name||' ki line band ho gayi'
    when t.status='serving' then 'Aapki baari hai! Token '||t.number
    when (select count(*) from public.tokens x where x.session_id=t.session_id and x.status='waiting' and x.number<t.number)=0 then 'Aap agle hain: '||q.name
    when (select count(*) from public.tokens x where x.session_id=t.session_id and x.status='waiting' and x.number<t.number)=3 then '3 log baaki hain, taiyaar rahiye'
    else null end)),'[]'::jsonb) into result
  from public.sessions s join public.queues q on q.id=s.queue_id join public.tokens t on t.session_id=s.id
  join public.push_subscriptions ps on ps.user_id=t.user_id
  where q.id=p_queue_id and (s.ended_at is null or p_event_type='closed')
    and ((p_event_type='next' and t.status in ('waiting','serving'))
      or (p_event_type='paused' and t.status in ('waiting','serving'))
      or (p_event_type='closed' and t.status in ('expired','done'))
      or (p_event_type='removed' and t.id=p_token_id));
  return result;
end $$;

create or replace function public.customer_token_detail(p_token_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare t public.tokens; s public.sessions; q public.queues; h public.customer_history; ahead int;
begin
  select * into t from public.tokens where id=p_token_id and user_id=auth.uid();
  if found then
    select * into s from public.sessions where id=t.session_id;
    select * into q from public.queues where id=s.queue_id;
    select count(*) into ahead from public.tokens x where x.session_id=t.session_id and x.status='waiting' and x.number<t.number;
    return jsonb_build_object('result','ok','id',t.id,'number',t.number,'token_status',t.status,'display_name',t.display_name,'created_at',t.created_at,'called_at',t.called_at,'done_at',t.done_at,'eta_at_issue',t.eta_at_issue,'queue_id',q.id,'queue_name',q.name,'avg_time_min',q.avg_time_min,'session_id',s.id,'started_at',s.started_at,'ended_at',s.ended_at,'current_number',s.current_number,'ahead',ahead,'queue_status',q.status);
  end if;
  select * into h from public.customer_history where id=p_token_id and user_id=auth.uid();
  if not found then return jsonb_build_object('result','missing'); end if;
  return jsonb_build_object('result','ok','id',h.id,'number',h.number,'token_status',h.status,'display_name',h.display_name,'created_at',h.created_at,'called_at',h.called_at,'done_at',h.done_at,'eta_at_issue',h.eta_at_issue,'queue_id',h.queue_id,'queue_name',h.queue_name,'session_id',h.session_id,'started_at',h.session_started_at,'ended_at',h.session_ended_at,'current_number',null,'ahead',0,'queue_status','closed');
end $$;

create or replace function public.customer_my_tokens() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  select coalesce(jsonb_agg(x.item order by x.created_at desc),'[]'::jsonb) into result from (
    select public.customer_token_detail(t.id) as item,t.created_at from public.tokens t where t.user_id=auth.uid()
    union all select public.customer_token_detail(h.id),h.created_at from public.customer_history h where h.user_id=auth.uid()
  ) x;
  return result;
end $$;

revoke all on function public.owner_end_day(uuid),public.owner_restart(uuid,integer),public.owner_delete_queue(uuid,boolean),public.owner_delete_history(uuid,boolean),public.owner_recently_deleted(),public.owner_recover_item(uuid,text),public.owner_recover_queue_by_code(text),public.owner_history(uuid),public.owner_history_detail(uuid),public.purge_expired_items() from public;
revoke all on function public.archive_customer_tokens(uuid) from public;
grant execute on function public.owner_end_day(uuid),public.owner_restart(uuid,integer),public.owner_delete_queue(uuid,boolean),public.owner_delete_history(uuid,boolean),public.owner_recently_deleted(),public.owner_recover_item(uuid,text),public.owner_recover_queue_by_code(text),public.owner_history(uuid),public.owner_history_detail(uuid),public.owner_notification_targets(uuid,text,uuid) to authenticated;
grant execute on function public.purge_expired_items() to authenticated;
revoke all on function public.customer_token_detail(uuid),public.customer_my_tokens() from public;
grant execute on function public.customer_token_detail(uuid),public.customer_my_tokens() to authenticated;

do $$
begin
  execute 'create extension if not exists pg_cron';
  if exists(select 1 from pg_namespace where nspname='cron') then
    execute 'select cron.unschedule(jobid) from cron.job where jobname = ''tokenapp-purge-expired''';
    execute 'select cron.schedule(''tokenapp-purge-expired'',''0 * * * *'',''select public.purge_expired_items()'')';
  end if;
exception when others then
  raise notice 'Hourly purge schedule was not enabled: %', sqlerrm;
end $$;
