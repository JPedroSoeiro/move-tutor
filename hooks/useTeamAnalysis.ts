import { OFFENSIVE_CHART, WEAKNESS_CHART } from "@/constants/typeChart";

// Mapeamento para o Nemesis Finder sugerir counters baseados na fraqueza
const COUNTER_SUGGESTIONS: Record<string, string[]> = {
  fire: ["Gyarados", "Garchomp", "Tyranitar"],
  water: ["Rotom-Wash", "Venusaur", "Zapdos"],
  grass: ["Heatran", "Corviknight", "Dragonite"],
  electric: ["Excadrill", "Garchomp", "Mamoswine"],
  ice: ["Scizor", "Lucario", "Arcanine"],
  fighting: ["Togekiss", "Gengar", "Gliscor"],
  poison: ["Steelix", "Excadrill", "Gengar"],
  ground: ["Corviknight", "Rotom-Wash", "Rillaboom"],
  flying: ["Tyranitar", "Rotom-Frost", "Magnezone"],
  psychic: ["Tyranitar", "Scizor", "Hydreigon"],
  bug: ["Heatran", "Volcarona", "Talonflame"],
  rock: ["Lucario", "Garchomp", "Steelix"],
  ghost: ["Tyranitar", "Bisharp", "Hydreigon"],
  dragon: ["Sylveon", "Mamoswine", "Togekiss"],
  dark: ["Lucario", "Togekiss", "Conkeldurr"],
  steel: ["Heatran", "Lucario", "Garchomp"],
  fairy: ["Scizor", "Excadrill", "Gengar"],
};

export function useTeamAnalysis(teamData: Record<number, any>) {
  // 1. LÓGICA DE COBERTURA (CORRIGIDA)
  const getMissingCoverage = () => {
    const slots = Object.values(teamData);
    if (slots.length === 0) return [];

    // Pega todos os tipos de ataques selecionados no time todo
    const activeMoveTypes = slots.flatMap(
      (slot: any) =>
        slot.selectedMoves
          ?.filter((m: any) => m !== null)
          .map((m: any) => m.type.name) || [],
    );

    const covered = new Set<string>();
    activeMoveTypes.forEach((type) => {
      OFFENSIVE_CHART[type]?.forEach((target) => covered.add(target));
    });

    // Retorna tipos que NENHUM golpe do seu time bate Super Efetivo
    return Object.keys(OFFENSIVE_CHART).filter((type) => !covered.has(type));
  };

  // 2. AMEAÇAS DEFENSIVAS (SOMA ACUMULADA)
  const getDefensiveWeaknesses = (): [string, number][] => {
    const threatScores: Record<string, number> = {};
    const slots = Object.values(teamData).filter((s) => s.pokemon);

    if (slots.length === 0) return [];

    // Inicializa todos os tipos com score 0
    Object.keys(OFFENSIVE_CHART).forEach((type) => (threatScores[type] = 0));

    slots.forEach((slot: any) => {
      slot.pokemon.types.forEach((t: any) => {
        const typeName = t.type.name;
        // Para cada tipo que esse Pokémon é fraco, somamos 1 ao score global de ameaça
        WEAKNESS_CHART[typeName]?.forEach((weakAgainst: string) => {
          threatScores[weakAgainst] = (threatScores[weakAgainst] || 0) + 1;
        });
      });
    });

    // Retorna apenas tipos que representam ameaça (score > 0) ordenados pelo mais crítico
    return Object.entries(threatScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1]);
  };

  const getSynergyTips = () => {
    const tips = [];
    const weaknesses = getDefensiveWeaknesses();
    if (weaknesses.length > 0 && weaknesses[0][1] >= 3) {
      tips.push(
        `⚠️ CRÍTICO: Seu time tem ${weaknesses[0][1]} Pokémons fracos contra ${weaknesses[0][0].toUpperCase()}.`,
      );
    }
    return tips;
  };

  const getNemesisFinder = () => {
    const weaknesses = getDefensiveWeaknesses();
    if (weaknesses.length === 0) return [];
    const topWeakness = weaknesses[0][0];
    return COUNTER_SUGGESTIONS[topWeakness] || [];
  };

  return {
    missing: getMissingCoverage(),
    defWeaknesses: getDefensiveWeaknesses(),
    tips: getSynergyTips(),
    nemesis: getNemesisFinder(),
  };
}
