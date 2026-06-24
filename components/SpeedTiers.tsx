interface SpeedTiersProps {
  teamData: Record<number, any>;
}

export function SpeedTiers({ teamData }: SpeedTiersProps) {
  const speedList = Object.values(teamData)
    .filter((p: any) => p?.pokemon)
    .map((p: any) => ({
      name: p.pokemon.name,
      speed: p.pokemon.stats.find((s: any) => s.stat.name === "speed")?.base_stat || 0,
    }))
    .sort((a, b) => b.speed - a.speed);

  const getSpeedLabel = (speed: number) => {
    if (speed >= 120) return "⚡⚡⚡ MUITO RÁPIDO";
    if (speed >= 100) return "⚡⚡ RÁPIDO";
    if (speed >= 75) return "⚡ NORMAL";
    if (speed >= 60) return "🐢 LENTO";
    return "🐢 MUITO LENTO";
  };

  const getSpeedColor = (speed: number) => {
    if (speed >= 120) return "text-green-400";
    if (speed >= 100) return "text-blue-400";
    if (speed >= 75) return "text-zinc-300";
    if (speed >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <section className="p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-[9px] font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        Speed Tiers
      </h2>

      {speedList.length === 0 ? (
        <p className="text-[9px] text-zinc-600 italic uppercase text-center py-6">
          Selecione pokémons para ver velocidades
        </p>
      ) : (
        <div className="space-y-2">
          {speedList.map((pokemon, idx) => (
            <div key={`${pokemon.name}-${idx}`} className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-[9px] font-black text-zinc-400 w-4 text-center">{idx + 1}.</span>
                <span className="text-[9px] font-bold uppercase text-white capitalize flex-1 truncate">
                  {pokemon.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[8px] font-black ${getSpeedColor(pokemon.speed)}`}>
                  {pokemon.speed}
                </span>
                <span className="text-[7px] text-zinc-500 w-12 text-right">
                  {getSpeedLabel(pokemon.speed)}
                </span>
              </div>
            </div>
          ))}

          {/* Speed Analysis */}
          {speedList.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Análise:</p>
              {speedList[0].speed < 100 && (
                <p className="text-[8px] text-yellow-400">
                  ⚠️ Seu pokémon mais rápido é lento para o meta atual
                </p>
              )}
              {speedList.filter((p) => p.speed >= 100).length < 2 && (
                <p className="text-[8px] text-yellow-400">
                  ⚠️ Faltam speed control (Trick Room, Tailwind)
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
