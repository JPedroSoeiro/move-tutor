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
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Erro ao ler dados do treinador", e);
      }
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
                {/* Lógica ultra-segura: Pega a primeira letra disponível ou 'T' de Treinador */}
                {(user.full_name || user.name || "T").substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Treinador</span>
                <span className="text-sm font-black text-white truncate">
                  {user.full_name || user.name || "Mestre Pokémon"}
                </span>
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