"use client";

import { pokemonService } from "@/services/pokemonService";
import type { MoveDetails, MoveOption } from "@/types";

interface MoveSlotProps {
  moveIndex: number;
  selectedMove: MoveDetails | null;
  moves: MoveOption[];
  realPower: number;
  onMoveChange: (idx: number, move: MoveDetails) => void;
}

export function MoveSlot({ moveIndex, selectedMove, moves, realPower, onMoveChange }: MoveSlotProps) {
  return (
    <div className="relative group/move h-full">
      <select
        className="w-full h-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white capitalize outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
        value={selectedMove?.name || ""}
        onChange={(e) => {
          const url = moves.find((m) => m.name === e.target.value)?.url;
          if (url) pokemonService.getMoveDetails(url).then((d) => onMoveChange(moveIndex, d));
        }}
      >
        <option value="">Move {moveIndex + 1}</option>
        {moves.map((m) => (
          <option key={m.name} value={m.name}>
            {m.name.replace(/-/g, " ")}
          </option>
        ))}
      </select>

      {selectedMove && (
        <div className="invisible group-hover/move:visible absolute z-60 w-56 left-1/2 -translate-x-1/2 -top-44 p-3 bg-zinc-950/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-2 gap-2 text-center">
            <div className="flex-1">
              <p className="text-[8px] text-zinc-500 uppercase font-black tracking-wider">Power</p>
              <p className={`text-xs font-black ${realPower !== selectedMove.power ? "text-blue-400" : "text-white"}`}>
                {realPower || "--"}
              </p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex-1">
              <p className="text-[8px] text-zinc-500 uppercase font-black tracking-wider">Acc</p>
              <p className="text-xs font-black text-white">
                {selectedMove.accuracy ? `${selectedMove.accuracy}%` : "--"}
              </p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex-1">
              <p className="text-[8px] text-zinc-500 uppercase font-black tracking-wider">PP</p>
              <p className="text-xs font-black text-white">{selectedMove.pp}</p>
            </div>
          </div>
          <p className="text-[8px] text-zinc-400 italic leading-tight">
            {selectedMove.effect_entries
              ?.find((e) => e.language.name === "en")
              ?.short_effect?.replace("$effect_chance", String(selectedMove.effect_chance)) ||
              "Sem efeito adicional."}
          </p>
        </div>
      )}
    </div>
  );
}
