import api from "./api";
import {
  PokemonData,
  MoveDetail,
  AbilityDetail,
  ItemDetail,
} from "@/types/pokemon";

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

  getAbilityDetails: async (url: string): Promise<AbilityDetail> => {
    const { data } = await api.get(url);
    return data;
  },

  getItemDetails: async (name: string): Promise<ItemDetail> => {
    const { data } = await api.get(
      `/item/${name.toLowerCase().replace(" ", "-")}`,
    );
    return data;
  },

  getAllItemNames: async (): Promise<string[]> => {
    const { data } = await api.get("/item?limit=2000");
    return data.results.map((item: any) => item.name);
  },
};
