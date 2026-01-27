"use client";

interface RadarProps {
  stats: { base_stat: number; stat: { name: string } }[];
}

export function RadarChart({ stats }: RadarProps) {
  const maxStat = 255;
  const size = 180; // Aumentado levemente para acomodar os números
  const center = size / 2;
  const radius = size * 0.35;

  const formatStatName = (name: string) => {
    switch (name) {
      case "special-attack":
        return "S.Attack";
      case "special-defense":
        return "S.Defense";
      case "hp":
        return "HP";
      case "attack":
        return "Attack";
      case "defense":
        return "Defense";
      case "speed":
        return "Speed";
      default:
        return name;
    }
  };

  const points = stats
    .map((s, i) => {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
      const value = (s.base_stat / maxStat) * radius * 2.2;
      const x = center + value * Math.cos(angle);
      const y = center + value * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center bg-zinc-950/95 p-5 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl">
      <svg width={size} height={size} className="overflow-visible">
        {/* Polígono de Stats */}
        <polygon
          points={points}
          className="fill-blue-500/40 stroke-blue-400 stroke-2 transition-all duration-500"
        />

        {stats.map((s, i) => {
          const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
          // Ajuste de distância para o texto não sobrepor o gráfico
          const x = center + radius * 1.3 * Math.cos(angle);
          const y = center + radius * 1.3 * Math.sin(angle);

          return (
            <text
              key={i}
              x={x}
              y={y}
              className="fill-white font-medium uppercase tracking-tighter"
              textAnchor="middle"
            >
              <tspan
                x={x}
                dy="0"
                className="fill-zinc-400 text-[9px] font-bold"
              >
                {formatStatName(s.stat.name)}
              </tspan>
              <tspan
                x={x}
                dy="12"
                className="fill-white text-[11px] font-black"
              >
                {s.base_stat}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
