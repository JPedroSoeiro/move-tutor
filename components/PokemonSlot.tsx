"use client";

import { useState } from "react";
import { pokemonService } from "@/services/pokemonService";
import { TYPE_COLORS } from "@/constants/typeChart";
import { NATURES } from "@/constants/natures";
import { RadarChart } from "./RadarChart";
import { MoveDetail, AbilityDetail, Move } from "@/types/pokemon";

interface Props {
  index: number;
  onUpdate: (idx: number, data: { pokemon: any; moveTypes: string[] }) => void;
  allNames: string[];
}

export function PokemonSlot({ index, onUpdate, allNames }: Props) {
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
  const [selectedNature, setSelectedNature] = useState<string>("Hardy");
  const [loading, setLoading] = useState(false);

  // Busca o Pokémon e limpa os estados de seleções anteriores
  const handleSearch = async (name: string) => {
    if (!name) return;
    setLoading(true);
    try {
      const data = await pokemonService.getPokemonByName(name);
      setPokemon(data);

      const availableMoves = data.moves
        .map((m: any) => ({ name: m.move.name, url: m.move.url }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      setMoves(availableMoves);
      setSelectedMoves([null, null, null, null]);
      setSelectedAbility(null);
      onUpdate(index, { pokemon: data, moveTypes: [] });
    } catch (e) {
      console.error("Pokémon não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const handleAbilitySelect = async (url: string) => {
    if (!url) {
      setSelectedAbility(null);
      return;
    }
    const details = await pokemonService.getAbilityDetails(url);
    setSelectedAbility(details);
  };

  const handleMoveSelect = async (mIdx: number, url: string) => {
    if (!url) {
      const newSelected = [...selectedMoves];
      newSelected[mIdx] = null;
      setSelectedMoves(newSelected);
      return;
    }
    const details = await pokemonService.getMoveDetails(url);
    const newSelected = [...selectedMoves];
    newSelected[mIdx] = details;
    setSelectedMoves(newSelected);

    const activeTypes = newSelected
      .filter((m): m is MoveDetail => m !== null)
      .map((m) => m.type.name);

    onUpdate(index, { pokemon, moveTypes: activeTypes });
  };

  // Lógica de Calculadora de STAB (1.5x se o tipo do golpe = tipo do pokemon)
  const calculateRealPower = (move: MoveDetail | null) => {
    if (!move || !pokemon || !move.power) return move?.power || 0;
    const isStab = pokemon.types.some(
      (t: any) => t.type.name === move.type.name,
    );
    return isStab ? Math.floor(move.power * 1.5) : move.power;
  };

  const currentNatureData = NATURES.find((n) => n.name === selectedNature);

  return (
    <div className="relative group hover:z-50 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all hover:border-blue-500/30">
      {/* Busca */}
      <div className="relative mb-6">
        <input
          list={`list-${index}`}
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
          {/* Cabeçalho com Radar Chart no Hover */}
          <div className="relative group/radar flex items-center justify-between mb-6 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-help">
            <div className="flex items-center gap-3">
              <img
                src={
                  pokemon.sprites.versions?.["generation-v"]?.["black-white"]
                    ?.animated?.front_default || pokemon.sprites.front_default
                }
                className="w-16 h-16 object-contain"
                alt={pokemon.name}
              />
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  {pokemon.name}
                </h3>
                <div className="flex gap-1 mt-1">
                  {pokemon.types.map((t: any) => (
                    <span
                      key={t.type.name}
                      className={`${TYPE_COLORS[t.type.name]} text-[8px] font-bold px-2 py-0.5 rounded text-white uppercase shadow-sm`}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar Chart flutuante */}
            <div className="invisible group-hover/radar:visible absolute z-100 -top-10 left-full ml-4 animate-in fade-in zoom-in-95 duration-200">
              <RadarChart stats={pokemon.stats} />
            </div>
          </div>

          {/* Habilidade com Hover de Efeito */}
          <div className="mb-4 relative group/ability">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block tracking-widest">
              Habilidade
            </label>
            <select
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 capitalize outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => handleAbilitySelect(e.target.value)}
            >
              <option value="">Escolher Habilidade</option>
              {pokemon.abilities.map((a: any) => (
                <option key={a.ability.name} value={a.ability.url}>
                  {a.ability.name.replace("-", " ")}
                </option>
              ))}
            </select>

            {selectedAbility && (
              <div className="invisible group-hover/ability:visible absolute z-30 w-full left-0 -top-24 p-3 bg-zinc-950 border border-blue-500/30 rounded-xl shadow-2xl animate-in fade-in zoom-in-95">
                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">
                  Efeito
                </p>
                <p className="text-[9px] text-zinc-300 leading-relaxed italic">
                  {selectedAbility.effect_entries.find(
                    (e: any) => e.language.name === "en",
                  )?.short_effect || "Sem descrição."}
                </p>
              </div>
            )}
          </div>

          {/* Natureza com Indicador de Status */}
          <div className="mb-6 relative group/nature">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block tracking-widest">
              Natureza
            </label>
            <select
              value={selectedNature}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none"
              onChange={(e) => setSelectedNature(e.target.value)}
            >
              {NATURES.map((n) => (
                <option key={n.name} value={n.name}>
                  {n.name}
                </option>
              ))}
            </select>

            {/* Tooltip da Natureza */}
            <div className="invisible group-hover/nature:visible absolute z-30 right-0 -top-12 p-2 bg-zinc-900 border border-white/20 rounded-lg shadow-xl flex gap-3 animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-bold text-green-400">
                ↑ {currentNatureData?.plus}
              </span>
              <span className="text-[10px] font-bold text-red-400">
                ↓ {currentNatureData?.minus}
              </span>
            </div>
          </div>

          {/* Golpes com STAB e Info Hover */}
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative group/move">
                <select
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 capitalize outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => handleMoveSelect(i, e.target.value)}
                >
                  <option value="">Ataque {i + 1}</option>
                  {moves.map((m) => (
                    <option key={m.name} value={m.url}>
                      {m.name.replace("-", " ")}
                    </option>
                  ))}
                </select>

                {selectedMoves[i] && (
                  <div className="invisible group-hover/move:visible absolute z-40 w-full left-0 -top-32 p-3 bg-zinc-950 border border-white/20 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold">
                          Poder Real
                        </p>
                        <p
                          className={`text-xs font-bold ${calculateRealPower(selectedMoves[i]) !== selectedMoves[i]?.power ? "text-blue-400" : "text-white"}`}
                        >
                          {calculateRealPower(selectedMoves[i]) || "--"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold">
                          Acc
                        </p>
                        <p className="text-xs font-bold text-white">
                          {selectedMoves[i]?.accuracy
                            ? `${selectedMoves[i]?.accuracy}%`
                            : "--"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold">
                          PP
                        </p>
                        <p className="text-xs font-bold text-white">
                          {selectedMoves[i]?.pp}
                        </p>
                      </div>
                      <div
                        className={`${TYPE_COLORS[selectedMoves[i]?.type.name || "normal"]} px-2 py-0.5 rounded text-[8px] font-bold uppercase text-white shadow-sm`}
                      >
                        {selectedMoves[i]?.type.name}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[9px] text-zinc-400 leading-snug italic">
                        {selectedMoves[i]?.effect_entries
                          ?.find((e: any) => e.language.name === "en")
                          ?.short_effect.replace(
                            "$effect_chance",
                            String(selectedMoves[i]?.effect_chance || ""),
                          ) || "Sem efeito adicional."}
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
