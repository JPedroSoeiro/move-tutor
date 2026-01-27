import api from "./api";
import { PokemonData, MoveDetail } from "@/types/pokemon";

export const pokemonService = {
  // Busca lista de todos os Pokémon (para o autocomplete)
  getAllNames: async (): Promise<string[]> => {
    const { data } = await api.get("/pokemon?limit=10000");
    return data.results.map((p: any) => p.name);
  },

  getPokemonByName: async (name: string): Promise<PokemonData> => {
    const { data } = await api.get(`/pokemon/${name.toLowerCase()}`);
    return data;
  },

  getMoveDetails: async (moveUrl: string): Promise<MoveDetail> => {
    const { data } = await api.get(moveUrl);
    return data;
  },
};
