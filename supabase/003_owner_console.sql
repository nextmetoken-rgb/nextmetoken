-- Part 6: owner queue console. Run after 001_init.sql and 002_customer.sql.
-- All state-changing actions lock the queue/session row so concurrent taps cannot skip/duplicate numbers.

create or replace function public.owner_next(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions; cur public.tokens; nxt public.tokens; v int;
begin
  select * into q from public.queues where id = p_queue_id and owner_id = auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if not found then return jsonb_build_object('result','closed'); end if;
  if q.status='closed' then return jsonb_build_object('result','closed'); end if;

  select * into cur from public.tokens where session_id=s.id and status='serving' order by number limit 1 for update;
  select * into nxt from public.tokens where session_id=s.id and status='waiting' order by number limit 1 for update;
  if nxt.id is null then return jsonb_build_object('result','empty','current_number',s.current_number,'version',s.version); end if;

  if cur.id is not null then
    update public.tokens set status='done', done_at=now() where id=cur.id;
  end if;
  update public.tokens set status='serving', called_at=coalesce(called_at,now()) where id=nxt.id;
  v := s.version + 1;
  update public.sessions set current_number=nxt.number, version=v where id=s.id;
  insert into public.queue_events(queue_id,type,payload) values (q.id,'owner_next',jsonb_build_object('session_id',s.id,'from_id',cur.id,'to_id',nxt.id,'from_number',cur.number,'to_number',nxt.number,'version',v));
  return jsonb_build_object('result','ok','number',nxt.number,'token_id',nxt.id,'version',v);
end $$;

create or replace function public.owner_prev(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions; cur public.tokens; prev_t public.tokens; v int;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if not found then return jsonb_build_object('result','closed'); end if;
  select * into cur from public.tokens where session_id=s.id and status='serving' order by number limit 1 for update;
  if cur.id is null then return jsonb_build_object('result','empty'); end if;
  select * into prev_t from public.tokens where session_id=s.id and status='done' and number < cur.number order by number desc limit 1 for update;
  if prev_t.id is null then return jsonb_build_object('result','no_prev','current_number',s.current_number); end if;
  update public.tokens set status='waiting', called_at=null, done_at=null where id=cur.id;
  update public.tokens set status='serving', called_at=coalesce(called_at,now()), done_at=null where id=prev_t.id;
  v := s.version + 1;
  update public.sessions set current_number=prev_t.number, version=v where id=s.id;
  insert into public.queue_events(queue_id,type,payload) values (q.id,'owner_prev',jsonb_build_object('session_id',s.id,'from_id',cur.id,'to_id',prev_t.id,'from_number',cur.number,'to_number',prev_t.number,'version',v));
  return jsonb_build_object('result','ok','number',prev_t.number,'token_id',prev_t.id,'version',v);
end $$;

create or replace function public.owner_undo(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; e public.queue_events; p jsonb; s public.sessions; a text; from_id uuid; to_id uuid; cur public.tokens; prev_t public.tokens; v int;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into e from public.queue_events where queue_id=q.id and type in ('owner_next','owner_prev','owner_remove') order by created_at desc limit 1 for update;
  if not found or e.created_at < now() - interval '5 seconds' then return jsonb_build_object('result','stale'); end if;
  p := e.payload; a := e.type;
  select * into s from public.sessions where id=(p->>'session_id')::uuid and ended_at is null for update;
  if a='owner_remove' then
    select * into cur from public.tokens where id=(p->>'token_id')::uuid for update;
    if cur.id is null then return jsonb_build_object('result','stale'); end if;
    if p->>'old_status'='waiting' and (cur.status <> 'removed' or cur.hidden_for_owner <> true) then return jsonb_build_object('result','stale'); end if;
    if p->>'old_status'='left' and (cur.status <> 'left' or cur.hidden_for_owner <> true) then return jsonb_build_object('result','stale'); end if;
    update public.tokens set status=(p->>'old_status'), hidden_for_owner=(p->>'old_hidden')::boolean where id=cur.id;
    delete from public.queue_events where id=e.id;
    return jsonb_build_object('result','ok','number',cur.number);
  end if;
  if s.id is null then return jsonb_build_object('result','stale'); end if;
  from_id := nullif(p->>'from_id','')::uuid; to_id := nullif(p->>'to_id','')::uuid;
  if a='owner_next' then
    select * into cur from public.tokens where id=to_id for update;
    if cur.id is null or cur.status <> 'serving' then return jsonb_build_object('result','stale'); end if;
    if from_id is null then
      update public.tokens set status='waiting', called_at=null where id=to_id;
      v:=s.version+1; update public.sessions set current_number=null,version=v where id=s.id;
    else
      select * into prev_t from public.tokens where id=from_id for update;
      if prev_t.id is null or prev_t.status <> 'done' then return jsonb_build_object('result','stale'); end if;
      update public.tokens set status='serving', called_at=coalesce(called_at,now()), done_at=null where id=from_id;
      update public.tokens set status='waiting', called_at=null where id=to_id;
      v:=s.version+1; update public.sessions set current_number=prev_t.number,version=v where id=s.id;
    end if;
  else
    select * into cur from public.tokens where id=from_id for update;
    select * into prev_t from public.tokens where id=to_id for update;
    if cur.id is null or prev_t.id is null or cur.status <> 'waiting' or prev_t.status <> 'serving' then return jsonb_build_object('result','stale'); end if;
    update public.tokens set status='serving', called_at=coalesce(called_at,now()) where id=cur.id;
    update public.tokens set status='done', done_at=coalesce(done_at,now()) where id=prev_t.id;
    v:=s.version+1; update public.sessions set current_number=cur.number,version=v where id=s.id;
  end if;
  delete from public.queue_events where id=e.id;
  return jsonb_build_object('result','ok','number',(select current_number from public.sessions where id=s.id));
end $$;

create or replace function public.owner_walkin(p_queue_id uuid, p_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions; n text:=btrim(coalesce(p_name,'')); issued int; num int; tid uuid;
begin
  if char_length(n)<1 or char_length(n)>40 then return jsonb_build_object('result','name'); end if;
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  if q.status='paused' then return jsonb_build_object('result','paused'); end if;
  if q.status='closed' then return jsonb_build_object('result','closed'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if not found then return jsonb_build_object('result','closed'); end if;
  select count(*) into issued from public.tokens where session_id=s.id;
  if q.token_limit is not null and issued>=q.token_limit then return jsonb_build_object('result','limit'); end if;
  num:=q.next_number;
  insert into public.tokens(session_id,user_id,number,display_name,is_walkin) values(s.id,null,num,n,true) returning id into tid;
  update public.queues set next_number=num+1 where id=q.id;
  return jsonb_build_object('result','ok','number',num,'token_id',tid);
end $$;

create or replace function public.owner_remove(p_queue_id uuid, p_token_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; t public.tokens; s public.sessions; old_hidden boolean; old_status text; eid uuid;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into t from public.tokens where id=p_token_id for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  select * into s from public.sessions where id=t.session_id and queue_id=q.id and ended_at is null for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  if t.status not in ('waiting','left') then return jsonb_build_object('result','not_allowed'); end if;
  old_status:=t.status; old_hidden:=t.hidden_for_owner;
  if old_status='waiting' then update public.tokens set status='removed',hidden_for_owner=true,done_at=null where id=t.id;
  else update public.tokens set hidden_for_owner=true where id=t.id; end if;
  insert into public.queue_events(queue_id,type,payload) values(q.id,'owner_remove',jsonb_build_object('session_id',s.id,'token_id',t.id,'old_status',old_status,'old_hidden',old_hidden)) returning id into eid;
  return jsonb_build_object('result','ok','number',t.number,'event_id',eid);
end $$;

create or replace function public.owner_set_status(p_queue_id uuid, p_status text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues;
begin
  if p_status not in ('live','paused') then return jsonb_build_object('result','invalid'); end if;
  update public.queues set status=p_status where id=p_queue_id and owner_id=auth.uid() and deleted_at is null returning * into q;
  if q.id is null then return jsonb_build_object('result','forbidden'); end if;
  return jsonb_build_object('result','ok','status',q.status);
end $$;

create or replace function public.owner_end_day(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if s.id is not null then
    update public.tokens set status='expired' where session_id=s.id and status in ('waiting','serving');
    update public.sessions set ended_at=now(), current_number=null, version=version+1 where id=s.id;
  end if;
  update public.queues set status='closed' where id=q.id;
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.owner_restart(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions; new_s public.sessions;
begin
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if s.id is not null then update public.sessions set ended_at=now() where id=s.id; end if;
  insert into public.sessions(queue_id,start_number,current_number) values(q.id,q.start_number,null) returning * into new_s;
  update public.queues set status='live',next_number=q.start_number where id=q.id;
  return jsonb_build_object('result','ok','session_id',new_s.id);
end $$;

revoke all on function public.owner_next(uuid),public.owner_prev(uuid),public.owner_undo(uuid),public.owner_walkin(uuid,text),public.owner_remove(uuid,uuid),public.owner_set_status(uuid,text),public.owner_end_day(uuid),public.owner_restart(uuid) from public;
grant execute on function public.owner_next(uuid),public.owner_prev(uuid),public.owner_undo(uuid),public.owner_walkin(uuid,text),public.owner_remove(uuid,uuid),public.owner_set_status(uuid,text),public.owner_end_day(uuid),public.owner_restart(uuid) to authenticated;
