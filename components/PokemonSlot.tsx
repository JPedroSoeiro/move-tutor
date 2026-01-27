"use client";
import { useState } from "react";
import { pokemonService } from "@/services/pokemonService";
import { TYPE_COLORS } from "@/constants/typeChart";
import { MoveDetail } from "@/types/pokemon";

interface Props {
  index: number;
  onUpdate: (idx: number, data: { pokemon: any; moveTypes: string[] }) => void;
  allNames: string[];
}

export function PokemonSlot({ index, onUpdate, allNames }: Props) {
  const [pokemon, setPokemon] = useState<any>(null);
  const [moves, setMoves] = useState<any[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<(MoveDetail | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const handleSearch = async (name: string) => {
    if (!name) return;
    try {
      const data = await pokemonService.getPokemonByName(name);
      setPokemon(data);
      setMoves(
        data.moves.map((m: any) => ({ name: m.move.name, url: m.move.url })),
      );
      setSelectedMoves([null, null, null, null]);
    } catch (e) {
      console.error("Erro ao buscar Pokémon");
    }
  };

  // Renomeado para handleMoveSelect para coincidir com a chamada no JSX
  const handleMoveSelect = async (mIdx: number, url: string) => {
    if (!url) return;
    const details = await pokemonService.getMoveDetails(url);
    const newSelected = [...selectedMoves];
    newSelected[mIdx] = details;
    setSelectedMoves(newSelected);

    const activeTypes = newSelected
      .filter((m): m is MoveDetail => m !== null)
      .map((m) => m.type.name);

    onUpdate(index, { pokemon, moveTypes: activeTypes });
  };

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all hover:border-blue-500/50">
      <input
        list={`list-${index}`}
        placeholder="Buscar Pokémon..."
        className="w-full bg-transparent border-b border-white/20 pb-2 mb-4 outline-none text-white font-medium placeholder:text-zinc-600 focus:border-blue-500 transition-colors"
        onBlur={(e) => handleSearch(e.target.value)}
      />
      <datalist id={`list-${index}`}>
        {allNames.map((name: string) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      {pokemon && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between mb-4">
            <img
              src={
                pokemon.sprites.versions?.["generation-v"]?.["black-white"]
                  ?.animated?.front_default || pokemon.sprites.front_default
              }
              className="w-14 h-14 object-contain"
              alt={pokemon.name}
            />
            <div className="text-right">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                {pokemon.name}
              </h3>
              <div className="flex gap-1 justify-end mt-1">
                {pokemon.types.map((t: any) => (
                  <span
                    key={t.type.name}
                    className={`${TYPE_COLORS[t.type.name]} text-[8px] font-bold px-2 py-0.5 rounded text-white uppercase`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">
              Habilidade
            </label>
            <select className="w-full bg-zinc-900/50 border border-white/10 rounded-lg p-2 text-xs text-zinc-300 capitalize outline-none">
              {pokemon.abilities.map((a: any) => (
                <option key={a.ability.name} value={a.ability.name}>
                  {a.ability.name.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative group">
                <select
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-2 text-xs text-zinc-300 capitalize outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => handleMoveSelect(i, e.target.value)}
                >
                  <option value="">Selecionar Ataque</option>
                  {moves.map((m: any) => (
                    <option key={m.name} value={m.url}>
                      {m.name.replace("-", " ")}
                    </option>
                  ))}
                </select>

                {selectedMoves[i] && (
                  <div className="invisible group-hover:visible absolute z-20 w-full left-0 -top-28 p-3 bg-zinc-900 border border-white/20 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">
                          Dano
                        </p>
                        <p className="text-xs font-bold text-white">
                          {selectedMoves[i]?.power || "--"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">
                          Acc
                        </p>
                        <p className="text-xs font-bold text-white">
                          {selectedMoves[i]?.accuracy
                            ? `${selectedMoves[i]?.accuracy}%`
                            : "--"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">
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

                    <div className="pt-2 border-t border-white/10">
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
