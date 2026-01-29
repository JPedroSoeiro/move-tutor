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
  const [allItemNames, setAllItemNames] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<Record<number, any>>({});
  const [showCard, setShowCard] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  useEffect(() => {
    // Busca inicial de nomes de Pokémon e Itens
    pokemonService.getAllNames().then(setAllNames);
    pokemonService.getAllItemNames().then(setAllItemNames);

    // Recupera o progresso do LocalStorage
    const saved = localStorage.getItem("move-tutor-pro-team");
    if (saved) {
      try {
        setTeamData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao restaurar progresso.");
      }
    }
  }, []);

  // --- LÓGICAS DE ANÁLISE ---

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

  const getDefensiveWeaknesses = () => {
    const counts: Record<string, number> = {};
    Object.values(teamData).forEach((slot: any) => {
      slot.pokemon?.types.forEach((t: any) => {
        const typeName = t.type.name;
        WEAKNESS_CHART[typeName]?.forEach((w: string) => {
          counts[w] = (counts[w] || 0) + 1;
        });
      });
    });
    return Object.entries(counts).sort(
      (a, b) => (b[1] as number) - (a[1] as number),
    );
  };

  const getSynergyTips = () => {
    const tips = [];
    const weaknesses = getDefensiveWeaknesses();
    const coverage = getMissingCoverage();
    const slotCount = Object.keys(teamData).length;

    if (weaknesses.some(([_, count]) => (count as number) >= 3)) {
      const critical = weaknesses.find(
        ([_, count]) => (count as number) >= 3,
      )?.[0];
      tips.push(
        `⚠️ ALERTA CRÍTICO: Seu time tem 3+ Pokémon fracos contra ${critical?.toUpperCase()}. Considere um counter.`,
      );
    }
    if (slotCount > 0 && coverage.length > 10) {
      tips.push(
        "💡 ESTRATÉGIA: Sua cobertura ofensiva está baixa. Tente diversificar os tipos de ataques.",
      );
    }
    if (slotCount === 6 && coverage.length === 0) {
      tips.push(
        "🏆 EXCELENTE: Seu time possui golpes super efetivos contra todos os tipos!",
      );
    }

    return tips;
  };

  // --- HANDLERS ---

  const handleUpdateSlot = (idx: number, data: any) => {
    const updatedTeam = { ...teamData, [idx]: data };
    setTeamData(updatedTeam);
    localStorage.setItem("move-tutor-pro-team", JSON.stringify(updatedTeam));
  };

  const confirmClearStorage = () => {
    localStorage.removeItem("move-tutor-pro-team");
    setTeamData({});
    setIsClearModalOpen(false);
    window.location.reload();
  };

  const exportToShowdown = () => {
    const text = Object.values(teamData)
      .map((slot: any) => {
        if (!slot.pokemon) return "";
        let str = `${slot.pokemon.name} ${slot.isShiny ? "(S)" : ""} @ ${slot.item || "No Item"}\n`;
        str += `Ability: ${slot.ability || "None"}\n`;
        str += `Nature: ${slot.nature || "Hardy"}\n`;
        slot.selectedMoves?.forEach((move: any) => {
          if (move) str += `- ${move.name}\n`;
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
    <main className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className="relative max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic leading-none">
              MOVE <span className="text-blue-500 uppercase">Tutor</span> PRO
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">
              Análise estratégica para treinadores de elite.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCard(true)}
              className="px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              GERAR CARD
            </button>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="px-6 py-4 bg-red-600/10 text-red-500 border border-red-500/20 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-lg"
            >
              LIMPAR PROGRESSO
            </button>
          </div>
        </header>

        {/* Grid de Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[...Array(6)].map((_, i) => (
            <PokemonSlot
              key={i}
              index={i}
              allNames={allNames}
              allItemNames={allItemNames}
              initialData={teamData[i]}
              onUpdate={handleUpdateSlot}
            />
          ))}
        </div>

        {/* Botão Exportar Centralizado Abaixo dos Cards */}
        <div className="flex justify-center mb-20">
          <button
            onClick={exportToShowdown}
            className="px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
          >
            EXPORTAR SHOWDOWN
          </button>
        </div>

        {/* Painéis de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="space-y-8">
            <section className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
              <h2 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-4">
                Tipos sem Cobertura Ofensiva
              </h2>
              <div className="flex flex-wrap gap-2">
                {missing.length === 0 ? (
                  <p className="text-green-400 font-bold italic py-2">
                    ✓ Cobertura Ofensiva Total!
                  </p>
                ) : (
                  missing.map((type) => (
                    <span
                      key={type}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-white ${TYPE_COLORS[type]}`}
                    >
                      {type}
                    </span>
                  ))
                )}
              </div>
            </section>

            <section className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
              <h2 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em] border-l-4 border-red-500 pl-4">
                Ameaças ao seu Time (Defesa)
              </h2>
              <div className="flex flex-wrap gap-3">
                {defWeaknesses.length > 0 ? (
                  defWeaknesses.map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-white/5"
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${TYPE_COLORS[type]}`}
                      />
                      <span className="text-[10px] font-bold uppercase text-zinc-200">
                        {type}
                      </span>
                      <span
                        className={`text-[10px] font-black ${(count as number) >= 3 ? "text-red-500" : "text-zinc-500"}`}
                      >
                        {count}x
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-600 text-sm italic">
                    Adicione Pokémon para calcular fraquezas.
                  </p>
                )}
              </div>
            </section>
          </div>

          <section className="p-8 bg-blue-500/5 backdrop-blur-md rounded-3xl border border-blue-500/20 shadow-xl">
            <h2 className="text-sm font-black text-blue-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Sinergia e Estratégia
            </h2>
            <div className="space-y-4">
              {tips.length > 0 ? (
                tips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 text-xs text-zinc-300 italic"
                  >
                    {tip}
                  </div>
                ))
              ) : (
                <p className="text-zinc-600 text-sm italic">
                  O laboratório tático está aguardando seus Pokémon...
                </p>
              )}
            </div>
          </section>
        </div>

        {/* --- MODAIS --- */}

        {/* Modal de Confirmação de Limpeza */}
        {isClearModalOpen && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 p-10 rounded-[40px] shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">
                Limpar progresso?
              </h2>
              <p className="text-zinc-500 text-sm mb-10 font-medium italic">
                "Essa ação não pode ser revertida."
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmClearStorage}
                  className="flex-1 px-6 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal do Card de Time (Resumo) */}
        {showCard && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-12 rounded-[50px] shadow-2xl text-center">
              <button
                onClick={() => setShowCard(false)}
                className="absolute top-8 right-10 text-zinc-500 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <h2 className="text-3xl font-black text-white italic mb-12 tracking-tighter uppercase">
                Squad <span className="text-blue-500">PRO</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 shadow-inner"
                  >
                    {teamData[i]?.pokemon ? (
                      <>
                        <img
                          src={teamData[i].pokemon.sprites.front_default}
                          className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                          alt={teamData[i].pokemon.name}
                        />
                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] truncate w-full px-2">
                          {teamData[i].pokemon.name}
                        </span>
                      </>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-800 text-3xl font-black">
                        ?
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <footer className="mt-20 py-12 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em]">
            Move Tutor Pro © 2026 • Pedro's Tactical Lab
          </p>
        </footer>
      </div>
    </main>
  );
}
