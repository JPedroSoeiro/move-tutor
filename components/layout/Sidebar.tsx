"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  
  // Estado para controlar o menu aberto/fechado de forma mais suave
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuItems = [
    { name: "Team Builder", path: "/team-builder" },
    { name: "Feed", path: "/feed" },
    { name: "Profile", path: "/profile" },
    { name: "Search", path: "/search" },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 z-100 px-10 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
          MOVE <span className="text-blue-500">TUTOR</span>
        </h1>
      </div>

      {/* Navegação */}
      <nav className="flex items-center gap-10">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white ${
              pathname === item.path ? "text-blue-500" : "text-zinc-500"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Área do Usuário */}
      <div className="flex items-center">
        {status === "authenticated" && user ? (
          <div 
            className="relative"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            {/* Gatilho do Menu: Avatar + Nome */}
            <div className="flex items-center gap-4 cursor-pointer py-2">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white font-black uppercase tracking-widest">
                  {user.name || "Treinador"}
                </span>
                <span className="text-[8px] text-zinc-500 font-bold italic uppercase">
                  Mestre Pokémon
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black border border-white/20 text-white shadow-lg shadow-blue-500/20 italic">
                {(user.name || "T").substring(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Dropdown Menu Estilizado */}
            <div className={`absolute top-full right-0 w-48 pt-2 transition-all duration-200 origin-top-right ${
              isProfileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}>
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 mb-1">
                  <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Configurações</p>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 rounded-xl transition-colors flex items-center justify-between"
                >
                  Encerrar Sessão
                  <span className="text-[14px]">→</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="px-6 py-3 bg-white text-black font-black text-[10px] uppercase rounded-xl hover:bg-zinc-200 transition-all"
          >
            Acessar Lab
          </Link>
        )}
      </div>
    </header>
  );
}