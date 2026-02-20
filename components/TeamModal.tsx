"use client";

export function TeamModal({ team, onClose }: { team: any, onClose: () => void }) {
  if (!team) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-32px w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">
              {team.team_name || team.name}
            </h2>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
              Data Sheet • {team.author_name}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-zinc-500 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5"
          >
            Fechar [X]
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {team.pokemons?.map((p: any, idx: number) => (
            <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="col-span-4">
                <h4 className="text-sm font-black italic uppercase text-blue-500 truncate">{p.name}</h4>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase italic">Item: {p.item}</span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">Ability: {p.ability}</span>
                </div>
              </div>

              <div className="col-span-3 text-center border-x border-white/5">
                <span className="block text-[7px] text-zinc-600 font-black uppercase italic mb-1">Nature</span>
                <span className="text-[9px] text-white font-bold uppercase italic">{p.nature || "Hardy"}</span>
              </div>

              <div className="col-span-5 flex flex-wrap gap-1">
                {p.moves?.map((move: string, mIdx: number) => (
                  <span key={mIdx} className="text-[7px] font-black text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5 uppercase">
                    {move}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}