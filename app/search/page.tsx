"use client";

import { useState, useEffect, useRef } from "react";
import { teamService } from "@/services/teamService";
import { ProfileView } from "@/components/ProfileView";
import { AuthLock } from "@/components/auth/AuthLock";


export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundData, setFoundData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/teams/users/list");
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error("Erro ao carregar treinadores", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSelectUser = (name: string) => {
    setSearchTerm(name);
    setIsDropdownOpen(false);
    handleSearch(name);
  };

  const handleSearch = async (name: string) => {
    const target = name || searchTerm;
    if (!target.trim()) return;
    setLoading(true);
    try {
      const data = await teamService.getUserTeams(target);
      setFoundData(data);
    } catch (error) {
      alert("Treinador não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-4 px-8 pb-20">
      <AuthLock />
      {/* Container da Barra + Dropdown */}
      <div className="relative mb-20 z-50" ref={dropdownRef}>
        <input 
          type="text"
          placeholder="PESQUISAR TREINADOR PELO NOME..."
          className="w-full bg-[#0a0a0a] border border-white/10 p-8 rounded-[30px] text-[12px] font-black uppercase tracking-[0.4em] text-white focus:border-blue-500 outline-none transition-all shadow-2xl"
          value={searchTerm}
          onFocus={() => setIsDropdownOpen(true)} // Abre ao clicar
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
        />

        {/* Dropdown de Usuários (Aparece no Focus) */}
        {isDropdownOpen && allUsers.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-[25px] shadow-2xl max-h-60 overflow-y-auto z-100 animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-white/5">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest italic">Treinadores Encontrados</p>
            </div>
            
            {allUsers
              .filter(u => {
                if (!u) return false;
                return u.toLowerCase().includes(searchTerm.toLowerCase());
              })
              .map((user) => (
                <button
                  key={user}
                  onMouseDown={() => handleSelectUser(user)}
                  className="w-full text-left px-8 py-5 text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:bg-blue-600/10 hover:text-blue-500 transition-all border-b border-white/5 last:border-0 flex items-center justify-between group"
                >
                  <span>{user}</span>
                  <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 italic">Ver Perfil →</span>
                </button>
              ))
            }

            {/* Caso o filtro não encontre ninguém */}
            {allUsers.filter(u => u?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
              <div className="p-8 text-center text-zinc-700 text-[10px] font-black uppercase italic">
                Nenhum treinador nas coordenadas...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resultado do Perfil ou Placeholder */}
      {foundData ? (
        <ProfileView 
          data={foundData} 
          isOwnProfile={false} 
          onTeamDeleted={() => {}} 
        />
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
            <p className="text-zinc-800 font-black italic uppercase tracking-[1em]">Clique na barra acima para ver os treinadores</p>
        </div>
      )}
    </div>
  );
}