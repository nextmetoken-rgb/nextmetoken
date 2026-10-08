-- Business model, Book ID lookup, day entitlement, owner settings and verified payments.
-- Run after migrations 001-008. All monetary credits are applied by a server-only RPC after gateway signature verification.

alter table public.queues
  add column if not exists book_id text,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists paid_days integer not null default 0,
  add column if not exists test_days integer not null default 0,
  add column if not exists balance_last_charged_on date,
  add column if not exists intake_enabled boolean not null default true,
  add column if not exists announcement_enabled boolean not null default true,
  add column if not exists announcement_repeat_count integer not null default 1,
  add column if not exists sound_box_enabled boolean not null default false;

-- Repair missing, malformed, or duplicate IDs before adding the constraints.
-- Long or non-Latin names are reduced to a safe ASCII slug; the ID suffix keeps it unique.
update public.queues q
set book_id = coalesce(
  nullif(left(trim(both '-' from lower(regexp_replace(q.name,'[^a-zA-Z0-9]+','-','g'))),19),''),
  'business'
) || '-' || substr(replace(q.id::text,'-',''),1,10)
where q.book_id is null
   or q.book_id !~ '^[a-z0-9][a-z0-9-]{2,29}$'
   or exists (select 1 from public.queues dupe where dupe.book_id=q.book_id and dupe.id<q.id);
update public.queues set trial_ends_at=(((created_at at time zone 'Asia/Kolkata')::date + 5)::timestamp at time zone 'Asia/Kolkata') where trial_ends_at is null;
update public.queues set balance_last_charged_on=(trial_ends_at at time zone 'Asia/Kolkata')::date - 1 where balance_last_charged_on is null;
alter table public.queues alter column book_id set not null;
alter table public.queues alter column trial_ends_at set not null;
alter table public.queues alter column balance_last_charged_on set not null;
alter table public.queues drop constraint if exists queues_book_id_format;
alter table public.queues add constraint queues_book_id_format check (book_id ~ '^[a-z0-9][a-z0-9-]{2,29}$');
alter table public.queues drop constraint if exists queues_days_nonnegative;
alter table public.queues add constraint queues_days_nonnegative check (paid_days >= 0 and test_days >= 0);
alter table public.queues drop constraint if exists queues_announcement_repeat;
alter table public.queues add constraint queues_announcement_repeat check (announcement_repeat_count between 1 and 4);
create unique index if not exists queues_book_id_unique on public.queues(book_id);

create table if not exists public.bootstrap_credit (
  id boolean primary key default true check (id),
  available boolean not null default true
);
insert into public.bootstrap_credit(id,available) values(true,true) on conflict(id) do nothing;
-- Give one deployment test credit to the first existing business, or to the first business created later.
do $$
begin
  if exists(select 1 from public.queues) then
    update public.queues set test_days=10 where id=(select id from public.queues order by created_at,id limit 1) and test_days=0;
    update public.bootstrap_credit set available=false where id=true;
  end if;
