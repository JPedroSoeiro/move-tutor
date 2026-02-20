"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { teamService } from "@/services/teamService";

export function ProfileView({ data, isOwnProfile, onTeamDeleted }: any) {
  const { data: session } = useSession();
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  const handleDelete = async (teamId: string) => {
    if (!confirm("Deseja deletar este relatório tático?")) return;
    try {
      await teamService.deleteTeam(teamId);
      onTeamDeleted(teamId);
    } catch (error) {
      alert("Erro ao deletar o post.");
    }
  };

  return (
  <div className="max-w-7xl mx-auto space-y-12 px-4 pb-20">
    {/* Header Estilo Instagram */}
    <div className="flex items-center gap-10 mb-12 border-b border-white/5 pb-12 pt-1">
      <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-black border-4 border-white/10 shadow-2xl text-white italic shrink-0">
        {(data.username || "T").substring(0, 2).toUpperCase()}
      </div>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">
          {data.username}
        </h2>
        <div className="flex gap-8">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            <strong className="text-white text-lg">{data.count}</strong> Times Criados
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">Mestre Pokémon</span>
        </div>
      </div>
    </div>

    {/* Grid de Cards - Ajustado para 3 colunas */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.teams?.map((team: any) => (
        <div 
          key={team.id} 
          className="bg-[#0a0a0a] border border-white/5 rounded-32px overflow-hidden hover:border-blue-500/20 transition-all group flex flex-col"
        >
          {/* Header do Post - Compacto para Grid */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white italic">
                {(team.author_name || "T").substring(0, 2).toUpperCase()}
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{team.author_name}</span>
            </div>

            {isOwnProfile && (
              <button 
                onClick={() => handleDelete(team.id)}
                className="text-[8px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Apagar
              </button>
            )}
          </div>

          {/* Corpo do Post - Ajustado para o tamanho da coluna */}
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-black italic uppercase text-white tracking-tighter truncate pr-2">
                {team.team_name || team.name}
              </h3>
              <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full shrink-0">
                TEAM
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 cursor-pointer" onClick={() => setSelectedTeam(team)}>
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

          {/* Footer - Botão Full Width */}
          <div className="px-6 py-4 bg-white/5 flex justify-center items-center border-t border-white/5">
            <button onClick={() => setSelectedTeam(team)} className="text-[9px] font-black text-blue-500 uppercase italic hover:tracking-widest transition-all">
              Ver Detalhes da Build →
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Modal Detalhado */}
    {selectedTeam && (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-32px w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <div>
                      <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">{selectedTeam.team_name || selectedTeam.name}</h2>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Data Sheet • {selectedTeam.author_name}</span>
                  </div>
                  <button onClick={() => setSelectedTeam(null)} className="px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-zinc-500 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5">
                      Fechar [X]
                  </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
                  {selectedTeam.pokemons?.map((p: any, idx: number) => (
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
                                  <span key={mIdx} className="text-[7px] font-black text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5 uppercase">{move}</span>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    )}
  </div>
  );
}