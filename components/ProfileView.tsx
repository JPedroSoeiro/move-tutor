"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { teamService } from "@/services/teamService";
import { TeamCard } from "@/components/TeamCard";
import { TeamModal } from "@/components/TeamModal"; // Certifique-se de criar este arquivo

export function ProfileView({ data, isOwnProfile, onTeamDeleted }: any) {
  const { data: session } = useSession();
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setTeamToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;

    setIsDeleting(true);
    try {
      await teamService.deleteTeam(teamToDelete);

      // O uso do '?.' evita o erro caso a função não seja passada via props
      onTeamDeleted?.(teamToDelete);

      setIsDeleteModalOpen(false);
      setTeamToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 px-4 pb-20">
      {/* Header Estilo Instagram */}
      <div className="flex items-center gap-10 mb-12 border-b border-white/5 pb-12 pt-1">
        <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-black border-4 border-white/10 shadow-2xl text-white italic shrink-0">
          {(data.username || "T").substring(0, 2).toUpperCase()}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">
            {data.username}
          </h2>
          <div className="flex gap-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <strong className="text-white text-lg">{data.count}</strong> Times Criados
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">
              Mestre Pokémon
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Cards - Reutilizando o componente TeamCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.teams?.map((team: any) => (
          <TeamCard
            key={team.id}
            team={team}
            isOwnProfile={isOwnProfile}
            onDelete={handleDeleteClick}
            onSelect={setSelectedTeam}
          />
        ))}
      </div>

      {/* Modal de Confirmação de Deleção */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        loading={isDeleting}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Modal Detalhado (Componentizado para limpeza do código) */}
      {selectedTeam && (
        <TeamModal 
          team={selectedTeam} 
          onClose={() => setSelectedTeam(null)} 
        />
      )}
    </div>
  );
}

// Componente Interno de Confirmação (Pode ser movido para um arquivo próprio depois)
function DeleteConfirmModal({ isOpen, onConfirm, onCancel, loading }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-200 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-red-500/20 rounded-32px p-8 max-w-sm w-full text-center space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-500 text-2xl font-black italic">
          !
        </div>
        <div>
          <h3 className="text-white font-black uppercase italic text-lg tracking-tighter">
            Apagar Relatório?
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-2">
            Esta ação é permanente.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 text-[9px] font-black uppercase rounded-xl transition-all"
          >
            Abortar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            {loading ? "Apagando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}