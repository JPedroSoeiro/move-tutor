"use client";

import { useState, useEffect, useRef } from "react";
import { PokemonSlot } from "@/components/PokemonSlot";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { useTeamAnalysis } from "@/hooks/useTeamAnalysis";
import { useStatScout } from "@/hooks/useStatScout";
import { pokemonService } from "@/services/pokemonService";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import { teamService } from "@/services/teamService";
import { useSession } from "next-auth/react";

// 1. PARSER FORA DO COMPONENTE (Evita erros de escopo e redeclaração)
const parseShowdown = (text: string) => {
  const blocks = text.split("\n\n").filter((block) => block.trim() !== "");
  const parsedTeam: Record<string, any> = {};

  blocks.forEach((block, index) => {
    if (index > 5) return;
    const lines = block.split("\n").map((l) => l.trim());
    const header = lines[0].split("@");
    const name = header[0].trim();
    const item = header[1] ? header[1].trim() : "";

    const abilityLine = lines.find((l) => l.startsWith("Ability:"));
    const natureLine = lines.find((l) => l.startsWith("Nature:"));
    const moves = lines
      .filter((l) => l.startsWith("-"))
      .map((l) => l.replace("-", "").trim());

    parsedTeam[index.toString()] = {
      pokemon: { name: name.toLowerCase() },
      selectedItem: { name: item.toLowerCase().replace(/ /g, "-") },
      selectedAbility: {
        name: abilityLine
          ? abilityLine.split(":")[1].trim().toLowerCase().replace(/ /g, "-")
          : "",
      },
      nature: natureLine
        ? natureLine.split(" ")[0].trim()
        : "Hardy",
      selectedMoves: moves.map((m) => ({
        name: m.toLowerCase().replace(/ /g, "-"),
      })),
    };
  });
  return parsedTeam;
};

export default function Home() {
  // 1. ESTADOS
  const [allNames, setAllNames] = useState<string[]>([]);
  const [allItemNames, setAllItemNames] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<Record<number, any>>({});
  const [showCard, setShowCard] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [pendingNemesis, setPendingNemesis] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const { data: session } = useSession();
  const [loginAlert, setLoginAlert] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 2. HOOKS DE LÓGICA (Mantidos conforme sua versão original)
  const { missing, defWeaknesses, tips, nemesis, replacementAdvice } = useTeamAnalysis(teamData);
  const { comparing, results, findSimilar, close } = useStatScout();

  // 3. EFEITOS (CARREGAMENTO INICIAL)
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

  // 4. EFEITO DE CARREGAMENTO DE RASCUNHO (Sincronização pós-login)
  useEffect(() => {
    const loadDraft = async () => {
      const pending = sessionStorage.getItem("@MoveTutor:pendingTeam");
      if (pending) {
        setTeamData(JSON.parse(pending));
        sessionStorage.removeItem("@MoveTutor:pendingTeam");
      }
    };
    loadDraft();
  }, []);

  // 5. FUNÇÕES DE SUPORTE E INTEGRAÇÃO
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

  const handleAddNemesis = (name: string) => {
    const filledIndices = Object.keys(teamData).map(Number);
    const emptyIndex = [0, 1, 2, 3, 4, 5].find((i) => !filledIndices.includes(i));

    if (emptyIndex !== undefined) {
      pokemonService.getPokemonByName(name).then((data) => {
        handleUpdateSlot(emptyIndex, { pokemon: data });
      });
    } else {
      setPendingNemesis(name);
      setIsReplaceModalOpen(true);
    }
  };

  const confirmReplacement = () => {
    if (pendingNemesis && replacementAdvice) {
      pokemonService.getPokemonByName(pendingNemesis).then((data) => {
        handleUpdateSlot(replacementAdvice.index, { pokemon: data });
        setIsReplaceModalOpen(false);
        setPendingNemesis(null);
      });
    }
  };

  const downloadCardImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0a",
        useCORS: true,
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `SquadPro-${Date.now()}.png`;
      link.click();
    } catch (e) {
      alert("Erro na captura.");
    } finally {
      setIsDownloading(false);
    }
  };

  const exportToShowdown = () => {
    const text = Object.values(teamData)
      .map((s: any) => {
        if (!s.pokemon) return "";
        let str = `${s.pokemon.name} @ ${s.selectedItem?.name || "No Item"}\n`;
        str += `Ability: ${s.selectedAbility?.name || "None"}\nNature: ${s.nature || "Hardy"}\n`;
        s.selectedMoves?.forEach((m: any) => {
          if (m) str += `- ${m.name}\n`;
        });
        return str;
      })
      .join("\n");
    
    navigator.clipboard.writeText(text);
    
    // Ativa o alerta customizado em vez do alert nativo
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 3000);
  };

  const confirmClearStorage = () => {
    localStorage.removeItem("move-tutor-pro-team");
    window.location.reload();
  };



  const handleImportShowdown = async () => {
  if (!importText.trim()) return;
  setIsImporting(true);

  const parsed = parseShowdown(importText);
  const newTeamData = { ...teamData };

  try {
    for (const key of Object.keys(parsed)) {
      const idx = parseInt(key);
      const basicInfo = parsed[key];
      
      const fullPokemon = await pokemonService.getPokemonByName(basicInfo.pokemon.name);
      
      newTeamData[idx] = {
        ...basicInfo,
        pokemon: fullPokemon,
      };
    }

    setTeamData(newTeamData);
    localStorage.setItem("move-tutor-pro-team", JSON.stringify(newTeamData));
    setIsImportModalOpen(false);
    setImportText("");
  } catch (e) {
    alert("Erro ao importar alguns Pokémons. Verifique o formato do texto.");
  } finally {
    setIsImporting(false);
  }
};

