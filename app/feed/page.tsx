"use client";

import { useEffect, useState } from "react";
import { teamService } from "@/services/teamService";

// O "enviado" é a exportação padrão que o Next.js exige
export default function FeedPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Busca os times salvos no seu banco de dados local
        const data = await teamService.getAllTeams();
        setTeams(data);
      } catch (error) {
        console.error("Erro ao carregar o feed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Tactical <span className="text-blue-500">Feed</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
          Exploração de builds da comunidade
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-blue-500 font-black uppercase text-xs">
          Sincronizando Laboratório...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.length > 0 ? (
            teams.map((team: any) => (
              <div key={team.id} className="bg-white/5 border border-white/10 p-6 rounded-32px] hover:border-blue-500/30 transition-all">
                <h3 className="text-white font-black uppercase text-sm mb-4 italic">{team.name}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {/* Renderização simplificada dos sprites do time */}
                  {team.pokemons?.map((p: any, idx: number) => (
                    <div key={idx} className="bg-black/20 p-2 rounded-xl flex items-center justify-center">
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon_id}.png`} alt="pkmn" className="w-12 h-12 object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 text-xs italic font-medium">Nenhum time encontrado no banco de dados.</p>
          )}
        </div>
      )}
    </div>
  );
}