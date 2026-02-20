"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-50vh flex flex-col items-center justify-center px-4 bg-[#050505] overflow-hidden">
      {/* Detalhe de fundo - Brilho sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-500px h-500px bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-3xl">
        {/* Badge de Versão */}
        <div className="inline-block px-4 py-1.5 border border-blue-500/20 bg-blue-500/5 rounded-full">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">
            Alpha Version • Tactical Intelligence
          </span>
        </div>

        {/* Título Principal */}
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
            Move <span className="text-blue-500">Tutor</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm font-black uppercase tracking-[0.5em] italic">
            O Laboratório Definitivo para Estratégias VGC
          </p>
        </div>

        {/* Descrição Curta */}
        <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto">
          Construa esquadrões imparáveis, analise o meta-game em tempo real e 
          compartilhe suas builds com a elite dos treinadores Pokémon.
        </p>

        {/* Ações */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
          <Link 
            href="/feed" 
            className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase text-sm rounded-2xl transition-all shadow-2xl shadow-blue-600/20 overflow-hidden"
          >
            <span className="relative z-10">Acessar Laboratório</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          
          <Link 
            href="/signup" 
            className="text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-widest border-b border-transparent hover:border-white/20 pb-1 transition-all"
          >
            Criar Registro Acadêmico →
          </Link>
        </div>
      </div>

      {/* Footer Minimalista */}
      <footer className="absolute bottom-10 text-[8px] font-black text-zinc-800 uppercase tracking-[0.8em]">
        Move Tutor Unit • {new Date().getFullYear()}
      </footer>
    </div>
  );
}