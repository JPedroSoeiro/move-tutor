"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Usamos 'any' aqui para evitar que o TS barre o acesso a full_name ou name
  const [user, setUser] = useState<any>(null);

  const menuItems = [
    { name: "Team Builder", path: "/team-builder" },
    { name: "Feed", path: "/feed" },
  ];

useEffect(() => {
  const storedUser = localStorage.getItem("@MoveTutor:user");
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    console.log("Usuário carregado na Sidebar:", parsed); 
    setUser(parsed);
  }
}, [pathname]);
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
          MOVE <span className="text-blue-500">TUTOR</span>
        </h1>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`${styles.navLink} ${pathname === item.path ? styles.active : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
  {user ? (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black border border-white/10 text-white shadow-lg shadow-blue-500/20">
          {/* Abreviação do nome do usuário */}
          {(user.full_name || user.name || "T").substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          {/* Aqui trocamos o texto estático "Treinador" pelo nome do usuário */}
          <div className="flex flex-col min-w-0">
         {/* Ocupa o lugar do antigo "Treinador" com o nome real */}
         <span className="text-[10px] text-white font-black uppercase tracking-widest truncate">
            {user?.full_name || user?.name || "Treinador"}
         </span>
         <span className="text-[9px] text-zinc-500 font-bold italic">
            Mestre Pokémon
         </span>
         </div>
        </div>
      </div>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Encerrar Sessão
      </button>
    </div>
  ) : (
    <Link href="/login" className={styles.loginBtn}>
      Acessar Lab
    </Link>
  )}
</div>
    </aside>
  );
}