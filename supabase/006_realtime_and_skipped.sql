-- Part 11: Realtime publication, coach-mark flags and skipped-token recovery.
-- Run after 001-005. Safe to rerun on an existing project.
alter table public.users add column if not exists coachmarks_seen jsonb not null default '{}'::jsonb;
alter table public.users add column if not exists helper_tips_enabled boolean not null default false;
alter table public.tokens drop constraint if exists tokens_status_check;
alter table public.tokens add constraint tokens_status_check
  check (status in ('waiting','serving','done','left','removed','expired','skipped'));

alter table public.tokens replica identity full;
alter table public.sessions replica identity full;
do $$
begin
  if not exists (select 1 from pg_publication where pubname='supabase_realtime') then
    execute 'create publication supabase_realtime';
  end if;
  if exists (select 1 from pg_publication where pubname='supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='tokens') then
      alter publication supabase_realtime add table public.tokens;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='sessions') then
      alter publication supabase_realtime add table public.sessions;
    end if;
  end if;
end $$;

create or replace function public.owner_skip(p_queue_id uuid, p_token_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare q public.queues; s public.sessions; cur public.tokens; nxt public.tokens; eid uuid; v int;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found or q.status='closed' then return jsonb_build_object('result','forbidden'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if not found then return jsonb_build_object('result','closed'); end if;
  select * into cur from public.tokens where id=p_token_id and session_id=s.id and status='serving' for update;
  if not found then return jsonb_build_object('result','stale'); end if;
  select * into nxt from public.tokens where session_id=s.id and status='waiting' order by number limit 1 for update;
  update public.tokens set status='skipped' where id=cur.id;
  if nxt.id is not null then update public.tokens set status='serving',called_at=coalesce(called_at,now()) where id=nxt.id; end if;
  v:=s.version+1;
  update public.sessions set current_number=nxt.number,version=v where id=s.id;
  insert into public.queue_events(queue_id,type,payload) values(q.id,'owner_skip',jsonb_build_object('session_id',s.id,'from_id',cur.id,'to_id',nxt.id,'from_number',cur.number,'to_number',nxt.number,'version',v)) returning id into eid;
  return jsonb_build_object('result','ok','number',nxt.number,'event_id',eid);
end $$;

create or replace function public.owner_undo(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare q public.queues; e public.queue_events; p jsonb; s public.sessions; a text; from_id uuid; to_id uuid; cur public.tokens; prev_t public.tokens; v int;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into e from public.queue_events where queue_id=q.id and type in ('owner_next','owner_prev','owner_remove','owner_skip','owner_walkin') order by created_at desc limit 1 for update;
  if not found or e.created_at < now() - interval '5 seconds' then return jsonb_build_object('result','stale'); end if;
  p:=e.payload; a:=e.type;
  if a='owner_walkin' then return jsonb_build_object('result','stale'); end if;
  select * into s from public.sessions where id=(p->>'session_id')::uuid and ended_at is null for update;
  if a='owner_remove' then
    select * into cur from public.tokens where id=(p->>'token_id')::uuid for update;
    if cur.id is null then return jsonb_build_object('result','stale'); end if;
    if p->>'old_status'='waiting' and (cur.status<>'removed' or not cur.hidden_for_owner) then return jsonb_build_object('result','stale'); end if;
    if p->>'old_status'='left' and (cur.status<>'left' or not cur.hidden_for_owner) then return jsonb_build_object('result','stale'); end if;
    update public.tokens set status=(p->>'old_status'),hidden_for_owner=(p->>'old_hidden')::boolean where id=cur.id;
    delete from public.queue_events where id=e.id;
    return jsonb_build_object('result','ok','number',cur.number);
  end if;
  if s.id is null then return jsonb_build_object('result','stale'); end if;
  from_id:=nullif(p->>'from_id','')::uuid; to_id:=nullif(p->>'to_id','')::uuid;
  if a='owner_skip' then
    select * into cur from public.tokens where id=from_id for update;
    if cur.id is null or cur.status<>'skipped' then return jsonb_build_object('result','stale'); end if;
    if to_id is not null then
      select * into prev_t from public.tokens where id=to_id for update;
      if prev_t.id is null or prev_t.status<>'serving' then return jsonb_build_object('result','stale'); end if;
      update public.tokens set status='waiting',called_at=null where id=prev_t.id;
    elsif exists(select 1 from public.tokens where session_id=s.id and status='serving') then
      return jsonb_build_object('result','stale');
    end if;
    update public.tokens set status='serving' where id=cur.id;
    v:=s.version+1; update public.sessions set current_number=cur.number,version=v where id=s.id;
  elsif a='owner_next' then
    select * into cur from public.tokens where id=to_id for update;
    if cur.id is null or cur.status<>'serving' then return jsonb_build_object('result','stale'); end if;
    if from_id is null then
      update public.tokens set status='waiting',called_at=null where id=to_id;
      v:=s.version+1; update public.sessions set current_number=null,version=v where id=s.id;
    else
      select * into prev_t from public.tokens where id=from_id for update;
      if prev_t.id is null or prev_t.status<>'done' then return jsonb_build_object('result','stale'); end if;
      update public.tokens set status='serving',called_at=coalesce(called_at,now()),done_at=null where id=from_id;
      update public.tokens set status='waiting',called_at=null where id=to_id;
      v:=s.version+1; update public.sessions set current_number=prev_t.number,version=v where id=s.id;
    end if;
  else
    select * into cur from public.tokens where id=from_id for update;
    select * into prev_t from public.tokens where id=to_id for update;
    if cur.id is null or prev_t.id is null or cur.status<>'waiting' or prev_t.status<>'serving' then return jsonb_build_object('result','stale'); end if;
    update public.tokens set status='serving',called_at=coalesce(called_at,now()) where id=cur.id;
    update public.tokens set status='done',done_at=coalesce(done_at,now()) where id=prev_t.id;
    v:=s.version+1; update public.sessions set current_number=cur.number,version=v where id=s.id;
  end if;
  delete from public.queue_events where id=e.id;
  return jsonb_build_object('result','ok','number',(select current_number from public.sessions where id=s.id));
end $$;

create or replace function public.rejoin_last(p_token_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid:=auth.uid(); t public.tokens; s public.sessions; q public.queues; active_id uuid; n int; issued int;
begin
  if uid is null then return jsonb_build_object('result','auth'); end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
  if (select count(*) from public.tokens where user_id=uid and created_at>now()-interval '1 minute')>=5 then return jsonb_build_object('result','rate'); end if;
  select * into t from public.tokens where id=p_token_id and user_id=uid and status='skipped' for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  select * into s from public.sessions where id=t.session_id for update;
  select * into q from public.queues where id=s.queue_id and deleted_at is null for update;
  if not found or s.ended_at is not null or q.status='closed' then return jsonb_build_object('result','closed'); end if;
  if q.status='paused' then return jsonb_build_object('result','paused'); end if;
  select id into active_id from public.tokens where user_id=uid and status in ('waiting','serving') and session_id in (select id from public.sessions where queue_id=q.id and ended_at is null) limit 1;
  if active_id is not null then return jsonb_build_object('result','active','token_id',active_id); end if;
  select count(*) into issued from public.tokens where session_id=s.id;
  if q.token_limit is not null and issued>=q.token_limit then return jsonb_build_object('result','limit'); end if;
  n:=q.next_number;
  update public.tokens set number=n,status='waiting',created_at=now(),called_at=null,done_at=null where id=t.id;
  update public.queues set next_number=n+1 where id=q.id;
  return jsonb_build_object('result','ok','number',n,'token_id',t.id);
end $$;

create or replace function public.customer_withdraw_token(p_token_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare t public.tokens; s public.sessions; q public.queues;
begin
  select * into t from public.tokens where id=p_token_id and user_id=auth.uid() for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  if t.status not in ('waiting','serving','skipped') then return jsonb_build_object('result','not_active'); end if;
  update public.tokens set status='left' where id=t.id;
  select * into s from public.sessions where id=t.session_id;
  select * into q from public.queues where id=s.queue_id;
  insert into public.queue_events(queue_id,type,payload) values(q.id,'customer_left',jsonb_build_object('session_id',s.id,'token_id',t.id,'number',t.number));
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.customer_token_people(p_token_id uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare t public.tokens; result jsonb;
begin
  select * into t from public.tokens where id=p_token_id and user_id=auth.uid();
  if not found then return jsonb_build_object('result','missing'); end if;
  select jsonb_build_object('result','ok','rows',coalesce(jsonb_agg(jsonb_build_object(
    'number',x.number,'display_name',x.display_name,'status',x.status,'is_walkin',x.is_walkin,'is_you',x.id=t.id
  ) order by x.number),'[]'::jsonb)) into result
  from public.tokens x where x.session_id=t.session_id and x.status in ('waiting','serving','left','removed','done','expired','skipped');
  return result;
end $$;

create or replace function public.issue_token(p_code text,p_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid:=auth.uid(); q public.queues; s public.sessions; n text:=btrim(coalesce(p_name,'')); existing uuid; issued int; num int; tid uuid; wait_min int;
begin
  if uid is null then return jsonb_build_object('result','auth'); end if;
  if char_length(n)<2 or char_length(n)>40 or n~'^\d+$' then return jsonb_build_object('result','name'); end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
  if (select count(*) from public.tokens where user_id=uid and created_at>now()-interval '1 minute')>=5 then return jsonb_build_object('result','rate'); end if;
  select * into q from public.queues where code=p_code and deleted_at is null for update;
  if not found then return jsonb_build_object('result','invalid'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1;
  if q.status='closed' or s.id is null then return jsonb_build_object('result','closed'); end if;
  select id into existing from public.tokens where session_id=s.id and user_id=uid and status in ('waiting','serving') limit 1;
  if existing is not null then return jsonb_build_object('result','existing','token_id',existing); end if;
  if q.status='paused' then return jsonb_build_object('result','paused'); end if;
  select count(*) into issued from public.tokens where session_id=s.id;
  if q.token_limit is not null and issued>=q.token_limit then return jsonb_build_object('result','limit'); end if;
  num:=q.next_number;
  wait_min:=greatest(3,coalesce(q.avg_time_min,3)*(select count(*)::int from public.tokens where session_id=s.id and status in ('waiting','serving')));
  insert into public.tokens(session_id,user_id,number,display_name,eta_at_issue) values(s.id,uid,num,n,now()+make_interval(mins=>wait_min)) returning id into tid;
  update public.queues set next_number=num+1 where id=q.id;
  return jsonb_build_object('result','issued','token_id',tid,'number',num);
end $$;

create or replace function public.owner_walkin(p_queue_id uuid,p_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare q public.queues; s public.sessions; n text:=btrim(coalesce(p_name,'')); issued int; num int; tid uuid; recent int;
begin
  if char_length(n)<1 or char_length(n)>40 then return jsonb_build_object('result','name'); end if;
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select count(*) into recent from public.queue_events where queue_id=q.id and type='owner_walkin' and created_at>now()-interval '1 minute';
  if recent>=5 then return jsonb_build_object('result','rate'); end if;
  if q.status='paused' then return jsonb_build_object('result','paused'); end if;
  if q.status='closed' then return jsonb_build_object('result','closed'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if not found then return jsonb_build_object('result','closed'); end if;
  select count(*) into issued from public.tokens where session_id=s.id;
  if q.token_limit is not null and issued>=q.token_limit then return jsonb_build_object('result','limit'); end if;
  num:=q.next_number;
  insert into public.tokens(session_id,user_id,number,display_name,is_walkin) values(s.id,null,num,n,true) returning id into tid;
  update public.queues set next_number=num+1 where id=q.id;
  insert into public.queue_events(queue_id,type,payload) values(q.id,'owner_walkin',jsonb_build_object('session_id',s.id,'token_id',tid));
  return jsonb_build_object('result','ok','number',num,'token_id',tid);
end $$;

create or replace function public.owner_resume_queue(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare q public.queues; s public.sessions;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into s from public.sessions where queue_id=q.id order by started_at desc limit 1 for update;
  if not found or not exists(select 1 from public.tokens where session_id=s.id and status in ('waiting','serving')) then
    return jsonb_build_object('result','no_remaining');
  end if;
  update public.sessions set ended_at=null,version=version+1 where id=s.id;
  update public.queues set status='live' where id=q.id;
  return jsonb_build_object('result','ok','session_id',s.id);
end $$;

revoke all on function public.owner_skip(uuid,uuid),public.owner_undo(uuid),public.rejoin_last(uuid),public.owner_resume_queue(uuid) from public,anon;
grant execute on function public.owner_skip(uuid,uuid),public.owner_undo(uuid),public.owner_resume_queue(uuid) to authenticated;
grant execute on function public.rejoin_last(uuid),public.customer_withdraw_token(uuid),public.issue_token(text,text),public.owner_walkin(uuid,text) to authenticated;