const handleSaveTeam = async (e: React.FormEvent | undefined, payload: any) => {
  if (e) e.preventDefault();
  setLoading(true);

  try {
    // Chama o service enviando o token automaticamente
    await teamService.saveTeam(payload);
    
    // Limpa o rascunho pendente após salvar com sucesso
    sessionStorage.removeItem("@MoveTutor:pendingTeam");
    
    router.push("/feed");
    router.refresh();
  } catch (error: any) {
    console.error("Erro ao salvar:", error.response?.data);
    alert("Erro ao publicar build. Verifique sua conexão.");
  } finally {
    setLoading(false);
  }
};

const handleConfirmSave = async () => {
  if (!teamName.trim()) return alert("O esquadrão precisa de um nome!");
  
  const pokemonsArray = Object.values(teamData)
    .filter((p: any) => p && p.pokemon)
    .map((p: any) => ({
      pokemon_id: p.pokemon.id,
      name: p.pokemon.name,
      item: p.selectedItem?.name || "Nenhum",
      ability: p.selectedAbility?.name || "Padrão",
      moves: p.selectedMoves?.map((m: any) => m.name) || []
    }));

  const payload = {
    team_name: teamName, 
    pokemons: pokemonsArray,
    regulation: "Regulation G"
  };

  await handleSaveTeam(undefined, payload);
  setIsModalOpen(false);
  setTeamName(""); 
};

