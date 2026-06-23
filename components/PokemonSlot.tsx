"use client";

import { NATURES } from "@/constants/natures";
import { TYPE_COLORS } from "@/constants/typeChart";
import { RadarChart } from "./RadarChart";
import { MoveSlot } from "./MoveSlot";
import { usePokemonSlot } from "@/hooks/usePokemonSlot";
import { pokemonService } from "@/services/pokemonService";
import type { SlotData, MoveDetails } from "@/types";

interface Props {
  index: number;
  onUpdate: (idx: number, data: Partial<SlotData> | null) => void;
  onCompare: (pkmn: string, stat: string, val: number) => void;
  allNames: string[];
  allItemNames: string[];
  initialData?: Partial<SlotData> | null;
}

export function PokemonSlot({ index, onUpdate, onCompare, allNames, allItemNames, initialData }: Props) {
  const {
    pokemon,
    moves,
    selectedMoves,
    setSelectedMoves,
    selectedAbility,
    setSelectedAbility,
    selectedItem,
    setSelectedItem,
    selectedNature,
    setSelectedNature,
    isShiny,
    setIsShiny,
    showOptions,
    setShowOptions,
    evolutions,
    showEvoLab,
    setShowEvoLab,
    inputRef,
    syncUpdate,
    handleSearch,
    handleClearSlot,
    calculateRealPower,
    spritePath,
  } = usePokemonSlot({ index, initialData, onUpdate });

  const currentNature = NATURES.find((n) => n.name === selectedNature);

  const handleMoveChange = (idx: number, move: MoveDetails) => {
    const ns = [...selectedMoves];
    ns[idx] = move;
    setSelectedMoves(ns);
    syncUpdate({ selectedMoves: ns });
  };

  return (
    <div className="relative group hover:z-50 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-2xl hover:border-white/20 transition-all overflow-hidden">
      {/* GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />

      {/* CONTENT */}
      <div className="relative p-6 space-y-5">
      {/* PESQUISA */}
      <div className="relative">
        <input
          ref={inputRef}
          list={`list-${index}`}
          placeholder="Buscar Pokémon..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white font-medium placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white/10 transition-all"
          onBlur={(e) => handleSearch(e.target.value)}
        />
        <datalist id={`list-${index}`}>
          {allNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>


      {pokemon && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
          {/* SPRITE */}
          <div className="relative flex justify-center">
            <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-b from-white/10 via-white/5 to-zinc-900/50 border border-white/10 overflow-hidden flex items-center justify-center shadow-lg p-2">
              <img
                src={spritePath}
                alt={pokemon.name}
                className="w-full h-full object-contain object-center"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  if (target.src !== fallback) target.src = fallback;
                }}
              />
            </div>
          </div>

          {/* NAME & BUTTONS */}
          <div className="flex items-center justify-between gap-2 px-1">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter flex-1">{pokemon.name}</h3>

            <div className="flex gap-1.5 shrink-0">
              {/* SHINY BUTTON */}
              <button
                onClick={() => {
                  setIsShiny(!isShiny);
                  syncUpdate({ isShiny: !isShiny });
                }}
                className={`p-1.5 rounded-lg shadow-lg transition-all border ${isShiny ? "bg-yellow-400 text-black border-yellow-300" : "bg-zinc-800/80 text-white border-white/10 hover:border-yellow-400/50 hover:bg-zinc-700"}`}
                title={isShiny ? "Desativar Shiny" : "Ativar Shiny"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>

              {/* STATS BUTTON */}
              <div className="relative group/stats">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1.5 text-white bg-zinc-800/80 border border-white/10 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/20 transition-all"
                  title="Ver estatísticas"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </button>

                {showOptions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl p-3 z-80 animate-in zoom-in-95">
                    <div className="space-y-2">
                      {pokemon.stats.map((s) => (
                        <button
                          key={s.stat.name}
                          onClick={() => {
                            onCompare(pokemon.name, s.stat.name, s.base_stat);
                            setShowOptions(false);
                          }}
                          className="w-full text-left px-2 py-1.5 text-[10px] font-bold text-zinc-300 hover:bg-blue-600 hover:text-white rounded-lg flex justify-between capitalize transition-colors"
                        >
                          <span>{s.stat.name.replace("-", " ")}</span>
                          <span className="font-black text-blue-400">{s.base_stat}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* EVOLUTION BUTTON */}
              {evolutions.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setShowEvoLab(!showEvoLab)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 bg-zinc-800/50 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition-colors"
                    title="Evoluções"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v20M7 5l10 14M17 5L7 19" />
                    </svg>
                  </button>
                  {showEvoLab && (
                    <div className="absolute right-0 top-full mt-2 z-80 bg-zinc-950 border border-blue-500/30 p-2 rounded-xl shadow-2xl min-w-max">
                      {evolutions.map((evo) => (
                        <button
                          key={evo}
                          onClick={() => {
                            handleSearch(evo);
                            setShowEvoLab(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${evo === pokemon.name ? "text-blue-400 bg-blue-400/10" : "text-zinc-400 hover:text-white"}`}
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

          {/* TYPES */}
          <div className="flex gap-2 flex-wrap justify-center px-1">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`text-[8px] font-black uppercase px-3 py-1 rounded-full text-white ${TYPE_COLORS[t.type.name]} border border-white/20`}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4"></div>

          {/* CONFIG GRID */}
          <div className="grid grid-cols-1 gap-3">
            {/* ITEM */}
            <div className="relative group/item">
              <label className="text-[9px] text-zinc-400 font-bold uppercase mb-1.5 block tracking-wider">Item</label>
              <input
                list={`items-${index}`}
                defaultValue={selectedItem?.name?.replace(/-/g, " ") || ""}
                className="w-full bg-zinc-900/80 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 focus:bg-zinc-800 focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-white/40 hover:bg-zinc-800/50"
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
                <div className="invisible group-hover/item:visible absolute z-50 w-full left-0 bottom-full mb-2 p-3 bg-zinc-950 border border-white/10 rounded-lg shadow-2xl backdrop-blur-md">
                  <p className="text-[9px] text-zinc-300 italic leading-snug">
                    {selectedItem.effect_entries?.find((e) => e.language.name === "en")?.short_effect || "Sem descrição."}
                  </p>
                </div>
              )}
            </div>

            {/* HABILIDADE */}
            <div className="relative group/ability">
              <label className="text-[9px] text-zinc-400 font-bold uppercase mb-1.5 block tracking-wider">Habilidade</label>
              <select
                className="w-full bg-zinc-900/80 border border-white/20 rounded-lg px-3 py-2 text-sm text-white capitalize outline-none focus:border-blue-500 focus:bg-zinc-800 focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer hover:border-white/40 hover:bg-zinc-800/50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  paddingRight: "1.75rem"
                }}
                value={selectedAbility?.name || ""}
                onChange={(e) => {
                  const url = pokemon.abilities.find((a) => a.ability.name === e.target.value)?.ability.url;
                  if (url)
                    pokemonService.getAbilityDetails(url).then((d) => {
                      setSelectedAbility(d);
                      syncUpdate({ selectedAbility: d });
                    });
                }}
              >
                <option value="">Escolher</option>
                {pokemon.abilities.map((a) => (
                  <option key={a.ability.name} value={a.ability.name}>
                    {a.ability.name.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
              {selectedAbility && (
                <div className="invisible group-hover/ability:visible absolute z-50 w-full left-0 bottom-full mb-2 p-3 bg-zinc-950 border border-white/10 rounded-lg shadow-2xl backdrop-blur-md">
                  <p className="text-[9px] text-zinc-300 italic leading-snug">
                    {selectedAbility.effect_entries?.find((e) => e.language.name === "en")?.short_effect || "Sem descrição."}
                  </p>
                </div>
              )}
            </div>

            {/* NATUREZA */}
            <div className="relative group/nature">
              <label className="text-[9px] text-zinc-400 font-bold uppercase mb-1.5 block tracking-wider">Natureza</label>
              <select
                value={selectedNature}
                className="w-full bg-zinc-900/80 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:bg-zinc-800 focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer hover:border-white/40 hover:bg-zinc-800/50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  paddingRight: "1.75rem"
                }}
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
              <div className="invisible group-hover/nature:visible absolute z-30 right-0 bottom-full mb-1 p-2 bg-zinc-900/95 border border-white/10 rounded-lg flex gap-3 text-[9px] font-black whitespace-nowrap">
                <span className="text-green-400">↑ {currentNature?.plus}</span>
                <span className="text-red-400">↓ {currentNature?.minus}</span>
              </div>
            </div>
          </div>

          {/* ATAQUES */}
          <div className="space-y-2 pt-2">
            <label className="text-[9px] text-zinc-400 font-bold uppercase block tracking-wider">Ataques</label>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <MoveSlot
                  key={i}
                  moveIndex={i}
                  selectedMove={selectedMoves[i]}
                  moves={moves}
                  realPower={calculateRealPower(selectedMoves[i])}
                  onMoveChange={handleMoveChange}
                />
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="pt-3 border-t border-white/10 flex justify-center">
            <button
              onClick={handleClearSlot}
              className="text-[8px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400 transition-colors"
            >
              ✕ REMOVER
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
