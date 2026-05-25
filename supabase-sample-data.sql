-- Sample Data for Move Tutor
-- Use this to populate test data in your Supabase database
-- Note: Replace 'your-user-uuid-here' with an actual user ID from auth.users

-- ============================================
-- INSERT SAMPLE TEAMS
-- ============================================

-- Team 1: Competitive VGC Team
INSERT INTO teams (user_id, team_name, author_name, regulation, pokemons, description, is_public)
VALUES (
  'your-user-uuid-here',
  'Hyper Offense Spam',
  'João Pedro',
  'VGC',
  '[
    {
      "pokemon_id": 282,
      "name": "gardevoir",
      "item": "assault-vest",
      "ability": "synchronize",
      "nature": "Modest",
      "moves": ["psychic", "focus-blast", "shadow-ball", "dazzling-gleam"]
    },
    {
      "pokemon_id": 149,
      "name": "dragonite",
      "item": "life-orb",
      "ability": "multiscale",
      "nature": "Adamant",
      "moves": ["outrage", "earthquake", "extreme-speed", "close-combat"]
    },
    {
      "pokemon_id": 248,
      "name": "tyranitar",
      "item": "choice-band",
      "ability": "sand-stream",
      "nature": "Adamant",
      "moves": ["stone-edge", "earthquake", "crunch", "pursuit"]
    },
    {
      "pokemon_id": 384,
      "name": "rayquaza",
      "item": "life-orb",
      "ability": "air-lock",
      "nature": "Adamant",
      "moves": ["outrage", "earthquake", "extreme-speed", "v-create"]
    },
    {
      "pokemon_id": 445,
      "name": "garchomp",
      "item": "choice-scarf",
      "ability": "rough-skin",
      "nature": "Jolly",
      "moves": ["earthquake", "outrage", "stone-edge", "close-combat"]
    },
    {
      "pokemon_id": 384,
      "name": "salamence",
      "item": "choice-specs",
      "ability": "intimidate",
      "nature": "Timid",
      "moves": ["draco-meteor", "hydro-pump", "fire-blast", "uturm"]
    }
  ]',
  'A fast-paced offensive team built around max speed and coverage moves',
  true
);

-- Team 2: Defensive Core
INSERT INTO teams (user_id, team_name, author_name, regulation, pokemons, description, is_public)
VALUES (
  'your-user-uuid-here',
  'Wall City Fortress',
  'João Pedro',
  'VGC',
  '[
    {
      "pokemon_id": 379,
      "name": "registeel",
      "item": "assault-vest",
      "ability": "clear-body",
      "nature": "Careful",
      "moves": ["flash-cannon", "earthquake", "toxic-spikes", "stealth-rock"]
    },
    {
      "pokemon_id": 380,
      "name": "latias",
      "item": "leftovers",
      "ability": "levitate",
      "nature": "Timid",
      "moves": ["draco-meteor", "calm-mind", "refresh", "roost"]
    },
    {
      "pokemon_id": 376,
      "name": "metagross",
      "item": "assault-vest",
      "ability": "clear-body",
      "nature": "Careful",
      "moves": ["meteor-mash", "earthquake", "bullet-punch", "ice-punch"]
    },
    {
      "pokemon_id": 385,
      "name": "jirachi",
      "item": "leftovers",
      "ability": "serene-grace",
      "nature": "Careful",
      "moves": ["iron-head", "earthquake", "toxic-spikes", "stealth-rock"]
    },
    {
      "pokemon_id": 350,
      "name": "milotic",
      "item": "assault-vest",
      "ability": "competitive",
      "nature": "Calm",
      "moves": ["scald", "recover", "ice-beam", "toxic"]
    },
    {
      "pokemon_id": 379,
      "name": "regice",
      "item": "assault-vest",
      "ability": "clear-body",
      "nature": "Calm",
      "moves": ["ice-beam", "calm-mind", "flash-cannon", "ancient-power"]
    }
  ]',
  'A defensive team with multiple walls and recovery options',
  true
);

-- Team 3: Balanced Team
INSERT INTO teams (user_id, team_name, author_name, regulation, pokemons, description, is_public)
VALUES (
  'your-user-uuid-here',
  'Golden Balance',
  'Campeonato',
  'VGC',
  '[
    {
      "pokemon_id": 25,
      "name": "pikachu",
      "item": "light-ball",
      "ability": "static",
      "nature": "Timid",
      "moves": ["thunderbolt", "quick-attack", "iron-tail", "focus-blast"]
    },
    {
      "pokemon_id": 6,
      "name": "charizard",
      "item": "charizardite-x",
      "ability": "blaze",
      "nature": "Adamant",
      "moves": ["flamethrower", "dragon-claw", "earthquake", "roost"]
    },
    {
      "pokemon_id": 3,
      "name": "venusaur",
      "item": "venusaurite",
      "ability": "overgrow",
      "nature": "Modest",
      "moves": ["solar-beam", "sludge-bomb", "grass-knot", "synthesis"]
    },
    {
      "pokemon_id": 9,
      "name": "blastoise",
      "item": "assault-vest",
      "ability": "torrent",
      "nature": "Modest",
      "moves": ["hydro-pump", "ice-beam", "focus-blast", "dark-pulse"]
    },
    {
      "pokemon_id": 149,
      "name": "dragonite",
      "item": "lum-berry",
      "ability": "multiscale",
      "nature": "Adamant",
      "moves": ["outrage", "earthquake", "extreme-speed", "close-combat"]
    },
    {
      "pokemon_id": 384,
      "name": "rayquaza",
      "item": "life-orb",
      "ability": "air-lock",
      "nature": "Adamant",
      "moves": ["outrage", "earthquake", "v-create", "extreme-speed"]
    }
  ]',
  'Iconic Pokémon balanced for tournament play',
  true
);

-- ============================================
-- TO USE THIS DATA:
-- 1. Get your user UUID from Supabase auth.users table
-- 2. Replace 'your-user-uuid-here' with your actual user ID
-- 3. Run this entire script in the Supabase SQL Editor
-- 4. Verify the teams appear in your dashboard
-- ============================================

-- VERIFY:
-- SELECT id, team_name, author_name, regulation, is_public, created_at FROM teams ORDER BY created_at DESC;
