import { OFFENSIVE_CHART, WEAKNESS_CHART } from "@/constants/typeChart";

export function useTeamAnalysis(teamData: Record<number, any>) {
  const getMissingCoverage = () => {
    const activeMoveTypes = Object.values(teamData).flatMap(
      (slot: any) => slot.moveTypes || [],
    );
    const covered = new Set<string>();
    activeMoveTypes.forEach((type) => {
      OFFENSIVE_CHART[type]?.forEach((target) => covered.add(target));
    });
    return Object.keys(OFFENSIVE_CHART).filter((type) => !covered.has(type));
  };

  const getDefensiveWeaknesses = (): [string, number][] => {
    const counts: Record<string, number> = {};
    Object.values(teamData).forEach((slot: any) => {
      slot.pokemon?.types.forEach((t: any) => {
        WEAKNESS_CHART[t.type.name]?.forEach((w: string) => {
          counts[w] = (counts[w] || 0) + 1;
        });
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]) as [
      string,
      number,
    ][];
  };

  const getSynergyTips = () => {
    const tips = [];
    const weaknesses = getDefensiveWeaknesses();
    const coverage = getMissingCoverage();
    if (weaknesses.some(([_, count]) => count >= 3)) {
      tips.push(
        `⚠️ ALERTA: Seu time tem fraqueza acumulada contra ${weaknesses[0][0].toUpperCase()}.`,
      );
    }
    if (Object.keys(teamData).length > 0 && coverage.length > 10) {
      tips.push(
        "💡 DICA: Melhore sua cobertura ofensiva variando os tipos de golpes.",
      );
    }
    return tips;
  };

  return {
    missing: getMissingCoverage(),
    defWeaknesses: getDefensiveWeaknesses(),
    tips: getSynergyTips(),
  };
}
