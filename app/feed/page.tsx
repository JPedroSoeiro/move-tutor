"use client";

import { useEffect, useState } from "react";
import { teamService } from "@/services/teamService";

export default function FeedPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAllTeams();
        setTeams(data);
      } catch (error: any) {
        console.error("Erro na busca de times:", error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Tactical <span className="text-blue-500">Feed</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">
          Relatórios de Campo da Comunidade VGC
        </p>
      </header>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mb-4"></div>
          <p className="animate-pulse text-blue-500 font-black uppercase text-[10px] tracking-widest">
            Sincronizando Laboratório...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.length > 0 ? (
            teams.map((team: any) => (
              <div 
                key={team.id} 
                className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden hover:border-blue-500/40 transition-all duration-500 group"
              >
                {/* Header da Publicação: Identidade do Treinador */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-white/5 bg-white/0.01">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-600/20 border border-white/10 italic">
                      {/* Pega as iniciais do autor do time */}
                      {(team.author_name || team.user?.full_name || "MT").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-white uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                        {team.author_name || team.user?.full_name || "Treinador Desconhecido"}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase italic tracking-tight">
                        Publicou uma nova Build
                      </span>
                    </div>
                  </div>
                  <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                    REGULATION G
                  </div>
                </div>

                {/* Corpo do Card: Squad Showcase */}
                <div className="p-8">
                  <h3 className="text-2xl font-black italic uppercase text-white mb-6 tracking-tighter group-hover:translate-x-1 transition-transform">
                    {team.name}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {team.pokemons?.map((p: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center relative hover:bg-blue-600/5 hover:border-blue-500/20 transition-all group/pkmn"
                      >
                        <img 
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon_id}.png`} 
                          alt="pkmn" 
                          className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover/pkmn:scale-110 transition-transform" 
                        />
                        <span className="absolute bottom-2 text-[8px] font-black text-zinc-600 uppercase group-hover/pkmn:text-blue-400">
                           {p.name || `PKMN #${p.pokemon_id}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rodapé: Ações da Comunidade */}
                <div className="px-8 py-4 bg-white/0.02 flex justify-between items-center">
                  <button className="text-[10px] font-black text-blue-500 uppercase italic hover:tracking-widest transition-all">
                    Analisar Detalhes →
                  </button>
                  <div className="flex gap-4">
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">Clonar Build</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">Reportar</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-[40px] text-center">
              <p className="text-zinc-600 text-xs italic font-black uppercase tracking-[0.2em]">
                O Laboratório está vazio. Seja o primeiro a publicar.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}