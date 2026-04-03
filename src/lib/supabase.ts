import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** 
 * SQL SCHEMA FOR SUPABASE (Run this in the SQL Editor)
 * 
 * -- Profiles table
 * create table profiles (
 *   id uuid references auth.users not null primary key,
 *   email text unique not null,
 *   full_name text,
 *   address text,
 *   balance decimal default 0.00,
 *   avatar_url text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- Enable Row Level Security
 * alter table profiles enable row level security;
 * 
 * -- Setup Policies
 * create policy "Public profiles are viewable by everyone." on profiles
 *   for select using (true);
 * 
 * create policy "Users can insert their own profile." on profiles
 *   for insert with check (auth.uid() = id);
 * 
 * create policy "Users can update own profile." on profiles
 *   for update using (auth.uid() = id);
 * 
 * -- Game bets log (optional leaderboard)
 * create table game_history (
 *   id uuid default uuid_generate_v4() primary key,
 *   user_id uuid references auth.users not null,
 *   bet_amount decimal not null,
 *   multiplier decimal not null,
 *   win_amount decimal not null,
 *   mines_count integer not null,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 */
