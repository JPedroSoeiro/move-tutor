export interface MoveDetail {
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  type: { name: string };
  effect_chance: number | null;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: { name: string };
  }[];
}

export interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
    versions: any;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  moves: { move: { name: string; url: string } }[];
}
