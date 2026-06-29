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
create policy "Premium users can insert messages" on public.messages for insert with check (
  auth.uid() = sender_id and 
  exists (select 1 from public.profiles where id = auth.uid() and is_premium = true)
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
create policy "System can insert notifications" on public.notifications for insert with check (true);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.email, 'default_avatar.png');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper Function: Notify on Interest
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
