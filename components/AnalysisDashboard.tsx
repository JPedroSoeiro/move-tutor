import { TYPE_COLORS } from "@/constants/typeChart";

interface Props {
  missing: string[];
  defWeaknesses: [string, number][];
}

export function AnalysisDashboard({ missing, defWeaknesses }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
      {/* COLUNA 1: COBERTURA FALTANTE */}
      <section className="p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
        <h2 className="text-[9px] font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          Cobertura Faltante
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

      {/* COLUNA 2: AMEAÇAS ACUMULADAS */}
      <section className="p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all">
        <h2 className="text-[9px] font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          Ameaças Acumuladas
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
    </div>
  );
}
