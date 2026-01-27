"use client";
import { useState, useEffect } from "react";
import { PokemonSlot } from "@/components/PokemonSlot";
import { pokemonService } from "@/services/pokemonService";
import { OFFENSIVE_CHART, TYPE_COLORS } from "@/constants/typeChart";

export default function Home() {
  const [allNames, setAllNames] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<
    Record<number, { pokemon: any; moveTypes: string[] }>
  >({});

  useEffect(() => {
    pokemonService.getAllNames().then(setAllNames);
  }, []);

  const getMissingCoverage = () => {
    const activeMoveTypes = Object.values(teamData).flatMap(
      (slot) => slot.moveTypes || [],
    );
    const covered = new Set<string>();
    activeMoveTypes.forEach((type) => {
      OFFENSIVE_CHART[type]?.forEach((target) => covered.add(target));
    });
    return Object.keys(OFFENSIVE_CHART).filter((type) => !covered.has(type));
  };

  const missing = getMissingCoverage();

  const handleUpdateSlot = (
    idx: number,
    data: { pokemon: any; moveTypes: string[] },
  ) => {
    setTeamData((prev) => ({ ...prev, [idx]: data }));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">
            MOVE <span className="text-blue-500">TUTOR</span> PRO
          </h1>
          <p className="text-zinc-500 font-medium">
            Análise de cobertura ofensiva em tempo real.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[...Array(6)].map((_, i) => (
            <PokemonSlot
              key={i}
              index={i}
              allNames={allNames}
              onUpdate={handleUpdateSlot}
            />
          ))}
        </div>

        <section className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
            Tipos sem Cobertura
          </h2>
          <div className="flex flex-wrap gap-3">
            {missing.length === 0 ? (
              <p className="text-green-500 font-bold italic">
                Cobertura Ofensiva Total!
              </p>
            ) : (
              missing.map((type: string) => (
                <span
                  key={type}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-lg ${TYPE_COLORS[type]}`}
                >
                  {type}
                </span>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
