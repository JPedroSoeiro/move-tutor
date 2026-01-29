"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { pokemonService } from "@/services/pokemonService";
import { TYPE_COLORS } from "@/constants/typeChart";
import { NATURES } from "@/constants/natures";
import { RadarChart } from "./RadarChart";
import { MoveDetail, AbilityDetail, ItemDetail, Move } from "@/types/pokemon";

interface Props {
  index: number;
  onUpdate: (idx: number, data: any) => void;
  allNames: string[];
  allItemNames: string[];
  initialData?: any;
}

export function PokemonSlot({
  index,
  onUpdate,
  allNames,
  allItemNames,
  initialData,
}: Props) {
  // Inicialização dos estados
  const [pokemon, setPokemon] = useState<any>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<(MoveDetail | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedAbility, setSelectedAbility] = useState<AbilityDetail | null>(
    null,
  );
  const [selectedItem, setSelectedItem] = useState<ItemDetail | null>(null);
  const [selectedNature, setSelectedNature] = useState<string>("Hardy");
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sincroniza o estado local quando os dados são carregados do LocalStorage (Pai)
  useEffect(() => {
    if (initialData) {
      setPokemon(initialData.pokemon || null);
      setMoves(initialData.moves || []);
      setSelectedMoves(initialData.selectedMoves || [null, null, null, null]);
      setSelectedAbility(initialData.selectedAbility || null);
      setSelectedItem(initialData.selectedItem || null);
      setSelectedNature(initialData.nature || "Hardy");
      setIsShiny(initialData.isShiny || false);
    }
  }, [initialData]);

  // Helper para atualizar o estado global no page.tsx
  const syncUpdate = (updatedFields: any) => {
    onUpdate(index, {
      pokemon,
      moves,
      selectedMoves,
      selectedAbility,
      selectedItem,
      nature: selectedNature,
      isShiny,
      moveTypes: selectedMoves
        .filter((m) => m !== null)
        .map((m) => m!.type.name),
      ...updatedFields,
    });
  };

  const handleSearch = async (name: string) => {
    if (!name || name === pokemon?.name) return;
    setLoading(true);
    try {
      const data = await pokemonService.getPokemonByName(name);
      const availableMoves = data.moves
        .map((m: any) => ({ name: m.move.name, url: m.move.url }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      setPokemon(data);
      setMoves(availableMoves);
      setSelectedMoves([null, null, null, null]);
      setSelectedAbility(null);
      setSelectedItem(null);
      setIsShiny(false);

      onUpdate(index, {
        pokemon: data,
        moveTypes: [],
        moves: availableMoves,
        nature: "Hardy",
        isShiny: false,
      });
    } catch (e) {
      console.error("Erro na busca do Pokémon");
    } finally {
      setLoading(false);
    }
  };

  const handleItemSearch = async (itemName: string) => {
    const formattedName = itemName.trim().toLowerCase().replace(/\s+/g, "-");
    if (!formattedName) {
      setSelectedItem(null);
      syncUpdate({ selectedItem: null, item: null });
      return;
    }
    try {
      const details = await pokemonService.getItemDetails(formattedName);
      setSelectedItem(details);
      syncUpdate({ selectedItem: details, item: details.name });
    } catch (e) {
      console.error("Item não encontrado");
    }
  };

  const handleMoveSelect = async (mIdx: number, url: string) => {
    if (!url) {
      const newSelected = [...selectedMoves];
      newSelected[mIdx] = null;
      setSelectedMoves(newSelected);
      syncUpdate({ selectedMoves: newSelected });
      return;
    }
    const details = await pokemonService.getMoveDetails(url);
    const newSelected = [...selectedMoves];
    newSelected[mIdx] = details;
    setSelectedMoves(newSelected);
    syncUpdate({
      selectedMoves: newSelected,
      moveTypes: newSelected.filter((m) => m !== null).map((m) => m!.type.name),
    });
  };

  const calculateRealPower = (move: MoveDetail | null) => {
    if (!move || !pokemon || !move.power) return move?.power || 0;
    const isStab = pokemon.types.some(
      (t: any) => t.type.name === move.type.name,
    );
    return isStab ? Math.floor(move.power * 1.5) : move.power;
  };

  const spritePath = isShiny
    ? pokemon?.sprites.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_shiny || pokemon?.sprites.front_shiny
    : pokemon?.sprites.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_default || pokemon?.sprites.front_default;

  const currentNatureData = NATURES.find((n) => n.name === selectedNature);

  return (
    <div className="relative group hover:z-50 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all hover:border-blue-500/30">
      <div className="relative mb-6">
        <input
          list={`list-${index}`}
          defaultValue={pokemon?.name || ""}
          placeholder="Buscar Pokémon..."
          className="w-full bg-transparent border-b border-white/10 pb-2 outline-none text-white font-medium placeholder:text-zinc-700 focus:border-blue-500 transition-colors"
          onBlur={(e) => handleSearch(e.target.value)}
        />
        <datalist id={`list-${index}`}>
          {allNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      {pokemon && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative group/radar flex items-center justify-between mb-6 cursor-help">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  width={100}
                  height={100}
                  src={spritePath}
                  unoptimized
                  className="w-16 h-16 object-contain drop-shadow-lg"
                  alt={pokemon.name}
                />
                <button
                  onClick={() => {
                    setIsShiny(!isShiny);
                    syncUpdate({ isShiny: !isShiny });
                  }}
                  className={`absolute -top-2 -left-2 p-1.5 rounded-full transition-all shadow-xl border border-white/10 ${isShiny ? "bg-yellow-400 text-black" : "bg-zinc-800 text-zinc-500 hover:text-white"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                  {pokemon.name}
                </h3>
                <div className="flex gap-1 mt-2">
                  {pokemon.types.map((t: any) => (
                    <span
                      key={t.type.name}
                      className={`${TYPE_COLORS[t.type.name]} text-[8px] font-black px-2 py-0.5 rounded-md text-white uppercase shadow-sm`}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="invisible group-hover/radar:visible absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-6 animate-in fade-in zoom-in-95 duration-200">
              <RadarChart stats={pokemon.stats} />
            </div>
          </div>

          <div className="mb-4 relative group/item">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block tracking-widest">
              Item Segurado
            </label>
            <input
              list={`items-list-${index}`}
              defaultValue={selectedItem?.name.replace(/-/g, " ") || ""}
              placeholder="Ex: Life Orb"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none focus:border-yellow-500/50 transition-colors"
              onBlur={(e) => handleItemSearch(e.target.value)}
            />
            <datalist id={`items-list-${index}`}>
              {allItemNames.map((name) => (
                <option key={name} value={name.replace(/-/g, " ")} />
              ))}
            </datalist>
            {selectedItem && (
              <div className="invisible group-hover/item:visible absolute z-50 w-full left-0 -top-20 p-3 bg-zinc-950 border border-yellow-500/30 rounded-xl shadow-2xl animate-in zoom-in-95 backdrop-blur-md">
                <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1">
                  Efeito
                </p>
                <p className="text-[9px] text-zinc-300 leading-relaxed italic">
                  {selectedItem.effect_entries.find(
                    (e) => e.language.name === "en",
                  )?.short_effect || "Sem descrição."}
                </p>
              </div>
            )}
          </div>

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
              onChange={(e) => {
                const url = e.target.value;
                if (!url) {
                  setSelectedAbility(null);
                  syncUpdate({ selectedAbility: null });
                  return;
                }
                pokemonService.getAbilityDetails(url).then((details) => {
                  setSelectedAbility(details);
                  syncUpdate({
                    selectedAbility: details,
                    ability: details.name,
                  });
                });
              }}
            >
              <option value="">Escolher Habilidade</option>
              {pokemon.abilities.map((a: any) => (
                <option key={a.ability.name} value={a.ability.url}>
                  {a.ability.name.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 relative group/nature">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block tracking-widest">
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
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative group/move">
                <select
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 capitalize outline-none focus:ring-1 focus:ring-blue-500"
                  value={
                    moves.find((m) => m.name === selectedMoves[i]?.name)?.url ||
                    ""
                  }
                  onChange={(e) => handleMoveSelect(i, e.target.value)}
                >
                  <option value="">Ataque {i + 1}</option>
                  {moves.map((m) => (
                    <option key={m.name} value={m.url}>
                      {m.name.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>

                {selectedMoves[i] && (
                  <div className="invisible group-hover/move:visible absolute z-[60] w-full left-0 -top-36 p-4 bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">
                          Poder Real
                        </p>
                        <p
                          className={`text-sm font-black ${calculateRealPower(selectedMoves[i]) !== selectedMoves[i]?.power ? "text-blue-400" : "text-white"}`}
                        >
                          {calculateRealPower(selectedMoves[i]) || "--"}
                        </p>
                      </div>
                      {/* ... Acc e PP ... */}
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-[9px] text-zinc-300 leading-relaxed italic font-medium">
                        {selectedMoves[i]?.effect_entries
                          ?.find((e: any) => e.language.name === "en")
                          ?.short_effect.replace(
                            "$effect_chance",
                            String(selectedMoves[i]?.effect_chance || ""),
                          ) || "Sem descrição."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
