"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ProfileView } from "@/components/ProfileView";
import { teamService } from "@/services/teamService";
import { AuthLock } from "@/components/auth/AuthLock";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      // Usamos o nome do usuário da sessão para buscar os dados
      if (session?.user?.name) {
        try {
          const data = await teamService.getUserTeams(session.user.name);
          setProfileData(data);
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      }
    };
    loadProfile();
  }, [session]);

  // Função que remove o time do estado local para o sumiço ser imediato
  const handleTeamDeleted = (deletedId: string) => {
    setProfileData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        // Remove apenas o time deletado da lista
        teams: prev.teams.filter((team: any) => team.id !== deletedId),
        // Atualiza o contador de times no header do perfil
        count: Math.max(0, (prev.count || 0) - 1)
      };
    });
  };

  return (
    <>
      {/* Camada de bloqueio para usuários deslogados */}
      <AuthLock />
      
      {!profileData ? (
        // Substituímos o <Loading /> quebrado por este fallback visual
        <div className="pt-40 text-center font-black italic text-zinc-800 uppercase tracking-[0.5em] animate-pulse">
          Carregando Arquivos...
        </div>
      ) : (
        <ProfileView 
          data={profileData} 
          isOwnProfile={true} 
          onTeamDeleted={handleTeamDeleted} 
        />
      )}
    </>
  );
}