end $$;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  queue_id uuid not null references public.queues(id) on delete cascade,
  amount_paise integer not null check(amount_paise between 1000 and 50000 and amount_paise % 100 = 0),
  days integer generated always as (amount_paise / 100) stored,
  razorpay_order_id text unique not null,
  razorpay_payment_id text unique,
  status text not null default 'created' check(status in ('created','paid','failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.payment_orders enable row level security;
drop policy if exists payment_orders_owner_read on public.payment_orders;
create policy payment_orders_owner_read on public.payment_orders for select to authenticated using(owner_id=auth.uid());

-- Prevent direct client inserts/deletes and prevent an owner from editing the balance, Book ID or lifecycle fields directly.
drop policy if exists queues_owner on public.queues;
drop policy if exists queues_owner_read on public.queues;
create policy queues_owner_read on public.queues for select to authenticated using(owner_id=auth.uid());
drop function if exists public.owner_delete_queue(uuid,boolean);

create or replace function public.book_id_available(p_book_id text,p_queue_id uuid default null) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(p_book_id ~ '^[a-z0-9][a-z0-9-]{2,29}$',false)
    and not exists(select 1 from public.queues q where q.book_id=lower(p_book_id) and (p_queue_id is null or q.id<>p_queue_id))
$$;

create or replace function public.create_business_queue(p_name text,p_book_id text,p_token_limit integer,p_avg_mode text,p_avg_minutes integer,p_start integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid:=auth.uid(); qid uuid; clean_name text:=btrim(coalesce(p_name,'')); clean_book text:=lower(btrim(coalesce(p_book_id,''))); credit int:=0;
begin
  if uid is null then return jsonb_build_object('result','auth'); end if;
  perform 1 from public.users where id=uid for update;
  if char_length(clean_name)<2 or char_length(clean_name)>40 or clean_book !~ '^[a-z0-9][a-z0-9-]{2,29}$' then return jsonb_build_object('result','invalid'); end if;
  if p_start not between 1 and 9999 or (p_token_limit is not null and p_token_limit not between 1 and 9999) or p_avg_mode not in ('auto','manual') or (p_avg_mode='manual' and p_avg_minutes not between 1 and 120) then return jsonb_build_object('result','invalid'); end if;
  if exists(select 1 from public.queues where owner_id=uid and deleted_at is null) then return jsonb_build_object('result','exists'); end if;
  if exists(select 1 from public.queues where book_id=clean_book) then return jsonb_build_object('result','book_taken'); end if;
  update public.bootstrap_credit set available=false where id=true and available returning 10 into credit;
  insert into public.queues(owner_id,code,name,book_id,next_number,start_number,token_limit,avg_time_mode,avg_time_min,status,trial_ends_at,paid_days,test_days,balance_last_charged_on)
    values(uid,replace(gen_random_uuid()::text,'-',''),clean_name,clean_book,p_start,p_start,p_token_limit,p_avg_mode,case when p_avg_mode='manual' then p_avg_minutes end,'live',(((now() at time zone 'Asia/Kolkata')::date + 5)::timestamp at time zone 'Asia/Kolkata'),0,coalesce(credit,0),((now() at time zone 'Asia/Kolkata')::date + 4)) returning id into qid;
  insert into public.sessions(queue_id,start_number,current_number) values(qid,p_start,null);
  return jsonb_build_object('result','ok','queue_id',qid,'test_days',coalesce(credit,0));
exception when unique_violation then return jsonb_build_object('result','book_taken');
end $$;

create or replace function public.owner_update_identity(p_queue_id uuid,p_name text,p_book_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare n text:=btrim(coalesce(p_name,'')); b text:=lower(btrim(coalesce(p_book_id,'')));
begin
  if auth.uid() is null or char_length(n)<2 or char_length(n)>40 or b !~ '^[a-z0-9][a-z0-9-]{2,29}$' then return jsonb_build_object('result','invalid'); end if;
  update public.queues set name=n,book_id=b where id=p_queue_id and owner_id=auth.uid();
  if not found then return jsonb_build_object('result','missing'); end if;
  return jsonb_build_object('result','ok');
exception when unique_violation then return jsonb_build_object('result','book_taken');
end $$;

create or replace function public.queue_book_public(p_book_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues;
begin
  select * into q from public.queues where book_id=lower(btrim(p_book_id)) and deleted_at is null;
  if not found then return jsonb_build_object('result','missing'); end if;
  return jsonb_build_object('result','ok','code',q.code,'name',q.name,'book_id',q.book_id);
end $$;

create or replace function public.refresh_queue_entitlement(p_queue_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; today date:=(now() at time zone 'Asia/Kolkata')::date; elapsed int; use_test int; use_paid int;
begin
  select * into q from public.queues where id=p_queue_id for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  elapsed:=greatest(0,today-q.balance_last_charged_on);
  if now()>q.trial_ends_at and elapsed>0 then
    use_test:=least(q.test_days,elapsed); use_paid:=least(q.paid_days,greatest(0,elapsed-use_test));
    update public.queues set test_days=test_days-use_test,paid_days=paid_days-use_paid,balance_last_charged_on=today where id=q.id returning * into q;
  end if;
  return jsonb_build_object('result','ok','trial_ends_at',q.trial_ends_at,'test_days',q.test_days,'paid_days',q.paid_days,'active',now()<=q.trial_ends_at or q.test_days+q.paid_days>0);
end $$;

-- Existing owner movement RPCs emit these events after changing token/session state.
-- Rejecting the event rolls the whole transaction back once the trial/day balance is exhausted.
create or replace function public.enforce_paid_business_days() returns trigger
language plpgsql security definer set search_path = '' as $$
declare entitlement jsonb;
begin
  if new.type in ('owner_next','owner_prev','owner_skip','owner_walkin') then
    entitlement:=public.refresh_queue_entitlement(new.queue_id);
    if not coalesce((entitlement->>'active')::boolean,false) then
      raise exception 'business_days_expired' using errcode='P0001';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists enforce_paid_business_days on public.queue_events;
create trigger enforce_paid_business_days before insert on public.queue_events
for each row execute function public.enforce_paid_business_days();

create or replace function public.queue_public(p_code text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions; serving int; issued int; waiting int; st text; entitlement jsonb;
begin
  select * into q from public.queues where code=p_code and deleted_at is null;
  if not found then return jsonb_build_object('state','invalid'); end if;
  entitlement:=public.refresh_queue_entitlement(q.id);
  if not (entitlement->>'active')::boolean then return jsonb_build_object('state','expired','name',q.name,'book_id',q.book_id); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1;
  if q.status='closed' or s.id is null then return jsonb_build_object('state','closed','name',q.name,'counter_name',q.counter_name,'book_id',q.book_id); end if;
  select t.number into serving from public.tokens t where t.session_id=s.id and t.status='serving' limit 1;
  select count(*) into issued from public.tokens t where t.session_id=s.id;
  select count(*) into waiting from public.tokens t where t.session_id=s.id and t.status='waiting';
  st:=case when not q.intake_enabled then 'intake_paused' when q.token_limit is not null and issued>=q.token_limit then 'limit' when q.status='paused' then 'paused' else 'live' end;
  return jsonb_build_object('state',st,'name',q.name,'counter_name',q.counter_name,'book_id',q.book_id,'started_at',s.started_at,'serving',serving,'next_number',q.next_number,'waiting',waiting,'avg_time_min',q.avg_time_min);
end $$;

create or replace function public.issue_token(p_code text,p_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid:=auth.uid(); q public.queues; s public.sessions; n text:=btrim(coalesce(p_name,'')); existing uuid; issued int; num int; tid uuid; ent jsonb;
begin
  if uid is null then return jsonb_build_object('result','auth'); end if;
  if char_length(n)<2 or char_length(n)>40 or n ~ '^\d+$' then return jsonb_build_object('result','name'); end if;
  if (select count(*) from public.tokens where user_id=uid and created_at>now()-interval '1 minute')>=5 then return jsonb_build_object('result','rate'); end if;
  select * into q from public.queues where code=p_code and deleted_at is null for update;
  if not found then return jsonb_build_object('result','invalid'); end if;
  ent:=public.refresh_queue_entitlement(q.id);
  if not (ent->>'active')::boolean then return jsonb_build_object('result','expired'); end if;
  if not q.intake_enabled then return jsonb_build_object('result','intake_paused'); end if;
  select * into s from public.sessions where queue_id=q.id and ended_at is null order by started_at desc limit 1 for update;
  if q.status='closed' or s.id is null then return jsonb_build_object('result','closed'); end if;
  select id into existing from public.tokens where session_id=s.id and user_id=uid and status in ('waiting','serving') limit 1;
  if existing is not null then return jsonb_build_object('result','existing','token_id',existing); end if;
  if q.status='paused' then return jsonb_build_object('result','paused'); end if;
  select count(*) into issued from public.tokens where session_id=s.id;
  if q.token_limit is not null and issued>=q.token_limit then return jsonb_build_object('result','limit'); end if;
  num:=q.next_number;
  insert into public.tokens(session_id,user_id,number,display_name) values(s.id,uid,num,n) returning id into tid;
  update public.queues set next_number=num+1 where id=q.id;
  return jsonb_build_object('result','issued','token_id',tid,'number',num);
end $$;

create or replace function public.owner_walkin(p_queue_id uuid,p_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare q public.queues; s public.sessions; n text:=btrim(coalesce(p_name,'')); issued int; num int; tid uuid; ent jsonb;
begin
  if char_length(n)<2 or char_length(n)>40 or n ~ '^\d+$' then return jsonb_build_object('result','name'); end if;
  select * into q from public.queues where id=p_queue_id and owner_id=auth.uid() and deleted_at is null for update;
  if not found then return jsonb_build_object('result','forbidden'); end if;
  ent:=public.refresh_queue_entitlement(q.id);
  if not (ent->>'active')::boolean then return jsonb_build_object('result','expired'); end if;
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

create or replace function public.owner_update_intake(p_queue_id uuid,p_enabled boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin update public.queues set intake_enabled=p_enabled where id=p_queue_id and owner_id=auth.uid(); if not found then return jsonb_build_object('result','missing'); end if; return jsonb_build_object('result','ok'); end $$;
create or replace function public.owner_update_announcements(p_queue_id uuid,p_enabled boolean,p_repeat integer,p_sound_box boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if p_repeat not between 1 and 4 then return jsonb_build_object('result','invalid'); end if;
  update public.queues set announcement_enabled=p_enabled,announcement_repeat_count=p_repeat,sound_box_enabled=p_sound_box where id=p_queue_id and owner_id=auth.uid();
  if not found then return jsonb_build_object('result','missing'); end if;
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.mark_payment_success(p_order_id text,p_payment_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare p public.payment_orders; q public.queues;
begin
  select * into p from public.payment_orders where razorpay_order_id=p_order_id for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  if p.status='paid' then return jsonb_build_object('result','duplicate'); end if;
  select * into q from public.queues where id=p.queue_id for update;
  if not found then return jsonb_build_object('result','missing'); end if;
  update public.payment_orders set status='paid',razorpay_payment_id=p_payment_id,paid_at=now() where id=p.id;
  update public.queues set paid_days=paid_days+p.days where id=q.id;
  return jsonb_build_object('result','ok','days',p.days,'total_days',q.paid_days+p.days+q.test_days);
exception when unique_violation then return jsonb_build_object('result','duplicate');
end $$;

create or replace function public.customer_history_groups() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  with all_tokens as (
    select h.queue_id,h.queue_name,h.id,h.number,h.created_at,h.called_at,h.done_at,h.status
    from public.customer_history h where h.user_id=auth.uid()
    union
    select q.id,q.name,t.id,t.number,t.created_at,t.called_at,t.done_at,t.status
    from public.tokens t join public.sessions s on s.id=t.session_id join public.queues q on q.id=s.queue_id
    where t.user_id=auth.uid()
  ), grouped as (
    select queue_id,queue_name,max(created_at) last_used,
      jsonb_agg(jsonb_build_object('id',id,'number',number,'created_at',created_at,'called_at',called_at,'done_at',done_at,'status',status) order by created_at desc) tokens
    from all_tokens group by queue_id,queue_name
  )
  select coalesce(jsonb_agg(jsonb_build_object('queue_id',queue_id,'business_name',queue_name,'tokens',tokens) order by last_used desc),'[]'::jsonb) into result from grouped;
  return coalesce(result,'[]'::jsonb);
end $$;

revoke all on function public.create_business_queue(text,text,integer,text,integer,integer),public.owner_update_identity(uuid,text,text),public.refresh_queue_entitlement(uuid),public.owner_update_intake(uuid,boolean),public.owner_update_announcements(uuid,boolean,integer,boolean),public.mark_payment_success(text,text) from public,anon;
grant execute on function public.create_business_queue(text,text,integer,text,integer,integer),public.owner_update_identity(uuid,text,text),public.owner_update_intake(uuid,boolean),public.owner_update_announcements(uuid,boolean,integer,boolean),public.book_id_available(text,uuid),public.queue_book_public(text),public.customer_history_groups() to authenticated;
grant execute on function public.queue_book_public(text) to anon;
revoke all on function public.mark_payment_success(text,text) from authenticated;
grant execute on function public.mark_payment_success(text,text) to service_role;
grant execute on function public.refresh_queue_entitlement(uuid) to authenticated,anon;
