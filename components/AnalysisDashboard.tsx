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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
      {/* COLUNAS 1 E 2: ANÁLISE TÁTICA E COBERTURA */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cobertura Ofensiva */}
        <section className="p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-[9px] font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-500 rounded-full" /> Cobertura Faltante
          </h2>
          <div className="flex flex-wrap gap-2">
            {missing.length === 0 ? (
              <p className="text-green-400 font-black text-[9px] uppercase tracking-wide">
                ✓ Cobertura Completa
              </p>
            ) : (
              missing.map((t) => (
                <span
                  key={t}
                  className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase text-white border border-white/20 ${TYPE_COLORS[t]}`}
                >
                  {t}
                </span>
              ))
            )}
          </div>
        </section>

        {/* Ameaças Defensivas */}
        <section className="p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-[9px] font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-3 bg-red-500 rounded-full" /> Ameaças Acumuladas
          </h2>
          <div className="space-y-2">
            {defWeaknesses.length > 0 ? (
              defWeaknesses.slice(0, 6).map(([type, score]) => (
                <div
                  key={type}
                  className="flex items-center justify-between gap-3 p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className={`w-2 h-2 rounded-full ${TYPE_COLORS[type]}`}
                    />
                    <span className="text-[9px] font-bold uppercase text-zinc-300">
                      {type}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black ${score >= 3 ? "text-red-400" : "text-zinc-400"}`}
                  >
                    +{score}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-zinc-600 text-[9px] italic uppercase text-center py-4">
                Defesa equilibrada
              </p>
            )}
          </div>
        </section>

        {/* Sinergia */}
        <section className="md:col-span-2 p-6 bg-gradient-to-br from-blue-500/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-blue-500/20 hover:border-blue-500/40 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-[9px] font-black text-blue-400 mb-4 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-500 rounded-full animate-pulse" /> Sinergia Tática
          </h2>
          <div className="space-y-3">
            {tips.length > 0 ? tips.map((tip, i) => (
              <div
                key={i}
                className="p-3 bg-white/5 rounded-lg border border-white/5 text-[9px] text-zinc-300 leading-relaxed hover:bg-white/10 transition-all"
              >
                {tip}
              </div>
            )) : (
              <p className="text-[9px] text-zinc-600 italic text-center py-4">
                Construa seu time para análise
              </p>
            )}
          </div>
        </section>
      </div>

      {/* COLUNA 3: NEMESIS FINDER */}
      <section className="p-6 bg-gradient-to-br from-red-500/[0.08] via-white/[0.02] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-red-500/20 hover:border-red-500/40 shadow-lg hover:shadow-xl relative overflow-hidden flex flex-col transition-all">
        <h2 className="text-[11px] font-black text-red-400 mb-1 uppercase tracking-tight">
          Nemesis Finder
        </h2>
        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-4 tracking-widest">
          Ameaças principais
        </p>

        <div className="flex-1 space-y-2 relative z-10">
          {nemesis.length > 0 ? (
            nemesis.map((pkmn) => (
              <button
                key={pkmn}
                onClick={() => onAddNemesis(pkmn)}
                className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all group active:scale-95"
              >
                <span className="text-[9px] font-black text-white uppercase tracking-tight group-hover:text-red-300">
                  {pkmn}
                </span>
                <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-red-500"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </button>
            ))
          ) : (
            <p className="text-[8px] text-zinc-700 italic text-center mt-12 font-bold uppercase">
              Aguardando análise...
            </p>
          )}
        </div>

        {/* CONSELHO DE SUBSTITUIÇÃO */}
        {replacementAdvice && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[7.5px] text-red-400 font-black uppercase tracking-widest text-center leading-tight">
              Sugestão: <span className="text-white block mt-1">{replacementAdvice.replace}</span>
              <span className="text-zinc-500 mt-1 block">{replacementAdvice.reason}</span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
