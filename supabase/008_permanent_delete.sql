-- Part 15: queue/history deletion is permanent; no deleted-item recovery.
-- Apply after 007_popups_default_off.sql.
-- Remove previously soft-deleted records and snapshots before disabling recovery.
delete from public.customer_history where queue_id in (select id from public.queues where deleted_at is not null);
delete from public.queues where deleted_at is not null;
delete from public.sessions where deleted_at is not null;

create or replace function public.owner_delete_queue(p_queue_id uuid, p_permanent boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.queues where id=p_queue_id and owner_id=auth.uid()) then
    return jsonb_build_object('result','missing');
  end if;
  delete from public.customer_history where queue_id=p_queue_id;
  delete from public.queues where id=p_queue_id and owner_id=auth.uid();
  return jsonb_build_object('result','ok');
end $$;

create or replace function public.owner_delete_history(p_session_id uuid, p_permanent boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.sessions s where s.id=p_session_id and public.owns_queue(s.queue_id)) then
    return jsonb_build_object('result','missing');
  end if;
  delete from public.customer_history where session_id=p_session_id;
  delete from public.sessions where id=p_session_id;
  return jsonb_build_object('result','ok');
end $$;

drop function if exists public.owner_recently_deleted();
drop function if exists public.owner_recover_item(uuid,text);
drop function if exists public.owner_recover_queue_by_code(text);
drop function if exists public.purge_expired_items();

do $$
begin
  if exists(select 1 from pg_namespace where nspname='cron') then
    execute 'select cron.unschedule(jobid) from cron.job where jobname = ''tokenapp-purge-expired''';
  end if;
exception when insufficient_privilege then
  raise notice 'Could not remove old pg_cron purge job; remove tokenapp-purge-expired from Supabase Cron manually.';
end $$;

revoke all on function public.owner_delete_queue(uuid,boolean), public.owner_delete_history(uuid,boolean) from public;
grant execute on function public.owner_delete_queue(uuid,boolean), public.owner_delete_history(uuid,boolean) to authenticated;
