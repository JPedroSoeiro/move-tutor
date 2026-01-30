import { WEAKNESS_CHART, TYPE_CHART } from "@/constants/typeChart";

export const COUNTER_SUGGESTIONS: Record<string, string[]> = {
  fire: [
    "Gyarados",
    "Garchomp",
    "Tyranitar",
    "Dondozo",
    "Gastrodon",
    "Azumarill",
    "Kingdra",
    "Quagsire",
  ],
  water: [
    "Rotom-Wash",
    "Venusaur",
    "Ferrothorn",
    "Meowscarada",
    "Rillaboom",
    "Amoonguss",
    "Serperior",
    "Breloom",
  ],
  grass: [
    "Volcarona",
    "Corviknight",
    "Dragonite",
    "Skeledirge",
    "Scizor",
    "Talonflame",
    "Salazzle",
    "Ceruledge",
  ],
  electric: [
    "Excadrill",
    "Garchomp",
    "Mamoswine",
    "Clodsire",
    "Gastrodon",
    "Hippowdon",
    "Steelix",
    "Nidoking",
  ],
  ice: [
    "Scizor",
    "Lucario",
    "Arcanine",
    "Kingambit",
    "Metagross",
    "Blaziken",
    "Volcarona",
    "Magmortar",
  ],
  fighting: [
    "Togekiss",
    "Gengar",
    "Gliscor",
    "Dragapult",
    "Mimikyu",
    "Skeledirge",
    "Gardevoir",
    "Corviknight",
  ],
  poison: [
    "Steelix",
    "Excadrill",
    "Gengar",
    "Metagross",
    "Garchomp",
    "Glimmora",
    "Kingambit",
    "Clodsire",
  ],
  ground: [
    "Corviknight",
    "Rotom-Wash",
    "Rillaboom",
    "Gyarados",
    "Venusaur",
    "Togekiss",
    "Pelipper",
    "Meowscarada",
  ],
  flying: [
    "Tyranitar",
    "Magnezone",
    "Mamoswine",
    "Rotom-Wash",
    "Garganacl",
    "Aerodactyl",
    "Electivire",
    "Glimmora",
  ],
  psychic: [
    "Tyranitar",
    "Scizor",
    "Hydreigon",
    "Kingambit",
    "Bisharp",
    "Gholdengo",
    "Grimmsnarl",
    "Umbreon",
  ],
  bug: [
    "Volcarona",
    "Talonflame",
    "Ceruledge",
    "Arcanine",
    "Corviknight",
    "Staraptor",
    "Skeledirge",
    "Salamence",
  ],
  rock: [
    "Lucario",
    "Garchomp",
    "Steelix",
    "Metagross",
    "Conkeldurr",
    "Ferrothorn",
    "Quaquaval",
    "Machamp",
  ],
  ghost: [
    "Tyranitar",
    "Bisharp",
    "Hydreigon",
    "Kingambit",
    "Grimmsnarl",
    "Gholdengo",
    "Zoroark-Hisui",
    "Umbreon",
  ],
  dragon: [
    "Sylveon",
    "Mamoswine",
    "Togekiss",
    "Gardevoir",
    "Azumarill",
    "Garchomp",
    "Dragapult",
    "Baxcalibur",
  ],
  dark: [
    "Lucario",
    "Togekiss",
    "Conkeldurr",
    "Annihilape",
    "Grimmsnarl",
    "Sylveon",
    "Clefable",
    "Breloom",
  ],
  steel: [
    "Volcarona",
    "Lucario",
    "Garchomp",
    "Skeledirge",
    "Arcanine",
    "Excadrill",
    "Blaziken",
    "Infernape",
  ],
  fairy: [
    "Scizor",
    "Excadrill",
    "Gengar",
    "Metagross",
    "Gholdengo",
    "Kingambit",
    "Toxapex",
    "Amoonguss",
  ],
};

export function useTeamAnalysis(teamData: Record<number, any>) {
  const getDefensiveWeaknesses = () => {
    const counts: Record<string, number> = {};
    Object.values(teamData).forEach((slot: any) => {
      if (!slot.pokemon) return;
      slot.pokemon.types.forEach((t: any) => {
        const typeWeaknesses = WEAKNESS_CHART[t.type.name] || [];
        typeWeaknesses.forEach((w: string) => {
          counts[w] = (counts[w] || 0) + 1;
        });
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const getMissingCoverage = () => {
    // PROTEÇÃO: Garante que TYPE_CHART exista antes de usar Object.keys
    if (!TYPE_CHART) return [];

    const coveredTypes = new Set<string>();
    Object.values(teamData).forEach((slot: any) => {
      if (slot.selectedMoves) {
        slot.selectedMoves.forEach((move: any) => {
          if (move && move.type) {
            const effectiveAgainst = TYPE_CHART[move.type.name] || [];
            effectiveAgainst.forEach((t: string) => coveredTypes.add(t));
          }
        });
      }
    });
    return Object.keys(TYPE_CHART).filter((type) => !coveredTypes.has(type));
  };

  const getNemesisData = () => {
    const weaknesses = getDefensiveWeaknesses();
    if (weaknesses.length === 0) return { suggestions: [], advice: null };

    const topWeakness = weaknesses[0][0];
    const suggestions = COUNTER_SUGGESTIONS[topWeakness] || [];
    const slots = Object.entries(teamData);

    if (slots.length >= 6) {
      const candidates = slots.map(([id, data]) => {
        let score = 0;
        const types = data.pokemon.types.map((t: any) => t.type.name);

        types.forEach((t: string) => {
          if (WEAKNESS_CHART[t]?.includes(topWeakness)) score += 20;
        });

        weaknesses.forEach(([wType, wScore]) => {
          types.forEach((t: string) => {
            if (WEAKNESS_CHART[t]?.includes(wType)) score += wScore;
          });
        });

        // PROTEÇÃO: Skeledirge e Dracovish são obrigatórios
        if (
          ["skeledirge", "dracovish"].includes(data.pokemon.name.toLowerCase())
        ) {
          score -= 100;
        }

        return { id, name: data.pokemon.name, score };
      });

      const weakestLink = candidates.sort((a, b) => b.score - a.score)[0];

      return {
        suggestions,
        advice: {
          replace: weakestLink.name,
          index: Number(weakestLink.id),
          reason: `ele é o membro mais vulnerável defensivamente neste time`,
        },
      };
    }
    return { suggestions, advice: null };
  };

  const getSynergyTips = () => {
    const tips: string[] = [];
    const pkmnNames = Object.values(teamData)
      .map((s: any) => s.pokemon?.name?.toLowerCase())
      .filter(Boolean);
    if (pkmnNames.includes("skeledirge") && pkmnNames.includes("dracovish")) {
      tips.push(
        "Sinergia Core: Skeledirge e Dracovish cobrem bem fraquezas mútuas.",
      );
    }
    return tips;
  };

  const nemesisData = getNemesisData();

  return {
    missing: getMissingCoverage(),
    defWeaknesses: getDefensiveWeaknesses(),
    tips: getSynergyTips(),
    nemesis: nemesisData.suggestions,
    replacementAdvice: nemesisData.advice,
  };
}
