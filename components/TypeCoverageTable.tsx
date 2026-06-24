import { TYPE_COLORS } from "@/constants/typeChart";

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

interface TypeCoverageTableProps {
  teamData: Record<number, any>;
}

export function TypeCoverageTable({ teamData }: TypeCoverageTableProps) {
  const typeEffectiveness: Record<string, Record<string, number>> = {
    fire: { bug: 2, steel: 2, grass: 2, ice: 2, fairy: 2 },
    water: { fire: 2, ground: 2, rock: 2 },
    grass: { water: 2, ground: 2, rock: 2 },
    electric: { water: 2, flying: 2 },
    ice: { flying: 2, ground: 2, grass: 2, dragon: 2 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2 },
    poison: { grass: 2, fairy: 2 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2 },
    flying: { fighting: 2, bug: 2, grass: 2 },
    psychic: { fighting: 2, poison: 2 },
    bug: { grass: 2, psychic: 2, dark: 2 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2 },
    ghost: { psychic: 2, ghost: 2 },
    dragon: { dragon: 2 },
    dark: { psychic: 2, ghost: 2 },
    steel: { ice: 2, rock: 2, fairy: 2 },
    fairy: { fighting: 2, poison: 2, dark: 2 },
  };

  const getCoverage = (type: string) => {
    let count4x = 0;
    let count2x = 0;

    Object.values(teamData).forEach((slot: any) => {
      if (!slot?.selectedMoves) return;

      slot.selectedMoves.forEach((move: any) => {
        if (!move) return;
        const moveType = move.type?.name?.toLowerCase();
        if (!moveType) return;

        const effectiveness = typeEffectiveness[moveType]?.[type] || 1;
        if (effectiveness === 2) count2x++;
      });
    });

    return { count2x, count4x };
  };

  return (
    <section className="lg:col-span-2 p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-[9px] font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2 mb-5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h2v-2H7v2zm0 4h2v-2H7v2zm0-8h2V7H7v2zm4 4h2v-2h-2v2zm0 4h2v-2h-2v2zm0-8h2V7h-2v2zm4 4h2v-2h-2v2zm0 4h2v-2h-2v2zm0-8h2V7h-2v2z" />
        </svg>
        Type Coverage
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-[8px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-2 py-2 font-black uppercase text-zinc-400 tracking-wider">Type</th>
              <th className="text-center px-2 py-2 font-black uppercase text-zinc-400 tracking-wider">2x</th>
              <th className="text-center px-2 py-2 font-black uppercase text-zinc-400 tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="space-y-1">
            {ALL_TYPES.map((type) => {
              const { count2x } = getCoverage(type);
              const isCovered = count2x > 0;

              return (
                <tr key={type} className="hover:bg-white/5 transition-colors border-b border-white/5">
                  <td className="px-2 py-1.5 font-bold uppercase text-zinc-300 capitalize">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[7px] font-black text-white ${TYPE_COLORS[type]}`}
                    >
                      {type}
                    </span>
                  </td>
                  <td className="text-center px-2 py-1.5 font-black text-yellow-400">
                    {count2x > 0 ? count2x : "-"}
                  </td>
                  <td className="text-center px-2 py-1.5">
                    {isCovered ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-green-400 inline">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    ) : (
                      <span className="text-red-400 font-black">✕</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[8px] text-zinc-500 italic mt-4 pt-3 border-t border-white/5">
        Mostra quantos pokémons conseguem fazer 2x de dano em cada tipo
      </p>
    </section>
  );
}