const handlePublishClick = () => {
  if (!session) {
    setLoginAlert(true);
    // Esconde o alerta automaticamente após 3 segundos
    setTimeout(() => setLoginAlert(false), 3000);
    return;
  }
  setIsModalOpen(true);
};


  return (
    <main className="mb-10">
      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
              MOVE <span className="text-blue-500">Tutor</span> PRO
            </h1>
            <p className="text-zinc-500 mt-2 font-bold text-[10px] uppercase tracking-[0.3em]">
              Tactical Lab Edition
            </p>
          </div>
          <div className="flex gap-3">
          <button 
            onClick={handlePublishClick}
            className={`p-4 rounded-2xl font-black uppercase italic transition-all text-white shadow-lg ${
              !session 
                ? "bg-zinc-800 cursor-not-allowed opacity-50 shadow-none hover:bg-zinc-700" 
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
            }`}
          >
            {loading ? "Processando..." : "Publicar no Feed"}
          </button>
            <button
              onClick={() => setShowCard(true)}
              className="px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg hover:bg-blue-500 transition-all active:scale-95"
            >
              GERAR CARD
            </button>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="px-6 py-4 bg-red-600/10 text-red-500 border border-red-500/20 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all"
            >
              LIMPAR TUDO
            </button>
          </div>
        </header>

        {/* GRID DE SLOTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[...Array(6)].map((_, i) => (
            <PokemonSlot
              key={i}
              index={i}
              allNames={allNames}
              allItemNames={allItemNames}
              initialData={teamData[i]}
              onUpdate={handleUpdateSlot}
              onCompare={findSimilar}
            />
          ))}
        </div>

        <div className="flex justify-center mb-20 gap-3">
          <button
            onClick={exportToShowdown}
            className="px-6 py-3 bg-white text-black font-black text-xs rounded-xl shadow-lg tracking-widest uppercase hover:bg-zinc-200 transition-all"
          >
            EXPORTAR SHOWDOWN
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-3 bg-white text-black font-black text-xs rounded-xl shadow-lg tracking-widest uppercase hover:bg-zinc-200 transition-all"
          >
            IMPORTAR SHOWDOWN
          </button>
        </div>

        {/* DASHBOARD */}
        <AnalysisDashboard
          missing={missing}
          defWeaknesses={defWeaknesses}
          tips={tips}
          nemesis={nemesis}
          onAddNemesis={handleAddNemesis}
          replacementAdvice={replacementAdvice}
        />

        {/* MODAL 1: SQUAD PRO (DOWNLOAD) */}
        {showCard && (
          <div className="fixed inset-0 z-600 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl flex flex-col items-center">
              <button
                onClick={() => setShowCard(false)}
                className="absolute -top-16 right-0 text-white/50 hover:text-white transition-colors p-2"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div
                ref={cardRef}
                className="w-full bg-[#0a0a0a] border border-white/10 p-12 rounded-[50px] shadow-2xl text-center relative overflow-hidden"
              >
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                <h2 className="text-3xl font-black text-white italic mb-12 uppercase tracking-tighter relative z-10">
                  Squad <span className="text-blue-500">PRO</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 aspect-square"
                    >
                      {teamData[i]?.pokemon ? (
                        <>
                          <img
                            src={teamData[i].pokemon.sprites.front_default}
                            className="w-20 h-20 object-contain drop-shadow-2xl"
                            alt="pkmn"
                            crossOrigin="anonymous"
                          />
                          <span className="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em]">
                            {teamData[i].pokemon.name}
                          </span>
                        </>
                      ) : (
                        <div className="text-zinc-800 text-3xl font-black italic">?</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 text-[8px] text-zinc-600 font-black uppercase tracking-[0.4em]">
                  Move Tutor Pro • Tactical Lab
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: SUBSTITUIÇÃO TÁTICA */}
        {isReplaceModalOpen && pendingNemesis && replacementAdvice && (
          <div className="fixed inset-0 z-700 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-blue-500/20 p-10 rounded-[40px] shadow-2xl text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full" />
              <h2 className="text-2xl font-black text-white mb-8 uppercase italic">
                Troca <span className="text-blue-500">Sugerida</span>
              </h2>
              <div className="bg-white/5 p-6 rounded-3xl mb-8 space-y-4 text-left">
                <div className="flex justify-between uppercase font-black text-[10px]">
                  <span>Sai:</span>
                  <span className="text-red-500">{replacementAdvice.replace}</span>
                </div>
                <div className="flex justify-between uppercase font-black text-[10px]">
                  <span>Entra:</span>
                  <span className="text-blue-400">{pendingNemesis}</span>
                </div>
                <p className="text-[9px] text-zinc-400 italic mt-2 border-t border-white/5 pt-2 leading-relaxed">
                  Analise: {replacementAdvice.reason}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsReplaceModalOpen(false)}
                  className="flex-1 px-4 py-4 bg-zinc-800 text-zinc-300 font-bold rounded-xl text-[10px]"
                >
                  CANCELAR
                </button>
                <button
                  onClick={confirmReplacement}
                  className="flex-1 px-4 py-4 bg-blue-600 text-white font-black rounded-xl text-[10px] shadow-lg shadow-blue-600/20"
                >
                  CONFIRMAR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: STAT SCOUT */}
        {comparing && (
          <div className="fixed inset-0 z-400 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[40px] shadow-2xl relative">
              <button
                onClick={close}
                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">
                Stat <span className="text-blue-500">Scout</span>
              </h2>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-8 italic">
                Comparando {comparing.name.replace("-", " ")} de {comparing.pkmnName}
              </p>
              <div className="space-y-3 mt-8">
                {loading ? (
                  <div className="py-20 text-center animate-pulse text-blue-500 font-black uppercase text-[10px]">
                    Sincronizando...
                  </div>
                ) : (
                  results.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={p.sprite}
                          className="w-12 h-12 object-contain"
                          alt="pkmn"
                          crossOrigin="anonymous"
                        />
                        <span className="font-black text-white uppercase text-sm italic group-hover:text-blue-400">
                          {p.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-blue-400">{p.value}</span>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase">Base</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ALERTA CUSTOMIZADO NO TEAM-BUILDER/PAGE.TSX */}
        {showCopyAlert && (
          <div className="fixed top-8 right-8 z-999 animate-in fade-in slide-in-from-right-10 duration-300">
            <div className="bg-[#0a0a0a] border border-blue-500/30 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-white text-[10px] font-black uppercase tracking-widest">
                Exportação concluída com <span className="text-blue-500">sucesso</span>
              </span>
            </div>
          </div>
        )}

        {isImportModalOpen && (
          <div className="fixed inset-0 z-800 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-blue-500/20 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full" />
              
              <h2 className="text-2xl font-black text-white mb-2 uppercase italic">
                Importar do <span className="text-blue-500">Showdown</span>
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                Cole o texto do seu Export abaixo (até 6 Pokémons)
              </p>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Pikachu @ Light Ball..."
                className="w-full h-64 bg-white/5 border border-white/10 rounded-3xl p-6 text-xs text-zinc-300 font-mono outline-none focus:border-blue-500 transition-all resize-none mb-6"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-400 font-bold rounded-2xl text-[10px] hover:text-white transition-all"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleImportShowdown}
                  disabled={isImporting}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all"
                >
                  {isImporting ? "PROCESSANDO LAB..." : "CONFIRMAR IMPORTAÇÃO"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: RESET */}
        {isClearModalOpen && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 p-10 rounded-[40px] shadow-2xl text-center">
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                Limpar Bancada?
              </h2>
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-300 font-bold rounded-2xl transition-all"
                >
                  CANCELAR
                </button>
                <button
                  onClick={confirmClearStorage}
                  className="flex-1 px-6 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  CONFIRMAR
                </button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-2xl shadow-blue-500/20">
              <h2 className="text-3xl font-black italic uppercase text-white mb-2 tracking-tighter">
                NOMEAR <span className="text-blue-500">SQUAD</span>
              </h2>
              <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-8">
                Identifique sua Build para o Tactical Feed
              </p>
              
              <input 
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="EX: CALYREX SWEEP..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/50 transition-all mb-8 uppercase italic"
                autoFocus
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-zinc-500 font-black uppercase text-[10px] hover:bg-white/5 transition-all"
                >
                  Abortar
                </button>
                <button 
                  onClick={handleConfirmSave} // Esta função agora faz a conversão do teamData
                  className="flex-1 px-6 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] hover:bg-blue-500 transition-all"
                >
                  Confirmar e Publicar
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-20 py-12 border-t border-white/5 text-center text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em]">
          Move Tutor Pro • Tactical Lab • 2026
        </footer>
        {loginAlert && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-100 bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic shadow-2xl shadow-red-600/20 border border-white/10 animate-bounce">
            ⚠ ACESSO NEGADO: FAÇA LOGIN PARA PUBLICAR
          </div>
        )}
      </div>
    </main>
  );
}