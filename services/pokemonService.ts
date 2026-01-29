import axios from "axios";

const api = axios.create({ baseURL: "https://pokeapi.co/api/v2" });
const GQL_ENDPOINT = "https://beta.pokeapi.co/graphql/v1beta";

const STAT_MAP: Record<string, number> = {
  hp: 1,
  attack: 2,
  defense: 3,
  "special-attack": 4,
  "special-defense": 5,
  speed: 6,
};

export const pokemonService = {
  getAllNames: async () => {
    const { data } = await api.get("/pokemon?limit=2000");
    return data.results.map((p: any) => p.name);
  },

  // BUSCA DE ITENS BLINDADA (IGUAL AOS POKÉMON)
  getAllItemNames: async () => {
    try {
      const { data } = await api.get("/item?limit=2100");

      // LISTA NEGRA AMPLIADA
      const forbiddenTerms = [
        "tm",
        "hm",
        "tr-",
        "data-card",
        "ticket",
        "pass",
        "parcel",
        "letter",
        "voucher",
        "dex",
        "id-card",
        "permit",
        "machine",
        "key",
        "journal",
        "lens",
        "tea",
        "candy",
        "fossil",
        "shard",
        "sweet",
        "sticker",
        "dynamax",
        "crystal",
        "z-crystal",
        "max-honey", // Removendo Dynamax e Cristais
      ];

      const captureBalls = [
        "poke-ball",
        "great-ball",
        "ultra-ball",
        "master-ball",
        "premier-ball",
        "heal-ball",
        "net-ball",
        "nest-ball",
        "timer-ball",
        "repeat-ball",
        "luxury-ball",
        "quick-ball",
        "dusk-ball",
        "cherish-ball",
        "park-ball",
        "dream-ball",
        "beast-ball",
        "safari-ball",
        "sport-ball",
        "strange-ball",
      ];

      return data.results
        .map((i: any) => i.name)
        .filter((name: string) => {
          const lowerName = name.toLowerCase();
          const isForbidden = forbiddenTerms.some((term) =>
            lowerName.includes(term),
          );
          const isCaptureBall = captureBalls.includes(lowerName);

          return !isForbidden && !isCaptureBall;
        })
        .sort();
    } catch (e) {
      console.error("Erro ao buscar itens:", e);
      return [];
    }
  },

  getPokemonByName: async (name: string) => {
    const { data } = await api.get(`/pokemon/${name.toLowerCase()}`);
    return data;
  },

  getItemDetails: async (name: string) => {
    const formattedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const { data } = await api.get(`/item/${formattedName}`);
    return data;
  },

  getAbilityDetails: async (url: string) => {
    const { data } = await axios.get(url);
    return data;
  },

  getMoveDetails: async (url: string) => {
    const { data } = await axios.get(url);
    return data;
  },

  getSimilarStats: async (statName: string, value: number) => {
    const statId = STAT_MAP[statName];
    const query = `
      query getSimilar($statId: Int, $min: Int, $max: Int) {
        pokemon: pokemon_v2_pokemon(where: {
          pokemon_v2_pokemonstats: {stat_id: {_eq: $statId}, base_stat: {_gte: $min, _lte: $max}},
          is_default: {_eq: true}
        }, limit: 6) {
          id, name,
          stats: pokemon_v2_pokemonstats(where: {stat_id: {_eq: $statId}}) { base_stat }
        }
      }
    `;

    const response = await fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { statId, min: value - 5, max: value + 5 },
      }),
    });

    const resData = await response.json();
    if (!resData?.data) return [];

    return resData.data.pokemon.map((p: any) => ({
      id: p.id,
      name: p.name,
      value: p.stats[0].base_stat,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
    }));
  },
};
