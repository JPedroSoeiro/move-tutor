"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const pathname = usePathname();
  
  // O NextAuth substitui o useState e o useEffect manuais
  const { data: session, status } = useSession();
  const user = session?.user;

  const menuItems = [
    { name: "Team Builder", path: "/team-builder" },
    { name: "Feed", path: "/feed" },
  ];

  const handleLogout = () => {
    // Limpa a sessão e redireciona automaticamente para o login
    signOut({ callbackUrl: "/login" });
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
        {/* Verificamos se o status é 'authenticated' para mostrar o perfil */}
        {status === "authenticated" && user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black border border-white/10 text-white shadow-lg shadow-blue-500/20 italic">
                {/* O NextAuth padroniza o nome como 'name' por padrão */}
                {(user.name || "T").substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-white font-black uppercase tracking-widest truncate">
                  {user.name || "Treinador"}
                </span>
                <span className="text-[9px] text-zinc-500 font-bold italic">
                  Mestre Pokémon
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