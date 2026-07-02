-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  gender text check (gender in ('male', 'female')),
  age integer,
  nationality text,
  residence text,
  marital_status text,
  children_count integer default 0,
  smoker boolean default false,
  
  -- Physical
  height integer,
  weight integer,
  skin_color text,
  body_type text,
  beard boolean, -- only for male
  health_status text,
  disabilities text,
  
  -- Work & Income
  job text,
  profession text,
  qualification text,
  income_level text,
  
  -- Religion
  religious_commitment text,
  prayer_commitment text,
  
  -- Marriage Preferences
  qayma_opinion text,
  mahr_opinion text,
  marriage_time text,
  roya_opinion text,
  
  -- About
  hobbies text,
  partner_specs text check (char_length(partner_specs) >= 140),
  about_me text check (char_length(about_me) >= 140),
  avatar_url text,
  
  -- App Status
  is_premium boolean default false,
  premium_until timestamp with time zone,
  is_admin boolean default false,
  is_approved boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Admin RPC for updating profiles securely
create or replace function public.admin_update_profile(target_id uuid, new_is_approved boolean, new_is_premium boolean)
returns void as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
    raise exception 'Unauthorized';
  end if;

  update public.profiles
  set 
    is_approved = coalesce(new_is_approved, is_approved),
    is_premium = coalesce(new_is_premium, is_premium)
  where id = target_id;
end;
$$ language plpgsql security definer;

-- Trigger to re-approve profiles on sensitive changes
create or replace function public.handle_profile_update()
returns trigger as $$
begin
  if auth.uid() = new.id then
    if (old.about_me is distinct from new.about_me) or 
       (old.partner_specs is distinct from new.partner_specs) or 
       (old.avatar_url is distinct from new.avatar_url) or
       (old.age is distinct from new.age) then
      new.is_approved := false;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_update
  before update on public.profiles
  for each row execute procedure public.handle_profile_update();

-- INTERESTS TABLE (Likes, Ignores, Blocks)
create table public.interests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  target_user_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('interested', 'ignore', 'save', 'block')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, target_user_id)
);

alter table public.interests enable row level security;
create policy "Users can view their own interests" on public.interests for select using (auth.uid() = user_id or auth.uid() = target_user_id);
create policy "Users can insert their own interests" on public.interests for insert with check (auth.uid() = user_id);
create policy "Users can update their own interests" on public.interests for update using (auth.uid() = user_id);

-- MESSAGES TABLE
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;
create policy "Users can view their own messages" on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can insert messages" on public.messages for insert with check (
  auth.uid() = sender_id and (
    exists (select 1 from public.profiles where id = auth.uid() and is_premium = true) or
    exists (select 1 from public.messages m where m.sender_id = receiver_id and m.receiver_id = auth.uid())
  )
);

-- NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "System can insert notifications" on public.notifications for insert with check (false);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- REPORTS TABLE
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reported_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reports enable row level security;
create policy "Users can insert reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "Admins can view reports" on public.reports for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- PROFILE VISITS TABLE
create table public.profile_visits (
  id uuid default uuid_generate_v4() primary key,
  visitor_id uuid references public.profiles(id) on delete cascade not null,
  visited_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profile_visits enable row level security;
create policy "Users can insert visits" on public.profile_visits for insert with check (auth.uid() = visitor_id);
create policy "Users can view visits to their profile" on public.profile_visits for select using (auth.uid() = visited_id);
create policy "Users can view their own visits" on public.profile_visits for select using (auth.uid() = visitor_id);

-- PREMIUM REQUESTS TABLE
create table public.premium_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  package_name text not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.premium_requests enable row level security;
create policy "Users can insert premium requests" on public.premium_requests for insert with check (auth.uid() = user_id);
create policy "Users can view own premium requests" on public.premium_requests for select using (auth.uid() = user_id);
create policy "Admins can view premium requests" on public.premium_requests for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, split_part(new.email, '@', 1), 'avatar1.png');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper Function: Rate Limiting
create or replace function public.rate_limit_requests()
returns trigger as $$
declare
  recent_count int;
begin
  if TG_TABLE_NAME = 'reports' then
    select count(*) into recent_count from public.reports 
    where reporter_id = auth.uid() and created_at > now() - interval '1 day';
    if recent_count >= 5 then
      raise exception 'لقد وصلت للحد الأقصى من البلاغات اليومية.';
    end if;
  elsif TG_TABLE_NAME = 'premium_requests' then
    select count(*) into recent_count from public.premium_requests 
    where user_id = auth.uid() and status = 'pending';
    if recent_count >= 2 then
      raise exception 'لديك طلبات تميز معلقة مسبقاً.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger tr_rate_limit_reports
  before insert on public.reports
  for each row execute procedure public.rate_limit_requests();

create trigger tr_rate_limit_premium
  before insert on public.premium_requests
  for each row execute procedure public.rate_limit_requests();

-- Admin RPCs for resolving requests
create or replace function public.admin_resolve_report(report_id uuid)
returns void as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
    raise exception 'Unauthorized';
  end if;
  update public.reports set status = 'resolved' where id = report_id;
end;
$$ language plpgsql security definer;

create or replace function public.admin_approve_premium(request_id uuid, target_user_id uuid, days_to_add integer)
returns void as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
    raise exception 'Unauthorized';
  end if;
  update public.premium_requests set status = 'approved' where id = request_id;
  update public.profiles 
  set 
    is_premium = true,
    premium_until = coalesce(premium_until, now()) + (days_to_add || ' days')::interval
  where id = target_user_id;
end;
$$ language plpgsql security definer;
create or replace function public.notify_on_interest()
returns trigger as $$
begin
  if new.status = 'interested' then
    insert into public.notifications (user_id, type, content)
    values (new.target_user_id, 'interest', 'هناك عضو جديد مهتم بملفك الشخصي');
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_interest_created
  after insert on public.interests
  for each row execute procedure public.notify_on_interest();

-- Create photo permissions table
create table public.photo_permissions (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  target_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(requester_id, target_id)
);

alter table public.photo_permissions enable row level security;

create policy "Users can view their own requests and requests sent to them"
  on public.photo_permissions for select
  using (auth.uid() = requester_id or auth.uid() = target_id);

create policy "Users can create requests"
  on public.photo_permissions for insert
  with check (auth.uid() = requester_id);

create policy "Users can update requests sent to them"
  on public.photo_permissions for update
  using (auth.uid() = target_id)
  with check (auth.uid() = target_id);
