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

  // LÓGICA DE SINCRONIZAÇÃO E RESET (Resolve os bugs de Troca e Reload)
  useEffect(() => {
    const loadDependencies = async () => {
      if (initialData?.pokemon) {
        const isNewPokemon = initialData.pokemon.id !== pokemon?.id;

        // 1. Sincroniza o texto visível no input de pesquisa
        if (inputRef.current) {
          inputRef.current.value = initialData.pokemon.name;
        }

        // 2. Busca evoluções (Garante que apareçam após o reload)
        try {
          const evos = await pokemonService.getEvolutionChain(
            initialData.pokemon.species.url,
          );
          setEvolutions(evos);
        } catch (e) {
          console.error("Erro ao buscar evolução");
        }

        // 3. Busca ataques disponíveis para este Pokémon específico
        const availableMoves = initialData.pokemon.moves
          .map((m: any) => ({ name: m.move.name, url: m.move.url }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setMoves(availableMoves);
        setPokemon(initialData.pokemon);

        // 4. Se for um Pokémon novo (vido do Nemesis ou troca), reseta os campos
        if (isNewPokemon && !initialData.selectedMoves) {
          setSelectedMoves([null, null, null, null]);
          setSelectedAbility(null);
          setSelectedItem(null);
          setSelectedNature("Hardy");
          setIsShiny(false);
        } else {
          // Se estiver vindo do LocalStorage, mantém as escolhas
          setSelectedMoves(
            initialData.selectedMoves || [null, null, null, null],
          );
          setSelectedAbility(initialData.selectedAbility || null);
          setSelectedItem(initialData.selectedItem || null);
          setSelectedNature(initialData.nature || "Hardy");
          setIsShiny(initialData.isShiny || false);
        }
      }
    };

    loadDependencies();
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
      // Calcula tipos dos ataques para o dashboard
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
      // Disparamos o update para o pai, que voltará via initialData para o reset
      onUpdate(index, { pokemon: data });
    } catch (e) {
      console.error("Erro na busca do Pokémon");
    }
  };

  const handleClearSlot = () => {
    if (inputRef.current) inputRef.current.value = "";
    setPokemon(null);
    setMoves([]);
    setEvolutions([]);
    onUpdate(index, null);
  };

  const calculateRealPower = (move: any) => {
    if (!move || !pokemon || !move.power) return move?.power || 0;
    // Bônus de STAB (Same Type Attack Bonus)
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
      {/* PESQUISA */}
      <div className="relative mb-6">
        <input
          ref={inputRef}
          list={`list-${index}`}
          placeholder="Buscar Pokémon..."
          className="w-full bg-transparent border-b border-white/10 pb-2 outline-none text-white font-medium focus:border-blue-500 transition-colors"
          onBlur={(e) => handleSearch(e.target.value)}
        />
        <datalist id={`list-${index}`}>
          {allNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      {/* MENU STAT SCOUT */}
      {pokemon && (
        <div className="absolute top-20 right-4 z-70">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white bg-white/5 rounded-full border border-white/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-2 animate-in zoom-in-95">
              {pokemon.stats.map((s: any) => (
                <button
                  key={s.stat.name}
                  onClick={() => {
                    onCompare(pokemon.name, s.stat.name, s.base_stat);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-[11px] font-bold text-zinc-300 hover:bg-blue-600 hover:text-white rounded-xl flex justify-between capitalize transition-colors"
                >
                  <span>{s.stat.name.replace("-", " ")}</span>{" "}
                  <span>{s.base_stat}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {pokemon && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* SPRITE, NOME E EVOLUTION LAB */}
          <div className="relative group/radar flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={spritePath || ""}
                  width={64}
                  height={64}
                  className="object-contain"
                  alt="pkmn"
                  crossOrigin="anonymous"
                />
                <button
                  onClick={() => {
                    setIsShiny(!isShiny);
                    syncUpdate({ isShiny: !isShiny });
                  }}
                  className={`absolute -top-2 -left-2 p-1 rounded-full shadow-xl transition-all ${isShiny ? "bg-yellow-400 text-black" : "bg-zinc-800 text-white"}`}
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
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    {pokemon.name}
                  </h3>
                  {evolutions.length > 1 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowEvoLab(!showEvoLab)}
                        className="p-1 text-blue-500 hover:text-white transition-colors"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M12 2v20M7 5l10 14M17 5L7 19" />
                        </svg>
                      </button>
                      {showEvoLab && (
                        <div className="absolute left-0 mt-2 z-80 bg-zinc-950 border border-blue-500/30 p-2 rounded-xl shadow-2xl min-w-140px">
                          {evolutions.map((evo) => (
                            <button
                              key={evo}
                              onClick={() => {
                                handleSearch(evo);
                                setShowEvoLab(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${evo === pokemon.name ? "text-blue-400 bg-blue-400/10" : "text-zinc-400 hover:text-white"}`}
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
            <div className="invisible opacity-0 group-hover/radar:visible group-hover/radar:opacity-100 absolute z-100 bottom-full left-1/2 -translate-x-1/2 mb-6 transition-all duration-150 pointer-events-none">
              <RadarChart stats={pokemon.stats} />
            </div>
          </div>

          {/* ITEM */}
          <div className="mb-4 relative group/item">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">
              Item
            </label>
            <input
              list={`items-${index}`}
              defaultValue={selectedItem?.name?.replace(/-/g, " ") || ""}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none focus:border-blue-500"
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
              <div className="invisible group-hover/item:visible absolute z-50 w-full left-0 -top-24 p-4 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
                <p className="text-[9px] text-zinc-300 italic">
                  {selectedItem?.effect_entries?.find(
                    (e: any) => e.language.name === "en",
                  )?.short_effect || "Sem descrição."}
                </p>
              </div>
            )}
          </div>

          {/* HABILIDADE */}
          <div className="mb-4 relative group/ability">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">
              Habilidade
            </label>
            <select
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 capitalize outline-none"
              value={selectedAbility?.name || ""}
              onChange={(e) => {
                const url = pokemon.abilities.find(
                  (a: any) => a.ability.name === e.target.value,
                )?.ability.url;
                if (url)
                  pokemonService.getAbilityDetails(url).then((d) => {
                    setSelectedAbility(d);
                    syncUpdate({ selectedAbility: d });
                  });
              }}
            >
              <option value="">Escolher</option>
              {pokemon.abilities.map((a: any) => (
                <option key={a.ability.name} value={a.ability.name}>
                  {a.ability.name.replace(/-/g, " ")}
                </option>
              ))}
            </select>
            {selectedAbility && (
              <div className="invisible group-hover/ability:visible absolute z-50 w-full left-0 -top-24 p-4 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
                <p className="text-[9px] text-zinc-300 italic">
                  {selectedAbility?.effect_entries?.find(
                    (e: any) => e.language.name === "en",
                  )?.short_effect || "Sem descrição."}
                </p>
              </div>
            )}
          </div>

          {/* NATUREZA */}
          <div className="mb-6 relative group/nature">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">
              Natureza
            </label>
            <select
              value={selectedNature}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none"
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
            <div className="invisible group-hover/nature:visible absolute z-30 right-0 -top-12 p-2 bg-zinc-900 border border-white/10 rounded-lg flex gap-3">
              <span className="text-[10px] font-black text-green-400">
                ↑ {currentNature?.plus}
              </span>
              <span className="text-[10px] font-black text-red-400">
                ↓ {currentNature?.minus}
              </span>
            </div>
          </div>

          {/* ATAQUES */}
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative group/move">
                <select
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 capitalize outline-none"
                  value={selectedMoves[i]?.name || ""}
                  onChange={(e) => {
                    const url = moves.find(
                      (m) => m.name === e.target.value,
                    )?.url;
                    if (url)
                      pokemonService.getMoveDetails(url).then((d) => {
                        const ns = [...selectedMoves];
                        ns[i] = d;
                        setSelectedMoves(ns);
                        syncUpdate({ selectedMoves: ns });
                      });
                  }}
                >
                  <option value="">Ataque {i + 1}</option>
                  {moves.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
                {selectedMoves[i] && (
                  <div className="invisible group-hover/move:visible absolute z-60 w-full left-0 -top-40 p-4 bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-md">
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
                    <p className="text-[9px] text-zinc-300 italic">
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
