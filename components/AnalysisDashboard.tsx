import { TYPE_COLORS } from "@/constants/typeChart";

interface Props {
  missing: string[];
  defWeaknesses: [string, number][];
  tips: string[];
}

export function AnalysisDashboard({ missing, defWeaknesses, tips }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
      <div className="space-y-8">
        <section className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
          <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest border-l-4 border-blue-500 pl-4">
            Cobertura Ofensiva Faltante
          </h2>
          <div className="flex flex-wrap gap-2">
            {missing.length === 0 ? (
              <p className="text-green-400 font-bold italic">
                ✓ Cobertura Total!
              </p>
            ) : (
              missing.map((t) => (
                <span
                  key={t}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-white ${TYPE_COLORS[t]}`}
                >
                  {t}
                </span>
              ))
            )}
          </div>
        </section>
        <section className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
          <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest border-l-4 border-red-500 pl-4">
            Ameaças Defensivas
          </h2>
          <div className="flex flex-wrap gap-3">
            {defWeaknesses.map(([type, count]) => (
              <div
                key={type}
                className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-white/5"
              >
                <span className={`w-3 h-3 rounded-full ${TYPE_COLORS[type]}`} />
                <span className="text-[10px] font-bold uppercase">
                  {type}{" "}
                  <span
                    className={count >= 3 ? "text-red-500" : "text-zinc-500"}
                  >
                    {count}x
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="p-8 bg-blue-500/5 backdrop-blur-md rounded-3xl border border-blue-500/20 shadow-xl">
        <h2 className="text-sm font-black text-blue-400 mb-6 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />{" "}
          Sinergia
        </h2>
        <div className="space-y-4">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="p-5 bg-white/5 rounded-2xl border border-white/5 text-xs text-zinc-300 italic"
            >
              {tip}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
