-- Part 13: popup messages and coach tips are opt-in.
alter table public.users
  alter column helper_tips_enabled set default false;

update public.users
set helper_tips_enabled = false
where helper_tips_enabled = true;
