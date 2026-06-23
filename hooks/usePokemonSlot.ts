"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { pokemonService } from "@/services/pokemonService";
import type {
  PokemonData,
  MoveDetails,
  ItemDetails,
  AbilityDetails,
  MoveOption,
  SlotData,
} from "@/types";

interface UsePokemonSlotProps {
  index: number;
  initialData?: Partial<SlotData> | null;
  onUpdate: (idx: number, data: Partial<SlotData> | null) => void;
}

export function usePokemonSlot({ index, initialData, onUpdate }: UsePokemonSlotProps) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [moves, setMoves] = useState<MoveOption[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<(MoveDetails | null)[]>([null, null, null, null]);
  const [selectedAbility, setSelectedAbility] = useState<AbilityDetails | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemDetails | null>(null);
  const [selectedNature, setSelectedNature] = useState<string>("Hardy");
  const [isShiny, setIsShiny] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [showEvoLab, setShowEvoLab] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadDependencies = async () => {
      if (!initialData?.pokemon) return;

      const isNewPokemon = initialData.pokemon.id !== pokemon?.id;

      if (inputRef.current) inputRef.current.value = initialData.pokemon.name;

      try {
        const evos = await pokemonService.getEvolutionChain(initialData.pokemon.species.url);
        setEvolutions(evos);
      } catch {
        console.error("Erro ao buscar evolução");
      }

      const availableMoves: MoveOption[] = initialData.pokemon.moves
        .map((m) => ({ name: m.move.name, url: m.move.url }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setMoves(availableMoves);
      setPokemon(initialData.pokemon);

      if (isNewPokemon && !initialData.selectedMoves) {
        setSelectedMoves([null, null, null, null]);
        setSelectedAbility(null);
        setSelectedItem(null);
        setSelectedNature("Hardy");
        setIsShiny(false);
      } else {
        setSelectedMoves(initialData.selectedMoves || [null, null, null, null]);
        setSelectedAbility(initialData.selectedAbility || null);
        setSelectedItem(initialData.selectedItem || null);
        setSelectedNature(initialData.nature || "Hardy");
        setIsShiny(initialData.isShiny || false);
      }
    };

    loadDependencies();
  }, [initialData]);

  const syncUpdate = (updatedFields: Partial<SlotData>) => {
    const finalData: SlotData = {
      pokemon,
      moves,
      selectedMoves,
      selectedAbility,
      selectedItem,
      nature: selectedNature,
      isShiny,
      moveTypes: (updatedFields.selectedMoves || selectedMoves)
        .filter((m): m is MoveDetails => m !== null && !!m.type)
        .map((m) => m.type?.name ?? "unknown"),
      ...updatedFields,
    };
    onUpdate(index, finalData);
  };

  const handleSearch = async (name: string) => {
    if (!name || name === pokemon?.name) return;
    try {
      const data = await pokemonService.getPokemonByName(name);
      onUpdate(index, { pokemon: data });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Pokémon não encontrado";
      // Apenas loga erros não-relacionados a "não encontrado"
      if (!errorMsg.includes("não encontrado")) {
        console.error("Erro na busca do Pokémon:", error);
      }
      toast.error(`❌ ${errorMsg}`);
    }
  };

  const handleClearSlot = () => {
    if (inputRef.current) inputRef.current.value = "";
    setPokemon(null);
    setMoves([]);
    setEvolutions([]);
    onUpdate(index, null);
  };

  const calculateRealPower = (move: MoveDetails | null): number => {
    if (!move || !pokemon || !move.power) return move?.power ?? 0;
    return pokemon.types.some((t) => t.type.name === move.type.name)
      ? Math.floor(move.power * 1.5)
      : move.power;
  };

  const animatedSprite = isShiny
    ? pokemon?.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_shiny
    : pokemon?.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;

  const staticSprite = isShiny ? pokemon?.sprites.front_shiny : pokemon?.sprites.front_default;
  const spritePath =
    animatedSprite ||
    staticSprite ||
    (pokemon ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` : "");

  return {
    pokemon,
    moves,
    selectedMoves,
    setSelectedMoves,
    selectedAbility,
    setSelectedAbility,
    selectedItem,
    setSelectedItem,
    selectedNature,
    setSelectedNature,
    isShiny,
    setIsShiny,
    showOptions,
    setShowOptions,
    evolutions,
    showEvoLab,
    setShowEvoLab,
    inputRef,
    syncUpdate,
    handleSearch,
    handleClearSlot,
    calculateRealPower,
    spritePath,
  };
}
