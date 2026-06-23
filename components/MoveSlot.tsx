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
        className="w-full h-full bg-zinc-900/80 border border-white/20 rounded-lg px-2.5 py-2 text-xs text-white capitalize outline-none focus:border-blue-500 focus:bg-zinc-800 focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer hover:border-white/40 hover:bg-zinc-800/50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.5rem center",
          paddingRight: "1.75rem"
        }}
        value={selectedMove?.name || ""}
        onChange={(e) => {
          const url = moves.find((m) => m.name === e.target.value)?.url;
          if (url) pokemonService.getMoveDetails(url).then((d) => onMoveChange(moveIndex, d));
        }}
      >
        <option value="">Move {moveIndex + 1}</option>
        {moves.map((m) => (
          <option key={m.name} value={m.name} className="bg-zinc-900 text-white">
            {m.name.replace(/-/g, " ")}
          </option>
        ))}
      </select>

      {selectedMove && (
        <div className="invisible group-hover/move:visible absolute z-60 w-56 left-1/2 -translate-x-1/2 -top-44 p-3 bg-zinc-950 border border-white/20 rounded-xl shadow-2xl backdrop-blur-md">
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
          <p className="text-[8px] text-zinc-300 italic leading-tight">
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
