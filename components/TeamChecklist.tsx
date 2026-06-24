interface TeamChecklistProps {
  teamData: Record<number, any>;
}

export function TeamChecklist({ teamData }: TeamChecklistProps) {
  const pokemonCount = Object.values(teamData).filter((p: any) => p?.pokemon).length;
  const movesComplete = Object.values(teamData).filter((p: any) =>
    p?.pokemon && p?.selectedMoves?.filter((m: any) => m).length === 4
  ).length;
  const itemsComplete = Object.values(teamData).filter((p: any) => p?.pokemon && p?.selectedItem).length;
  const abilitiesComplete = Object.values(teamData).filter((p: any) => p?.pokemon && p?.selectedAbility).length;
  const naturesComplete = Object.values(teamData).filter((p: any) => p?.pokemon && p?.selectedNature).length;

  const totalChecks = pokemonCount > 0 ? 5 : 0;
  const completedChecks = (pokemonCount === 6 ? 1 : 0) +
    (movesComplete === 6 ? 1 : 0) +
    (itemsComplete === 6 ? 1 : 0) +
    (abilitiesComplete === 6 ? 1 : 0) +
    (naturesComplete === 6 ? 1 : 0);

  const progress = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
  const isComplete = pokemonCount === 6 && movesComplete === 6 && itemsComplete === 6 && abilitiesComplete === 6 && naturesComplete === 6;

  const CheckItem = ({ label, current, total }: { label: string; current: number; total: number }) => {
    const isChecked = current === total && total > 0;
    return (
      <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all">
        <span className="text-[9px] font-bold uppercase text-zinc-300">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black ${isChecked ? "text-green-400" : "text-zinc-500"}`}>
            {current}/{total}
          </span>
          {isChecked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-[9px] font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        Team Checklist
      </h2>

      <div className="space-y-2 mb-4">
        <CheckItem label="Pokémons" current={pokemonCount} total={6} />
        <CheckItem label="Moves (4 cada)" current={movesComplete} total={6} />
        <CheckItem label="Items" current={itemsComplete} total={6} />
        <CheckItem label="Abilities" current={abilitiesComplete} total={6} />
        <CheckItem label="Natures" current={naturesComplete} total={6} />
      </div>

      {pokemonCount > 0 && (
        <div className="space-y-3 pt-3 border-t border-white/5">
          {/* Progress Bar */}
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all ${isComplete ? "bg-green-500" : "bg-blue-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status */}
          <div className="text-center">
            {isComplete ? (
              <p className="text-[9px] font-black text-green-400 uppercase tracking-wide">
                ✓ TIME PRONTO PARA USAR!
              </p>
            ) : (
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wide">
                {progress}% Completo
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
