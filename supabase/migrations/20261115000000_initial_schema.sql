create extension if not exists "uuid-ossp";

create type public.app_role as enum ('tourist', 'admin', 'editor', 'reviewer');
create type public.content_status as enum ('draft', 'pending_review', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'tourist',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.destinations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  category text not null,
  description text not null,
  image_path text,
  status public.content_status not null default 'draft',
  latitude double precision,
  longitude double precision,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  organizer text,
  source_url text,
  verification_status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_id)
);

alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.events enable row level security;
alter table public.favorites enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor', 'reviewer')); $$;

create policy "Published destinations are public" on public.destinations for select using (status = 'published' or public.is_admin());
create policy "Admins manage destinations" on public.destinations for all using (public.is_admin()) with check (public.is_admin());
create policy "Published events are public" on public.events for select using (verification_status = 'published' or public.is_admin());
create policy "Admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "Users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Users manage own favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public) values
  ('destination-media', 'destination-media', true),
  ('phrasebook-audio', 'phrasebook-audio', true)
on conflict (id) do nothing;

create policy "Public can read published media" on storage.objects for select using (bucket_id in ('destination-media', 'phrasebook-audio'));
create policy "Admins can upload media" on storage.objects for insert with check (bucket_id in ('destination-media', 'phrasebook-audio') and public.is_admin());
create policy "Admins can update media" on storage.objects for update using (bucket_id in ('destination-media', 'phrasebook-audio') and public.is_admin());
create policy "Admins can delete media" on storage.objects for delete using (bucket_id in ('destination-media', 'phrasebook-audio') and public.is_admin());
