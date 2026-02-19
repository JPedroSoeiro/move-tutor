"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { teamService } from "@/services/teamService";

export default function FeedPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  // Busca os times ao carregar a página
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAllTeams();
        setTeams(data);
      } catch (error) {
        console.error("Erro ao carregar feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleDelete = async (teamId: string) => {
    if (!confirm("Deseja deletar este relatório tático?")) return;

    try {
      // Implementaremos esta função no teamService em seguida
      await teamService.deleteTeam(teamId);
      setTeams(teams.filter((t) => t.id !== teamId));
    } catch (error) {
      alert("Erro ao deletar o post.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Tactical <span className="text-blue-500">Feed</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">
          Relatórios de Campo da Comunidade VGC
        </p>
      </header>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-12">
          {teams.map((team) => (
            <div 
              key={team.id} 
              onClick={() => setSelectedTeam(team)}
              className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden hover:border-blue-500/20 transition-all group"
            >
              {/* Header do Post - Estilo Instagram */}
              <div className="px-8 py-5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white italic">
                    {(team.author_name || "T").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase tracking-wider">
                      {team.author_name || "Treinador"}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold italic uppercase">
                      Mestre Pokémon
                    </span>
                  </div>
                </div>

                {/* Botão de Apagar (Apenas se o ID do autor for igual ao ID da sessão) */}
                {session?.user?.id === team.user_id && (
                  <button 
                    onClick={() => handleDelete(team.id)}
                    className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    Apagar Post
                  </button>
                )}
              </div>

              {/* Corpo do Post - Squad Pro Preview */}
              <div className="p-8">
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">
                    {team.name}
                  </h3>
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                    TEAM
                  </span>
                </div>

                {/* Grid de Pokémon - Baseado na sua imagem */}
                <div className="grid grid-cols-3 gap-4 cursor-pointer">
                  {team.pokemons?.map((p: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-zinc-900/40 border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center group/pkmn hover:bg-blue-600/5 transition-all"
                    >
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon_id}.png`} 
                        alt={p.name}
                        className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover/pkmn:scale-110 transition-transform"
                      />
                      <span className="mt-2 text-[8px] font-black text-zinc-600 uppercase group-hover/pkmn:text-blue-400">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer - Ações */}
              <div className="px-8 py-4 bg-white/0.02 flex justify-between items-center border-t border-white/5">
                <button className="text-[10px] font-black text-blue-500 uppercase italic hover:tracking-widest transition-all">
                  Ver Detalhes da Build →
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}

{selectedTeam && (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-[#0a0a0a] border border-white/10 rounded-32px] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
      
      {/* Header Compacto com Botão Fechar */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">
            {selectedTeam.team_name}
          </h2>
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
            Data Sheet • {selectedTeam.author_name}
          </span>
        </div>
        
        <button 
          onClick={() => setSelectedTeam(null)}
          className="px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-zinc-500 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5"
        >
          Fechar [X]
        </button>
      </div>

      {/* Lista de Stats Sem Imagens */}
      <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {selectedTeam.pokemons?.map((p: any, idx: number) => (
          <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-white/0.02 p-4 rounded-2xl border border-white/5">
            
            {/* Nome e Info Básica */}
            <div className="col-span-4">
              <h4 className="text-sm font-black italic uppercase text-blue-500 truncate">{p.name}</h4>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[8px] font-bold text-zinc-400 uppercase italic">Item: {p.item}</span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase">Ability: {p.ability}</span>
              </div>
            </div>

            {/* Nature e Shiny Status */}
            <div className="col-span-3 text-center border-x border-white/5">
              <span className="block text-[7px] text-zinc-600 font-black uppercase italic mb-1">Nature</span>
              <span className="text-[9px] text-white font-bold uppercase italic">{p.nature || "Hardy"}</span>
              {p.is_shiny && (
                <span className="block text-[7px] text-yellow-500 font-black mt-1">★ SHINY</span>
              )}
            </div>

            {/* Moves em Lista Horizontal Compacta */}
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

      {/* Footer do Modal */}
      <div className="p-4 bg-white/0.01 text-center border-t border-white/5">
        <p className="text-[7px] text-zinc-700 font-black uppercase tracking-[0.3em]">
          Move Tutor • Tactical Intelligence Unit
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );
}