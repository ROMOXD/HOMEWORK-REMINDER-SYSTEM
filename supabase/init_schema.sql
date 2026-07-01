-- Supabase initialization schema for Homework Reminder System
-- Run this in the Supabase SQL editor (or via psql) for your project

-- Enable pgcrypto for gen_random_uuid() if not already enabled
create extension if not exists pgcrypto;

-- Profiles table (optional link to auth.users)
create table if not exists profiles (
  id uuid primary key,
  username text not null,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  subject text,
  description text,
  due_date timestamptz,
  reminder_time timestamptz,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_tasks_due_date on tasks(due_date);

-- Notifications table
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  title text,
  message text,
  type text check (type in ('deadline','reminder','alert')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on notifications(user_id);

-- Settings table
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) unique,
  notifications_enabled boolean not null default true,
  dark_mode boolean not null default false,
  language text not null default 'en',
  updated_at timestamptz not null default now()
);

-- Optional helper to import auth users into profiles:
-- insert into profiles (id, username, email)
-- select id, coalesce(user_metadata->>'username', ''), email
-- from auth.users
-- where not exists (select 1 from profiles p where p.id = auth.users.id);
