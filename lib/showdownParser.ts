// O "enviado" aqui é o texto bruto copiado do Showdown
export const parseShowdown = (text: string) => {
  const teams = text.split('\n\n'); // O Showdown separa Pokémons por duas quebras de linha
  const parsedTeam: Record<number, any> = {};

  teams.forEach((block, index) => {
    if (index > 5) return; // Limite de 6 slots
    
    const lines = block.split('\n').map(l => l.trim());
    if (lines.length === 0 || !lines[0]) return;

    // Linha 1: Nome (ou Nickname) @ Item
    const header = lines[0].split('@');
    const name = header[0].trim();
    const item = header[1] ? header[1].trim() : "";

    // Buscar Ability e Nature nas linhas seguintes
    const abilityLine = lines.find(l => l.startsWith('Ability:'));
    const natureLine = lines.find(l => l.startsWith('Nature:'));
    
    // Buscar Moves (linhas que começam com -)
    const moves = lines
      .filter(l => l.startsWith('-'))
      .map(l => l.replace('-', '').trim());

    parsedTeam[index] = {
      pokemon: { name: name.toLowerCase() }, // Depois o service busca os dados completos
      selectedItem: { name: item.toLowerCase().replace(/ /g, '-') },
      selectedAbility: { name: abilityLine ? abilityLine.split(':')[1].trim().toLowerCase().replace(/ /g, '-') : "" },
      nature: natureLine ? natureLine.split(':')[0].trim() : "Hardy",
      selectedMoves: moves.map(m => ({ name: m.toLowerCase().replace(/ /g, '-') }))
    };
  });

  return parsedTeam;
};