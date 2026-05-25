"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export function AuthLock() {
  const { status } = useSession();

  if (status === "loading") return null;
  if (status === "authenticated") return null;

  return (
    <div className="fixed inset-0 h-screen w-screen z-9999 bg-black flex items-center justify-center overflow-hidden">
      
      {/* Botão de Fechar (Redireciona para Home) */}
      <Link 
        href="/"
        className="absolute top-8 right-8 z-10000 group flex items-center gap-2"
      >
        <span className="text-zinc-500 text-[10px] font-black uppercase italic tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Sair do Lab
        </span>
        <div className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-red-500/20 group-hover:border-red-500/50 transition-all">
          <span className="text-white group-hover:text-red-500 font-light text-xl">✕</span>
        </div>
      </Link>

      {/* Camada de desfoque ultra-denso */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />

      <div className="relative z-10 w-full max-w-md p-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="space-y-6">
          <h2 className="text-6xl font-black italic uppercase text-white tracking-tighter leading-none">
            Acesso <br />
            <span className="text-blue-500 text-7xl">Trancado</span>
          </h2>
          
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed pt-4">
            Área restrita do laboratório. <br />
            Identifique-se para liberar o acesso total.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-xs mx-auto mt-10">
          <Link 
            href="/login"
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic rounded-2xl text-xs transition-all shadow-[0_0_50px_rgba(59,130,246,0.3)]"
          >
            Efetuar Login
          </Link>
          <Link 
            href="/signup"
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white font-black uppercase italic rounded-2xl text-xs transition-all border border-white/10"
          >
            Novo Registro
          </Link>
        </div>
      </div>
    </div>
  );
}