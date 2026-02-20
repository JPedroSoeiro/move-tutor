"use client";

interface TeamCardProps {
  team: any;
  isOwnProfile?: boolean;
  onDelete?: (id: string) => void;
  onSelect: (team: any) => void;
}

export function TeamCard({ team, isOwnProfile, onDelete, onSelect }: TeamCardProps) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-32px overflow-hidden hover:border-blue-500/20 transition-all group flex flex-col h-full">
      {/* Header do Card */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white italic">
            {(team.author_name || "T").substring(0, 2).toUpperCase()}
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-wider">{team.author_name}</span>
        </div>
        {isOwnProfile && onDelete && (
          <button 
            onClick={() => onDelete(team.id)}
            className="text-[8px] font-black text-red-500/50 hover:text-red-500 uppercase transition-colors"
          >
            Apagar
          </button>
        )}
      </div>

      {/* Corpo com Pokémons */}
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-black italic uppercase text-white tracking-tighter truncate pr-2">
            {team.team_name || team.name}
          </h3>
          <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full shrink-0">
            {team.regulation || "VGC"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 cursor-pointer" onClick={() => onSelect(team)}>
          {team.pokemons?.map((p: any, idx: number) => (
            <div key={idx} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-2 flex flex-col items-center justify-center group/pkmn hover:bg-blue-600/5 transition-all">
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon_id}.png`} 
                className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.2)] group-hover/pkmn:scale-110 transition-transform"
                alt={p.name}
              />
              <span className="mt-1 text-[7px] font-black text-zinc-600 uppercase group-hover/pkmn:text-blue-400 truncate w-full text-center">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-white/5 border-t border-white/5">
        <button onClick={() => onSelect(team)} className="w-full text-[9px] font-black text-blue-500 uppercase italic hover:tracking-widest transition-all text-center">
          Ver Detalhes da Build →
        </button>
      </div>
    </div>
  );
}