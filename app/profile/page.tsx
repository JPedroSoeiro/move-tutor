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

  return (
    <>
      <AuthLock />
      
      {!profileData ? (
        <div className="pt-40 text-center font-black italic text-zinc-800 uppercase tracking-[0.5em]">
          Carregando Arquivos...
        </div>
      ) : (
        <ProfileView data={profileData} isOwnProfile={true} />
      )}
    </>
  );
}