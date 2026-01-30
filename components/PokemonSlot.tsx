"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { pokemonService } from "@/services/pokemonService";
import { NATURES } from "@/constants/natures";
import { RadarChart } from "./RadarChart";

interface Props {
  index: number;
  onUpdate: (idx: number, data: any) => void;
  onCompare: (pkmn: string, stat: string, val: number) => void;
  allNames: string[];
  allItemNames: string[];
  initialData?: any;
}

export function PokemonSlot({
  index,
  onUpdate,
  onCompare,
  allNames,
  allItemNames,
  initialData,
}: Props) {
  const [pokemon, setPokemon] = useState<any>(null);
  const [moves, setMoves] = useState<any[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<(any | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedAbility, setSelectedAbility] = useState<any | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedNature, setSelectedNature] = useState<string>("Hardy");
  const [isShiny, setIsShiny] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [showEvoLab, setShowEvoLab] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronização inicial (Sem disparar onUpdate para evitar loop)
  useEffect(() => {
    if (initialData && initialData.pokemon) {
      setPokemon(initialData.pokemon);
      setMoves(initialData.moves || []);
      setSelectedMoves(initialData.selectedMoves || [null, null, null, null]);
      setSelectedAbility(initialData.selectedAbility || null);
      setSelectedItem(initialData.selectedItem || null);
      setSelectedNature(initialData.nature || "Hardy");
      setIsShiny(initialData.isShiny || false);
    }
  }, [initialData]);

  const syncUpdate = (updatedFields: any) => {
    const finalData = {
      pokemon,
      moves,
      selectedMoves,
      selectedAbility,
      selectedItem,
      nature: selectedNature,
      isShiny,
      moveTypes: (updatedFields.selectedMoves || selectedMoves)
        .filter((m: any) => m !== null)
        .map((m: any) => m.type.name),
      ...updatedFields,
    };
    onUpdate(index, finalData);
  };

  const handleSearch = async (name: string) => {
    if (!name || name === pokemon?.name) return;
    try {
      const data = await pokemonService.getPokemonByName(name);
      const evos = await pokemonService.getEvolutionChain(data.species.url); // NOVO
      setEvolutions(evos);

      const availableMoves = data.moves
        .map((m: any) => ({ name: m.move.name, url: m.move.url }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
      setPokemon(data);
      setMoves(availableMoves);
      syncUpdate({ pokemon: data, moves: availableMoves });
    } catch (e) {
      console.error("Erro busca");
    }
  };

  const handleClearSlot = () => {
    if (inputRef.current) inputRef.current.value = "";
    setPokemon(null);
    setMoves([]);
    setSelectedMoves([null, null, null, null]);
    setSelectedAbility(null);
    setSelectedItem(null);
    setSelectedNature("Hardy");
    setIsShiny(false);
    onUpdate(index, null);
  };

  const calculateRealPower = (move: any) => {
    if (!move || !pokemon || !move.power) return move?.power || 0;
    return pokemon.types.some((t: any) => t.type.name === move.type.name)
      ? Math.floor(move.power * 1.5)
      : move.power;
  };

  const spritePath = isShiny
    ? pokemon?.sprites.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_shiny || pokemon?.sprites.front_shiny
    : pokemon?.sprites.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_default || pokemon?.sprites.front_default;

  const currentNature = NATURES.find((n) => n.name === selectedNature);

  return (
    <div className="relative group hover:z-50 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all">
      {/* 1. SEÇÃO DE PESQUISA (TOPO) */}
      <div className="relative mb-6">
        <input
          ref={inputRef}
          list={`list-${index}`}
          defaultValue={pokemon?.name || ""}
          placeholder="Buscar Pokémon..."
          className="w-full bg-transparent border-b border-white/10 pb-2 outline-none text-white font-medium placeholder:text-zinc-700 focus:border-blue-500 transition-colors"
          onBlur={(e) => handleSearch(e.target.value)}
        />
        <datalist id={`list-${index}`}>
          {allNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      {/* 2. MENU STAT SCOUT "..." (REPOSICIONADO ABAIXO DA PESQUISA) */}
      {pokemon && (
        <div className="absolute top-20 right-4 z-70">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-2 animate-in zoom-in-95 duration-200">
              <p className="text-[9px] text-zinc-500 font-black uppercase p-3 border-b border-white/5 mb-1 tracking-widest text-center">
                Stat Scout
              </p>
              {pokemon.stats.map((s: any) => (
                <button
                  key={s.stat.name}
                  onClick={() => {
                    onCompare(pokemon.name, s.stat.name, s.base_stat);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-[11px] font-bold text-zinc-300 hover:bg-blue-600 hover:text-white rounded-xl flex justify-between transition-colors capitalize"
                >
                  <span>{s.stat.name.replace("-", " ")}</span>{" "}
                  <span className="opacity-40">{s.base_stat}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. CONTEÚDO DINÂMICO DO POKÉMON */}
      {pokemon && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* HEADER: SPRITE, NOME E EVOLUTION LAB */}
          <div className="relative group/radar flex items-center justify-between mb-6 cursor-help">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={spritePath || ""}
                  width={64}
                  height={64}
                  unoptimized
                  className="object-contain drop-shadow-lg"
                  alt="pkmn"
                />
                <button
                  onClick={() => {
                    setIsShiny(!isShiny);
                    syncUpdate({ isShiny: !isShiny });
                  }}
                  className={`absolute -top-2 -left-2 p-1 rounded-full shadow-xl transition-all ${isShiny ? "bg-yellow-400 text-black border-yellow-500" : "bg-zinc-800 border-white/10"}`}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                    {pokemon.name}
                  </h3>

                  {/* BOTÃO EVOLUTION LAB */}
                  {evolutions.length > 1 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowEvoLab(!showEvoLab)}
                        className="p-1 text-blue-500 hover:text-white transition-colors"
                        title="Evolution Lab"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2v20M7 5l10 14M17 5L7 19" />
                        </svg>
                      </button>

                      {showEvoLab && (
                        <div className="absolute left-0 mt-2 z-80 bg-zinc-900 border border-blue-500/30 p-2 rounded-xl shadow-2xl min-w-140px animate-in zoom-in-95">
                          <p className="text-[8px] font-black text-zinc-500 uppercase mb-2 px-2 tracking-[0.2em]">
                            Formas
                          </p>
                          {evolutions.map((evo) => (
                            <button
                              key={evo}
                              onClick={() => {
                                handleSearch(evo);
                                setShowEvoLab(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${evo === pokemon.name ? "text-blue-400 bg-blue-400/10" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                            >
                              {evo}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RADAR CHART FLUTUANTE */}
            <div
              className="
  invisible opacity-0 
  group-hover/radar:visible group-hover/radar:opacity-100 
  absolute z-100 bottom-full left-1/2 -translate-x-1/2 mb-6 
  transition-all duration-150 ease-in-out pointer-events-none
"
            >
              <RadarChart stats={pokemon.stats} />
            </div>
          </div>

          {/* ITEM COM HOVER DE EFEITO */}
          <div className="mb-4 relative group/item">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block tracking-widest">
              Item
            </label>
            <input
              list={`items-${index}`}
              defaultValue={
                selectedItem?.name ? selectedItem.name.replace(/-/g, " ") : ""
              }
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none focus:border-yellow-500/50 transition-colors"
              onBlur={(e) =>
                pokemonService.getItemDetails(e.target.value).then((d) => {
                  setSelectedItem(d);
                  syncUpdate({ selectedItem: d });
                })
              }
            />
            <datalist id={`items-${index}`}>
              {allItemNames.map((n) => (
                <option key={n} value={n.replace(/-/g, " ")} />
              ))}
            </datalist>
            {selectedItem && (
              <div className="invisible group-hover/item:visible absolute z-50 w-full left-0 -top-24 p-4 bg-zinc-950/95 border border-yellow-500/30 rounded-2xl shadow-2xl animate-in zoom-in-95 backdrop-blur-md">
                <p className="text-[10px] text-yellow-500 font-black uppercase mb-1 tracking-tighter">
                  Efeito
                </p>
                <p className="text-[9px] text-zinc-300 leading-relaxed italic">
                  {selectedItem?.effect_entries?.find(
                    (e: any) => e.language.name === "en",
                  )?.short_effect || "Sem descrição disponível."}
                </p>
              </div>
            )}
          </div>

          {/* HABILIDADE COM HOVER DE EFEITO */}
          <div className="mb-4 relative group/ability">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block tracking-widest">
              Habilidade
            </label>
            <select
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 capitalize outline-none focus:ring-1 focus:ring-blue-500"
              value={
                pokemon.abilities.find(
                  (a: any) => a.ability.name === selectedAbility?.name,
                )?.ability.url || ""
              }
              onChange={(e) =>
                pokemonService.getAbilityDetails(e.target.value).then((d) => {
                  setSelectedAbility(d);
                  syncUpdate({ selectedAbility: d });
                })
              }
            >
              <option value="">Escolher</option>
              {pokemon.abilities.map((a: any) => (
                <option key={a.ability.name} value={a.ability.url}>
                  {a.ability.name.replace(/-/g, " ")}
                </option>
              ))}
            </select>
            {selectedAbility && (
              <div className="invisible group-hover/ability:visible absolute z-50 w-full left-0 -top-24 p-4 bg-zinc-950/95 border border-blue-500/30 rounded-2xl shadow-2xl animate-in zoom-in-95 backdrop-blur-md">
                <p className="text-[10px] text-blue-400 font-black uppercase mb-1 tracking-tighter">
                  Efeito
                </p>
                <p className="text-[9px] text-zinc-300 leading-relaxed italic">
                  {selectedAbility?.effect_entries?.find(
                    (e: any) => e.language.name === "en",
                  )?.short_effect || "Sem descrição disponível."}
                </p>
              </div>
            )}
          </div>

          {/* NATUREZA COM HOVER DE STATUS */}
          <div className="mb-6 relative group/nature">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block tracking-widest">
              Natureza
            </label>
            <select
              value={selectedNature}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none focus:border-zinc-500 transition-all"
              onChange={(e) => {
                setSelectedNature(e.target.value);
                syncUpdate({ nature: e.target.value });
              }}
            >
              {NATURES.map((n) => (
                <option key={n.name} value={n.name}>
                  {n.name}
                </option>
              ))}
            </select>
            <div className="invisible group-hover/nature:visible absolute z-30 right-0 -top-12 p-2 bg-zinc-900 border border-white/10 rounded-lg shadow-xl flex gap-3 animate-in zoom-in-95 backdrop-blur-md">
              <span className="text-[10px] font-black text-green-400">
                ↑ {currentNature?.plus}
              </span>
              <span className="text-[10px] font-black text-red-400">
                ↓ {currentNature?.minus}
              </span>
            </div>
          </div>

          {/* ATAQUES COM HOVER DE DETALHES */}
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative group/move">
                <select
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 capitalize outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  value={
                    moves.find((m) => m.name === selectedMoves[i]?.name)?.url ||
                    ""
                  }
                  onChange={(e) =>
                    pokemonService.getMoveDetails(e.target.value).then((d) => {
                      const ns = [...selectedMoves];
                      ns[i] = d;
                      setSelectedMoves(ns);
                      syncUpdate({ selectedMoves: ns });
                    })
                  }
                >
                  <option value="">Ataque {i + 1}</option>
                  {moves.map((m) => (
                    <option key={m.name} value={m.url}>
                      {m.name.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
                {selectedMoves[i] && (
                  <div className="invisible group-hover/move:visible absolute z-60 w-full left-0 -top-40 p-4 bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl animate-in zoom-in-95 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-black">
                          Power
                        </p>
                        <p
                          className={`text-sm font-black ${calculateRealPower(selectedMoves[i]) !== selectedMoves[i]?.power ? "text-blue-400" : "text-white"}`}
                        >
                          {calculateRealPower(selectedMoves[i]) || "--"}
                        </p>
                      </div>
                      <div className="text-center px-4 border-x border-white/5">
                        <p className="text-[8px] text-zinc-500 uppercase font-black">
                          Acc
                        </p>
                        <p className="text-sm font-black text-white">
                          {selectedMoves[i]?.accuracy
                            ? `${selectedMoves[i]?.accuracy}%`
                            : "--"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-black">
                          PP
                        </p>
                        <p className="text-sm font-black text-white">
                          {selectedMoves[i]?.pp}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-zinc-300 leading-relaxed italic font-medium">
                      {selectedMoves[i]?.effect_entries
                        ?.find((e: any) => e.language.name === "en")
                        ?.short_effect?.replace(
                          "$effect_chance",
                          selectedMoves[i]?.effect_chance,
                        ) || "Sem efeito adicional."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 4. BOTÃO REMOVER (UNITÁRIO) */}
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-center">
            <button
              onClick={handleClearSlot}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-red-500 transition-colors"
            >
              [ Remover Pokémon ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
