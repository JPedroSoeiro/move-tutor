"use client";

import { useState, useEffect } from "react";
import { PokemonSlot } from "@/components/PokemonSlot";
import { pokemonService } from "@/services/pokemonService";
import {
  OFFENSIVE_CHART,
  WEAKNESS_CHART,
  TYPE_COLORS,
} from "@/constants/typeChart";

export default function Home() {
  const [allNames, setAllNames] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<Record<number, any>>({});

  // Carrega nomes para Autocomplete e recupera time salvo
  useEffect(() => {
    pokemonService.getAllNames().then(setAllNames);
    const saved = localStorage.getItem("move-tutor-team");
    if (saved) setTeamData(JSON.parse(saved));
  }, []);

  // Salva no LocalStorage sempre que o time mudar
  const handleUpdateSlot = (idx: number, data: any) => {
    const updatedTeam = { ...teamData, [idx]: data };
    setTeamData(updatedTeam);
    localStorage.setItem("move-tutor-team", JSON.stringify(updatedTeam));
  };

  // Lógica: Cobertura Ofensiva (Quais tipos eu NÃO bato super efetivo)
  const getMissingCoverage = () => {
    const activeMoveTypes = Object.values(teamData).flatMap(
      (slot: any) => slot.moveTypes || [],
    );
    const covered = new Set<string>();
    activeMoveTypes.forEach((type) => {
      OFFENSIVE_CHART[type]?.forEach((target) => covered.add(target));
    });
    return Object.keys(OFFENSIVE_CHART).filter((type) => !covered.has(type));
  };

  // Lógica: Fraquezas Defensivas (Onde meu time apanha)
  const getDefensiveWeaknesses = () => {
    const counts: Record<string, number> = {};
    Object.values(teamData).forEach((slot: any) => {
      slot.pokemon?.types.forEach((t: any) => {
        // Adicionamos ': string' ao parâmetro 'w'
        WEAKNESS_CHART[t.type.name as keyof typeof WEAKNESS_CHART]?.forEach(
          (w: string) => {
            counts[w] = (counts[w] || 0) + 1;
          },
        );
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  // Lógica: Dicas de Sinergia Inteligentes
  const getSynergyTips = () => {
    const tips = [];
    const weaknesses = getDefensiveWeaknesses();
    const coverage = getMissingCoverage();

    if (weaknesses.some(([_, count]) => count >= 3)) {
      const critical = weaknesses.find(([_, count]) => count >= 3)?.[0];
      tips.push(
        `⚠️ Alerta Crítico: Seu time tem muita fraqueza a ${critical?.toUpperCase()}.`,
      );
    }
    if (coverage.length > 10) {
      tips.push(
        "💡 Ofensiva: Sua cobertura é baixa. Tente diversificar os tipos de ataques.",
      );
    }
    if (Object.keys(teamData).length === 6 && coverage.length === 0) {
      tips.push(
        "🏆 Perfeito! Seu time tem resposta ofensiva para todos os tipos do jogo.",
      );
    }

    return tips;
  };

  const exportToShowdown = () => {
    const text = Object.values(teamData)
      .map((slot: any) => {
        if (!slot.pokemon) return "";
        let str = `${slot.pokemon.name}\nAbility: ${slot.ability || "None"}\n`;
        slot.moveTypes?.forEach((type: string, i: number) => {
          str += `- Move ${i + 1}\n`;
        });
        return str;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("Time copiado para o formato Showdown!");
  };

  const missing = getMissingCoverage();
  const defWeaknesses = getDefensiveWeaknesses();
  const tips = getSynergyTips();

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      {/* Background Decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic">
              MOVE <span className="text-blue-500">TUTOR</span> PRO
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">
              Análise de cobertura e sinergia para treinadores de elite.
            </p>
          </div>
          <button
            onClick={exportToShowdown}
            className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            EXPORTAR SHOWDOWN
          </button>
        </header>

        {/* Grid de 6 Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[...Array(6)].map((_, i) => (
            <PokemonSlot
              key={i}
              index={i}
              allNames={allNames}
              onUpdate={handleUpdateSlot}
            />
          ))}
        </div>

        {/* Painéis de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna 1: Cobertura e Fraquezas */}
          <div className="space-y-8">
            <section className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest border-l-4 border-blue-500 pl-4">
                Tipos sem Cobertura Ofensiva
              </h2>
              <div className="flex flex-wrap gap-2">
                {missing.length === 0 ? (
                  <p className="text-green-500 font-bold italic">
                    Cobertura Total Alcançada!
                  </p>
                ) : (
                  missing.map((type) => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white ${TYPE_COLORS[type]} shadow-lg`}
                    >
                      {type}
                    </span>
                  ))
                )}
              </div>
            </section>

            <section className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest border-l-4 border-red-500 pl-4">
                Ameaças ao seu Time (Defensivo)
              </h2>
              <div className="flex flex-wrap gap-3">
                {defWeaknesses.map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-xl border border-white/5"
                  >
                    <span
                      className={`w-3 h-3 rounded-full ${TYPE_COLORS[type]}`}
                    />
                    <span className="text-[10px] font-bold uppercase">
                      {type}
                    </span>
                    <span className="text-[10px] text-zinc-500">{count}x</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Coluna 2: Dicas de Sinergia */}
          <section className="p-8 bg-blue-500/5 backdrop-blur-md rounded-3xl border border-blue-500/20">
            <h2 className="text-sm font-black text-blue-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Sinergia e Estratégia
            </h2>
            <div className="space-y-4">
              {tips.length > 0 ? (
                tips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-zinc-300 leading-relaxed italic"
                  >
                    {tip}
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">
                  Adicione Pokémon ao seu time para receber dicas de sinergia.
                </p>
              )}
            </div>
          </section>
        </div>

        <footer className="mt-20 py-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
            Move Tutor Pro © 2026 • Powered by PokéAPI & Axios
          </p>
        </footer>
      </div>
    </main>
  );
}
