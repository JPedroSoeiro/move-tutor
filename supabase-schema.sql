-- Move Tutor Database Schema
-- Execute this on Supabase SQL Editor

-- ============================================
-- 1. ENABLE NECESSARY EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- 2. TEAMS TABLE (Main)
-- ============================================
create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  team_name text not null,
  author_name text not null default 'Treinador',
  regulation text default 'VGC' check (regulation in ('VGC', 'Smogon', 'Custom')),
  pokemons jsonb not null default '[]'::jsonb,
  description text,
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  -- Índices para performance
  constraint team_name_not_empty check (char_length(team_name) > 0),
  constraint author_name_not_empty check (char_length(author_name) > 0)
);

-- Create indexes for better query performance
create index if not exists idx_teams_user_id on teams(user_id);
create index if not exists idx_teams_author_name on teams(author_name);
create index if not exists idx_teams_created_at on teams(created_at desc);
create index if not exists idx_teams_is_public on teams(is_public);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
alter table teams enable row level security;

-- Policy: Users can see their own teams
create policy if not exists "Users can see their own teams"
on teams for select
using (auth.uid() = user_id or is_public = true);

-- Policy: Users can create teams
create policy if not exists "Users can create teams"
on teams for insert
with check (auth.uid() = user_id);

-- Policy: Users can update their own teams
create policy if not exists "Users can update their own teams"
on teams for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policy: Users can delete their own teams
create policy if not exists "Users can delete their own teams"
on teams for delete
using (auth.uid() = user_id);

-- ============================================
-- 4. AUTO-UPDATE UPDATED_AT TIMESTAMP
-- ============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger if not exists update_teams_updated_at
before update on teams
for each row
execute function update_updated_at_column();

-- ============================================
-- 5. EXPECTED POKEMON OBJECT STRUCTURE
-- ============================================
-- Each pokemon in the 'pokemons' array should follow this structure:
-- {
--   "pokemon_id": 1,
--   "name": "bulbasaur",
--   "item": "assault-vest",
--   "ability": "overgrow",
--   "nature": "Modest",
--   "moves": [
--     "solar-beam",
--     "sludge-bomb",
--     "growth",
--     "synthesis"
--   ]
-- }

-- ============================================
-- 6. HELPFUL QUERIES
-- ============================================

-- Get all teams by a user
-- SELECT * FROM teams WHERE user_id = 'user-uuid' ORDER BY created_at DESC;

-- Get public teams (feed)
-- SELECT * FROM teams WHERE is_public = true ORDER BY created_at DESC;

-- Search teams by author name
-- SELECT * FROM teams WHERE author_name ILIKE '%trainer%' ORDER BY created_at DESC;

-- Get unique authors (for search dropdown)
-- SELECT DISTINCT author_name FROM teams WHERE author_name IS NOT NULL AND author_name != 'Treinador Desconhecido' ORDER BY author_name;

-- Count pokemons in a team
-- SELECT id, team_name, jsonb_array_length(pokemons) as pokemon_count FROM teams;

-- Get a specific pokemon from a team
-- SELECT jsonb_array_elements(pokemons) FROM teams WHERE id = 'team-uuid';

-- ============================================
-- 7. STORAGE BUCKET FOR IMAGES (Optional)
-- ============================================
-- If you want to store team screenshots, create a bucket:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create new bucket named: "team-images"
-- 3. Make it public (optional)
-- 4. Update RLS policies as needed

-- ============================================
-- 8. NOTES
-- ============================================
-- - Row Level Security is enabled to protect user data
-- - Teams are private by default (is_public = false)
-- - Set is_public = true to appear in the public feed
-- - updated_at is automatically set to current timestamp on updates
-- - Pokemon data is stored as JSONB for flexibility and fast queries
