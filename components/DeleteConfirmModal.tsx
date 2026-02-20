"use client";

export function DeleteConfirmModal({ isOpen, onConfirm, onCancel, loading }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-red-500/20 rounded-32px p-8 max-w-sm w-full text-center space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-red-500 text-2xl font-black italic">!</span>
        </div>
        
        <div>
          <h3 className="text-white font-black uppercase italic text-lg tracking-tighter">Apagar Relatório?</h3>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-2">Esta ação é permanente no banco de dados.</p>
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