import { TYPE_COLORS } from "@/constants/typeChart";

interface Props {
  missing: string[];
  defWeaknesses: [string, number][];
  tips: string[];
  nemesis: string[];
}

export function AnalysisDashboard({
  missing,
  defWeaknesses,
  tips,
  nemesis,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* COBERTURA OFENSIVA (CORRIGIDA) */}
        <section className="p-8 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 shadow-xl">
          <h2 className="text-[10px] font-black text-white mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-1 h-4 bg-blue-500 rounded-full" /> Cobertura
            Faltante
          </h2>
          <div className="flex flex-wrap gap-2">
            {missing.length === 0 ? (
              <p className="text-green-400 font-black italic text-[10px] uppercase">
                ✓ Seu time atinge todos os tipos!
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

        {/* AMEAÇAS DEFENSIVAS (SOMA ACUMULADA) */}
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
                Sem dados.
              </p>
            )}
          </div>
        </section>

        {/* SINERGIA */}
        <section className="md:col-span-2 p-8 bg-blue-500/5 backdrop-blur-md rounded-[40px] border border-blue-500/20 shadow-xl">
          <h2 className="text-[10px] font-black text-blue-400 mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />{" "}
            Sugestões de Sinergia
          </h2>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 rounded-2xl text-[11px] text-zinc-400 italic"
              >
                {tip}
              </div>
            ))}
            {tips.length === 0 && (
              <p className="text-zinc-600 text-[10px] uppercase italic text-center">
                Time equilibrado ou incompleto.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* NEMESIS FINDER (Baseado na maior ameaça acumulada) */}
      <section className="p-8 bg-zinc-950/50 backdrop-blur-xl rounded-[50px] border border-red-500/30 shadow-2xl relative overflow-hidden flex flex-col">
        <h2 className="text-sm font-black text-red-500 mb-2 uppercase tracking-tighter italic">
          Nemesis Finder
        </h2>
        <p className="text-[9px] text-zinc-500 font-bold uppercase mb-8 tracking-widest leading-none">
          Antídotos para sua fraqueza atual
        </p>

        <div className="flex-1 space-y-3">
          {nemesis.map((pkmn) => (
            <div
              key={pkmn}
              className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-[30px] hover:border-red-500/40 transition-all group"
            >
              <span className="text-xs font-black text-white uppercase italic tracking-tighter">
                {pkmn}
              </span>
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-red-500"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
          ))}
          {nemesis.length === 0 && (
            <p className="text-[10px] text-zinc-700 italic text-center mt-20 font-bold uppercase">
              Aguardando análise...
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
