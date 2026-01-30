"use client";

import { useState, useEffect } from "react";
import { PokemonSlot } from "@/components/PokemonSlot";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { useTeamAnalysis } from "@/hooks/useTeamAnalysis";
import { useStatScout } from "@/hooks/useStatScout";
import { pokemonService } from "@/services/pokemonService";

export default function Home() {
  const [allNames, setAllNames] = useState<string[]>([]);
  const [allItemNames, setAllItemNames] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<Record<number, any>>({});
  const [showCard, setShowCard] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // 1. EXTRAIA O 'nemesis' AQUI
  const { missing, defWeaknesses, tips, nemesis } = useTeamAnalysis(teamData);
  const { comparing, results, loading, findSimilar, close } = useStatScout();

  useEffect(() => {
    pokemonService.getAllNames().then(setAllNames);
    pokemonService.getAllItemNames().then(setAllItemNames);

    const saved = localStorage.getItem("move-tutor-pro-team");
    if (saved) {
      try {
        setTeamData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar time", e);
      }
    }
  }, []);

  const handleUpdateSlot = (idx: number, data: any) => {
    setTeamData((prev) => {
      const newTeam = { ...prev };
      if (data === null) {
        delete newTeam[idx];
      } else {
        newTeam[idx] = data;
      }
      localStorage.setItem("move-tutor-pro-team", JSON.stringify(newTeam));
      return newTeam;
    });
  };

  const confirmClearStorage = () => {
    localStorage.removeItem("move-tutor-pro-team");
    setTeamData({});
    setIsClearModalOpen(false);
    window.location.reload();
  };

  const exportToShowdown = () => {
    const text = Object.values(teamData)
      .map((s: any) => {
        if (!s.pokemon) return "";
        let str = `${s.pokemon.name} ${s.isShiny ? "(S)" : ""} @ ${s.item || "No Item"}\n`;
        str += `Ability: ${s.ability || "None"}\nNature: ${s.nature || "Hardy"}\n`;
        s.selectedMoves?.forEach((m: any) => {
          if (m) str += `- ${m.name}\n`;
        });
        return str;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("Time copiado!");
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 overflow-x-hidden font-sans">
      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              MOVE <span className="text-blue-500">Tutor</span> PRO
            </h1>
            <p className="text-zinc-500 mt-2 font-bold text-[10px] uppercase tracking-[0.3em]">
              Tactical Lab
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCard(true)}
              className="px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg hover:bg-blue-500 transition-all active:scale-95"
            >
              GERAR CARD
            </button>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="px-6 py-4 bg-red-600/10 text-red-500 border border-red-500/20 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
              LIMPAR TUDO
            </button>
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[...Array(6)].map((_, i) => (
            <PokemonSlot
              key={i}
              index={i}
              allNames={allNames}
              allItemNames={allItemNames}
              initialData={teamData[i]}
              onUpdate={handleUpdateSlot}
              onCompare={(pkmn, stat, val) => findSimilar(pkmn, stat, val)}
            />
          ))}
        </div>

        <div className="flex justify-center mb-20">
          <button
            onClick={exportToShowdown}
            className="px-6 py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg tracking-widest uppercase"
          >
            EXPORTAR SHOWDOWN
          </button>
        </div>

        {/* 2. PASSE O 'nemesis' PARA O DASHBOARD AQUI */}
        <AnalysisDashboard
          missing={missing}
          defWeaknesses={defWeaknesses}
          tips={tips}
          nemesis={nemesis}
        />

        {/* MODAL STAT SCOUT */}
        {comparing && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[40px] shadow-2xl relative">
              <button
                onClick={close}
                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">
                Stat <span className="text-blue-500">Scout</span>
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                Comparando {comparing.name.replace("-", " ")} de{" "}
                {comparing.pkmnName}
              </p>
              <div className="space-y-3">
                {loading ? (
                  <div className="py-20 text-center animate-pulse text-blue-500 font-black">
                    CONSULTANDO...
                  </div>
                ) : results.length > 0 ? (
                  results.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl border-l-4 border-l-blue-500/50 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={p.sprite}
                          className="w-12 h-12 object-contain"
                          alt="pkmn"
                        />
                        <span className="font-black text-white uppercase text-sm italic">
                          {p.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-blue-400">
                          {p.value}
                        </span>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase">
                          Base
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-20 text-center text-zinc-500 text-[10px] font-bold uppercase">
                    Nenhum pokemon proximo.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL LIMPAR */}
        {isClearModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 p-10 rounded-[40px] shadow-2xl text-center">
              <h2 className="text-2xl font-black text-white mb-2 uppercase">
                Resetar?
              </h2>
              <p className="text-zinc-500 text-sm mb-10 italic">
                Essa ação apagará todo o time.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-300 font-bold rounded-2xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmClearStorage}
                  className="flex-1 px-6 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CARD */}
        {showCard && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-12 rounded-[50px] shadow-2xl text-center">
              <button
                onClick={() => setShowCard(false)}
                className="absolute top-8 right-10 text-zinc-500 hover:text-white transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h2 className="text-3xl font-black text-white italic mb-12 uppercase tracking-tighter">
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
                          className="w-20 h-20 object-contain drop-shadow-2xl"
                          alt="pkmn"
                        />
                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em]">
                          {teamData[i].pokemon.name}
                        </span>
                      </>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-800 text-3xl font-black italic">
                        ?
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
