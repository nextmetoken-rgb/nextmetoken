-- Part 3: tables + RLS. Supabase SQL Editor me poori file ek baar chalayein.

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text check (name is null or (char_length(btrim(name)) between 2 and 40 and btrim(name) !~ '^\d+$')),
  email text,
  created_at timestamptz not null default now()
);

create table public.queues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  code text not null unique check (char_length(code) >= 10),
  name text not null,
  counter_name text,
  next_number integer not null default 1,
  start_number integer not null default 1,
  token_limit integer,                       -- null = koi limit nahi
  avg_time_mode text,
  avg_time_min integer,
  status text not null default 'live',
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  purge_at timestamptz
);
create index on public.queues (owner_id);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  queue_id uuid not null references public.queues(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  start_number integer not null default 1,
  current_number integer,
  version integer not null default 0
);
create index on public.sessions (queue_id);

create table public.tokens (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  number integer not null,
  display_name text not null,
  is_walkin boolean not null default false,
  status text not null default 'waiting' check (status in ('waiting','serving','done','left','removed','expired')),
  hidden_for_owner boolean not null default false,
  created_at timestamptz not null default now(),
  called_at timestamptz,
  done_at timestamptz,
  eta_at_issue timestamptz,
  unique (session_id, number)
);
create index on public.tokens (user_id);
create index on public.tokens (session_id);

create table public.queue_events (
  id uuid primary key default gen_random_uuid(),
  queue_id uuid not null references public.queues(id) on delete cascade,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index on public.queue_events (queue_id);

create table public.push_subscriptions (
  user_id uuid not null references public.users(id) on delete cascade,
  endpoint text not null,
  keys jsonb not null,
  primary key (user_id, endpoint)
);

-- Naya Google user aate hi users row (naam null = abhi naam nahi diya)
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.users (id, email) values (new.id, new.email) on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS helpers (security definer: policies ek doosre ko loop na karein)
create function public.owns_queue(qid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.queues q where q.id = qid and q.owner_id = auth.uid()) $$;
create function public.owns_session(sid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.sessions s join public.queues q on q.id = s.queue_id
                 where s.id = sid and q.owner_id = auth.uid()) $$;
create function public.holds_token_in(sid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.tokens t where t.session_id = sid and t.user_id = auth.uid()) $$;

alter table public.users enable row level security;
alter table public.queues enable row level security;
alter table public.sessions enable row level security;
alter table public.tokens enable row level security;
alter table public.queue_events enable row level security;
alter table public.push_subscriptions enable row level security;

create policy users_select on public.users for select to authenticated using (id = auth.uid());
create policy users_update on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy queues_owner on public.queues for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy sessions_owner on public.sessions for all to authenticated
  using (public.owns_queue(queue_id)) with check (public.owns_queue(queue_id));
create policy sessions_holder_select on public.sessions for select to authenticated
  using (public.holds_token_in(id));

create policy tokens_own_select on public.tokens for select to authenticated using (user_id = auth.uid());
create policy tokens_owner on public.tokens for all to authenticated
  using (public.owns_session(session_id)) with check (public.owns_session(session_id));

create policy events_owner on public.queue_events for all to authenticated
  using (public.owns_queue(queue_id)) with check (public.owns_queue(queue_id));

create policy push_own on public.push_subscriptions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
