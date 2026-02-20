"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SessionMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se o status for 'unauthenticated', significa que o token expirou ou o user deslogou
    if (status === "unauthenticated") {
      const lastSession = localStorage.getItem("had_session");

      if (lastSession) {
        alert("Sua sessão expirou. Por favor, faça login novamente para continuar salvando seus times.");
        localStorage.removeItem("had_session");
        signOut({ redirect: false }).then(() => {
          router.push("/login");
        });
      }
    }

    if (status === "authenticated") {
      localStorage.setItem("had_session", "true");
    }
  }, [status, router]);

  return null; // Este componente não renderiza nada visualmente
}