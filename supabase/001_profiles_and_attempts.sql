-- 001_profiles_and_attempts.sql
-- Tables and row level security for player profiles and quiz attempts.

-- Profiles: one row per player who picked a username
create table profiles (
  profile_id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (char_length(username) between 3 and 25),
  created_at timestamptz not null default now()
);

create unique index profiles_username_lower_idx on profiles (lower(username));

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can create their own profile"
on profiles for insert
with check (profile_id = auth.uid());

create policy "Users can update their own profile"
on profiles for update
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

-- Attempts: one row per player per day
create table attempts (
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_date date not null,
  score smallint not null check (score between 0 and 10),
  answers jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, quiz_date)
);

alter table attempts enable row level security;

create policy "Players can read only their own attempts"
on attempts for select
using (user_id = auth.uid());

create policy "Players can only insert rows under their own ID"
on attempts for insert
with check (user_id = auth.uid());