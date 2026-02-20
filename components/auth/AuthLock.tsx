"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export function AuthLock() {
  const { status } = useSession();

  // Se estiver carregando ou autenticado, não mostra nada
  if (status === "loading" || status === "authenticated") return null;

  return (
    <div className="fixed inset-0 z-150 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Ícone ou Logo Minimalista */}
        <div className="w-20 h-20 mx-auto bg-zinc-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-blue-500 text-2xl font-black italic">!</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">
            ACESSO <span className="text-blue-500">RESTRITO</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] leading-relaxed">
            Faça o login para acessar o conteúdo do Move Tutor
          </p>
        </div>

        <Link 
          href="/login" 
          className="inline-block px-10 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          Ir para o Laboratório
        </Link>
      </div>
    </div>
  );
}