"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const menuItems = [
    { name: "Team Builder", path: "/team-builder" },
    { name: "Feed", path: "/feed" },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    // Mudança para fixed top-0 w-full h-20
    <header className="fixed top-0 left-0 w-full h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 z-100 px-8 flex items-center justify-between">
      
      {/* Logo à Esquerda */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
          MOVE <span className="text-blue-500">TUTOR</span>
        </h1>
      </div>

      {/* Navegação Central */}
      <nav className="flex items-center gap-6">
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

      {/* Perfil / Login à Direita */}
      <div className="flex items-center gap-6">
        {status === "authenticated" && user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] text-white font-black uppercase tracking-widest truncate max-w-120px">
                {user.name || "Treinador"}
              </span>
              <span className="text-[8px] text-zinc-500 font-bold italic uppercase tracking-tighter">
                Mestre Pokémon
              </span>
            </div>

            {/* Avatar Circular */}
            <div className="group relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black border border-white/10 text-white shadow-lg shadow-blue-500/20 italic cursor-pointer">
                {(user.name || "T").substring(0, 2).toUpperCase()}
              </div>
              
              {/* Dropdown Simples de Logout no Hover */}
              <button 
                onClick={handleLogout}
                className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-all bg-red-600 text-white text-[8px] font-black uppercase px-3 py-2 rounded-lg whitespace-nowrap"
              >
                Encerrar Sessão
              </button>
            </div>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          >
            Acessar Lab
          </Link>
        )}
      </div>
    </header>
  );
}