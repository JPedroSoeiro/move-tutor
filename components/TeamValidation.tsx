interface TeamValidationProps {
  teamData: Record<number, any>;
  missing: string[];
  defWeaknesses: [string, number][];
}

export function TeamValidation({ teamData, missing, defWeaknesses }: TeamValidationProps) {
  const warnings: string[] = [];
  const strengths: string[] = [];

  const pokemons = Object.values(teamData).filter((p: any) => p?.pokemon);

  // Check for missing hazard setters
  const hazardMoves = ["stealth-rock", "spikes", "toxic-spikes"];
  const hasHazardSetter = pokemons.some((p: any) =>
    p.selectedMoves?.some((m: any) => hazardMoves.includes(m?.name?.toLowerCase()))
  );
  if (!hasHazardSetter && pokemons.length > 0) {
    warnings.push("Falta Hazard Setter (Stealth Rock, Spikes)");
  } else if (hasHazardSetter) {
    strengths.push("✓ Tem Hazard Setter");
  }

  // Check for speed control
  const speedControlMoves = ["trick-room", "tailwind", "screens"];
  const hasSpeedControl = pokemons.some((p: any) =>
    p.selectedMoves?.some((m: any) =>
      ["trick-room", "tailwind", "light-screen", "reflect"].includes(m?.name?.toLowerCase())
    )
  );
  if (!hasSpeedControl && pokemons.length > 0) {
    warnings.push("Falta Speed Control (Trick Room, Tailwind)");
  }

  // Check for type coverage
  if (missing.length > 5) {
    warnings.push(`Cobertura ofensiva muito fraca (${missing.length} tipos faltando)`);
  } else if (missing.length === 0) {
    strengths.push("✓ Cobertura ofensiva completa");
  }

  // Check for defensive weaknesses
  const criticalWeaknesses = defWeaknesses.filter(([_, score]) => score >= 3);
  if (criticalWeaknesses.length > 3) {
    warnings.push(`Muitas fraquezas defensivas (${criticalWeaknesses.length} críticas)`);
  } else if (defWeaknesses.length === 0) {
    strengths.push("✓ Defesa bem equilibrada");
  }

  // Check for duplicate pokemon types
  const types = pokemons.flatMap((p: any) => p.pokemon.types.map((t: any) => t.type.name));
  const typeCount = new Map();
  types.forEach((t) => typeCount.set(t, (typeCount.get(t) || 0) + 1));

  const dominantType = Array.from(typeCount.entries()).find(([_, count]) => count >= 4);
  if (dominantType) {
    warnings.push(`Muitos pokémons ${dominantType[0]} (${dominantType[1]}/6)`);
  }

  // Check for diverse stats
  const hasPhysicalWalls = pokemons.some((p: any) =>
    p.pokemon.stats.find((s: any) => s.stat.name === "defense")?.base_stat >= 100
  );
  const hasSpecialWalls = pokemons.some((p: any) =>
    p.pokemon.stats.find((s: any) => s.stat.name === "sp-defense")?.base_stat >= 100
  );

  if (hasPhysicalWalls && hasSpecialWalls) {
    strengths.push("✓ Bom mix defensivo");
  }

  return (
    <section className="lg:col-span-2 p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-[9px] font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
        Team Validation
      </h2>

      {pokemons.length === 0 ? (
        <p className="text-[9px] text-zinc-600 italic uppercase text-center py-6">
          Selecione pokémons para análise
        </p>
      ) : (
        <div className="space-y-4">
          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              <p className="text-[8px] font-black text-yellow-400 uppercase tracking-wider">⚠️ Avisos:</p>
              {warnings.map((warning, idx) => (
                <p key={idx} className="text-[8px] text-yellow-300 leading-relaxed">
                  • {warning}
                </p>
              ))}
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-white/10">
              <p className="text-[8px] font-black text-green-400 uppercase tracking-wider">✓ Pontos Fortes:</p>
              {strengths.map((strength, idx) => (
                <p key={idx} className="text-[8px] text-green-300 leading-relaxed">
                  {strength}
                </p>
              ))}
            </div>
          )}

          {/* No issues */}
          {warnings.length === 0 && strengths.length === 0 && (
            <p className="text-[9px] text-zinc-400 italic text-center py-4">
              Nenhum aviso detectado - time bem construído!
            </p>
          )}
        </div>
      )}
    </section>
  );
}
