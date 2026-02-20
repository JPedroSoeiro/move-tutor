"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function AuthLock() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  
  // Ref para rastrear se o usuário já esteve autenticado nesta sessão
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    // Se ele logar, marcamos que ele "entrou" no laboratório
    if (status === "authenticated") {
      wasAuthenticated.current = true;
    }

    // Se o status mudar para deslogado...
    if (status === "unauthenticated") {
      const isManual = searchParams.get("logout") === "manual";
      
      // SÓ mostramos o alerta se:
      // 1. Ele já esteve logado antes (wasAuthenticated)
      // 2. O logout NÃO foi manual
      if (wasAuthenticated.current && !isManual) {
        setShowAlert(true);
      }
    }
  }, [status, searchParams]);

  if (!showAlert) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-blue-500/20 p-8 rounded-32px text-center max-w-sm shadow-[0_0_50px_rgba(59,130,246,0.1)]">
         <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <span className="text-blue-500 font-black italic">!</span>
         </div>
         <h2 className="text-white font-black uppercase italic text-lg tracking-tighter">Sessão Expirada</h2>
         <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mt-2 leading-relaxed">
           Sua credencial tática de acesso expirou por inatividade.
         </p>
         <button 
           onClick={() => window.location.href = "/login"}
           className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic rounded-2xl text-[10px] transition-all"
         >
           Revalidar Acesso
         </button>
      </div>
    </div>
  );
}