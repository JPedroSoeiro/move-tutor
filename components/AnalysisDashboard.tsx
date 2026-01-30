import { TYPE_COLORS } from "@/constants/typeChart";

// Definimos a estrutura do conselho de substituição
interface ReplacementAdvice {
  replace: string;
  index: number;
  reason: string;
}

interface Props {
  missing: string[];
  defWeaknesses: [string, number][];
  tips: string[];
  nemesis: string[];
  onAddNemesis: (name: string) => void; // A função que estava faltando nas Props
  replacementAdvice: ReplacementAdvice | null; // O dado de conselho que estava faltando
}

export function AnalysisDashboard({
  missing,
  defWeaknesses,
  tips,
  nemesis,
  onAddNemesis,
  replacementAdvice,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
      {/* COLUNAS 1 E 2: ANÁLISE TÁTICA E COBERTURA */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cobertura Ofensiva */}
        <section className="p-8 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 shadow-xl">
          <h2 className="text-[10px] font-black text-white mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-1 h-4 bg-blue-500 rounded-full" /> Cobertura
            Faltante
          </h2>
          <div className="flex flex-wrap gap-2">
            {missing.length === 0 ? (
              <p className="text-green-400 font-black italic text-[10px] uppercase tracking-tighter">
                ✓ Cobertura Total!
              </p>
            ) : (
              missing.map((t) => (
                <span
                  key={t}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-white ${TYPE_COLORS[t]}`}
                >
                  {t}
                </span>
              ))
            )}
          </div>
        </section>

        {/* Ameaças Defensivas */}
        <section className="p-8 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 shadow-xl">
          <h2 className="text-[10px] font-black text-white mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-1 h-4 bg-red-500 rounded-full" /> Ameaças
            Acumuladas
          </h2>
          <div className="flex flex-wrap gap-3">
            {defWeaknesses.length > 0 ? (
              defWeaknesses.slice(0, 10).map(([type, score]) => (
                <div
                  key={type}
                  className="flex items-center gap-2 bg-zinc-900/80 p-2 rounded-xl border border-white/5"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${TYPE_COLORS[type]}`}
                  />
                  <span className="text-[10px] font-bold uppercase text-zinc-300">
                    {type}{" "}
                    <span
                      className={`ml-1 ${score >= 3 ? "text-red-500 font-black" : "text-zinc-500"}`}
                    >
                      +{score}
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-zinc-600 text-[10px] italic uppercase">
                Sem ameaças críticas.
              </p>
            )}
          </div>
        </section>

        {/* Sinergia */}
        <section className="md:col-span-2 p-8 bg-blue-500/5 backdrop-blur-md rounded-[40px] border border-blue-500/20 shadow-xl">
          <h2 className="text-[10px] font-black text-blue-400 mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />{" "}
            Sinergia Tática
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="p-5 bg-white/5 rounded-3xl border border-white/5 text-[11px] text-zinc-400 italic leading-relaxed"
              >
                {tip}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* COLUNA 3: NEMESIS FINDER */}
      <section className="p-8 bg-zinc-950/50 backdrop-blur-xl rounded-[50px] border border-red-500/30 shadow-2xl relative overflow-hidden flex flex-col">
        <h2 className="text-sm font-black text-red-500 mb-2 uppercase tracking-tighter italic">
          Nemesis Finder
        </h2>
        <p className="text-[9px] text-zinc-500 font-bold uppercase mb-8 tracking-widest leading-none">
          Clique para recrutar
        </p>

        <div className="flex-1 space-y-3 relative z-10">
          {nemesis.length > 0 ? (
            nemesis.map((pkmn) => (
              <button
                key={pkmn}
                onClick={() => onAddNemesis(pkmn)}
                className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-[30px] hover:border-red-500/60 hover:bg-red-500/10 transition-all group active:scale-95"
              >
                <span className="text-xs font-black text-white uppercase italic tracking-tighter group-hover:text-red-400">
                  {pkmn}
                </span>
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-red-500"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </button>
            ))
          ) : (
            <p className="text-[10px] text-zinc-700 italic text-center mt-20 font-bold uppercase">
              Aguardando análise...
            </p>
          )}
        </div>

        {/* CONSELHO DE SUBSTITUIÇÃO */}
        {replacementAdvice && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[8px] text-red-400 font-black uppercase tracking-widest text-center leading-relaxed">
              Sugestão: Substituir{" "}
              <span className="text-white">{replacementAdvice.replace}</span>
              <br />
              {replacementAdvice.reason}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
