"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // MANTENHA APENAS ESTA VERSÃO DO handleLogin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // O "enviado" aqui são as credenciais para o seu back-end local
      await authService.login(email, password);
      
      // Lógica de redirecionamento: Prioriza o rascunho pendente
      const hasPendingTeam = sessionStorage.getItem("@MoveTutor:pendingTeam");
      
      if (hasPendingTeam) {
        router.push("/team-builder");
      } else {
        router.push("/feed");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Entrar</h2>
          <p className="text-zinc-500 text-sm mt-2">Acesse sua conta para salvar seus times VGC</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500 transition-colors"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Senha</label>
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-blue-500/20"
          >
            {loading ? "Carregando..." : "Iniciar Sessão"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Não tem uma conta?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline font-bold">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}