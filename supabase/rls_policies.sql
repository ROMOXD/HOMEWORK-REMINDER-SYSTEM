-- Supabase authenticated RLS policies for Homework Reminder System
-- Run after creating the schema in supabase/init_schema.sql

-- Enable row level security on all tables
alter table if exists profiles enable row level security;
alter table if exists tasks enable row level security;
alter table if exists notifications enable row level security;
alter table if exists settings enable row level security;

-- profiles: allow authenticated users to insert their own profile
create policy if not exists "profiles_insert_authenticated" on profiles
  for insert
  with check (auth.uid() = id);

create policy if not exists "profiles_select_authenticated" on profiles
  for select
  using (auth.uid() = id);

create policy if not exists "profiles_update_authenticated" on profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- tasks: allow authenticated users to manage their own tasks
create policy if not exists "tasks_insert_authenticated" on tasks
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "tasks_select_authenticated" on tasks
  for select
  using (auth.uid() = user_id);

create policy if not exists "tasks_update_authenticated" on tasks
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "tasks_delete_authenticated" on tasks
  for delete
  using (auth.uid() = user_id);

-- notifications: allow authenticated users to read and update their own notifications
create policy if not exists "notifications_insert_authenticated" on notifications
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "notifications_select_authenticated" on notifications
  for select
  using (auth.uid() = user_id);

create policy if not exists "notifications_update_authenticated" on notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "notifications_delete_authenticated" on notifications
  for delete
  using (auth.uid() = user_id);

-- settings: allow each user to manage only their own settings
create policy if not exists "settings_insert_authenticated" on settings
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "settings_select_authenticated" on settings
  for select
  using (auth.uid() = user_id);

create policy if not exists "settings_update_authenticated" on settings
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "settings_delete_authenticated" on settings
  for delete
  using (auth.uid() = user_id);

-- Optional: allow the service_role to bypass RLS if you use a server key
-- (service_role key has full access by default and does not need policies)
