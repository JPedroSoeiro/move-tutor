import { useState } from "react";
import { pokemonService } from "@/services/pokemonService";

export function useStatScout() {
  const [comparing, setComparing] = useState<{
    name: string;
    value: number;
    pkmnName: string;
  } | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const findSimilar = async (
    pkmnName: string,
    statName: string,
    value: number,
  ) => {
    setLoading(true);
    setComparing({ name: statName, value, pkmnName });
    try {
      const data = await pokemonService.getSimilarStats(statName, value);
      setResults(
        data.filter((p: any) => p.name !== pkmnName.toLowerCase()).slice(0, 5),
      );
    } catch (e) {
      console.error("Erro no Scout");
    } finally {
      setLoading(false);
    }
  };

  return {
    comparing,
    results,
    loading,
    findSimilar,
    close: () => {
      setComparing(null);
      setResults([]);
    },
  };
}
