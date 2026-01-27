export async function getMoveData(moveName: string) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/move/${moveName.toLowerCase().replace(/\s+/g, "-")}`,
    );

    if (!response.ok) {
      throw new Error("Golpe não encontrado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar golpe:", error);
    return null;
  }
}
