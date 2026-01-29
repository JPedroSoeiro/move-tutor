// Esta é a interface que estava faltando ser exportada
export interface Move {
  name: string;
  url: string;
}

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

export interface AbilityDetail {
  name: string;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: { name: string };
  }[];
}

export interface ItemDetail {
  name: string;
  effect_entries: {
    short_effect: string;
    language: { name: string };
  }[];
}

export interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
    versions: {
      "generation-v": {
        "black-white": {
          animated: {
            front_default: string;
            front_shiny: string;
          };
        };
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: {
    ability: { name: string; url: string };
    is_hidden: boolean;
  }[];
  moves: { move: { name: string; url: string } }[];
}
