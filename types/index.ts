// PokeAPI - Base structures
export interface EffectEntry {
  short_effect: string;
  language: { name: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string; url: string };
}

export interface PokemonType {
  type: { name: string; url: string };
}

export interface PokemonAbilityEntry {
  ability: { name: string; url: string };
  is_hidden: boolean;
}

export interface PokemonMoveEntry {
  move: { name: string; url: string };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  versions?: {
    "generation-v"?: {
      "black-white"?: {
        animated?: {
          front_default?: string | null;
          front_shiny?: string | null;
        };
      };
    };
  };
}

export interface PokemonSpecies {
  url: string;
}

export interface PokemonData {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbilityEntry[];
  moves: PokemonMoveEntry[];
  species: PokemonSpecies;
}

// PokeAPI - Detail objects
export interface MoveDetails {
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  effect_chance: number | null;
  effect_entries: EffectEntry[];
  type: { name: string };
}

export interface ItemDetails {
  name: string;
  effect_entries: EffectEntry[];
}

export interface AbilityDetails {
  name: string;
  effect_entries: EffectEntry[];
}

// Team builder - slot state
export interface MoveOption {
  name: string;
  url: string;
}

export interface SlotData {
  pokemon: PokemonData | null;
  moves: MoveOption[];
  selectedMoves: (MoveDetails | null)[];
  selectedAbility: AbilityDetails | null;
  selectedItem: ItemDetails | null;
  nature: string;
  isShiny: boolean;
  moveTypes: string[];
}

// Database / API types
export interface TeamPokemon {
  pokemon_id: number;
  name: string;
  item: string;
  ability: string;
  nature?: string;
  moves: string[];
  is_shiny?: boolean;
}

export interface Team {
  id?: string;
  team_name: string;
  author_name?: string;
  regulation?: string;
  pokemons?: TeamPokemon[];
  description?: string;
  is_public?: boolean;
  user_id?: string;
  created_at?: string;
}

export interface UserTeamsResponse {
  teams: Team[];
  count: number;
  username: string;
}

export interface StatScoutResult {
  id: number;
  name: string;
  value: number;
  sprite: string;
}
