import React, { useState } from 'react';

export const DashboardHeader = ({ title = "Tableau de bord" }) => {
  // 2. État pour gérer l'ouverture du menu
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <input 
            className="h-10 w-64 rounded-lg border-none bg-slate-100 px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-[#135bec]" 
            placeholder="Rechercher..." 
            type="text"
          />
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400">search</span>
        </div>
        
        {/* 3. Conteneur relatif pour positionner le menu par rapport au bouton */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`flex size-10 items-center justify-center rounded-lg text-slate-900 transition-colors ${
                isNotificationsOpen ? 'bg-slate-200' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* 4. Le bloc de notifications (Dropdown) */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Notifications</span>
                <span className="text-xs text-[#135bec] cursor-pointer hover:underline">Tout marquer comme lu</span>
              </div>
              
              <div className="max-height-[400px] overflow-y-auto">
                {/* Exemple d'une notification */}
                <div className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                  <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-600 text-sm">person_add</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-800"><span className="font-medium">Mohamed</span> a rejoint votre équipe.</p>
                    <p className="text-xs text-slate-400 mt-1">Il y a 5 min</p>
                  </div>
                </div>
                <div className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                  <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-600 text-sm">person_add</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-800"><span className="font-medium">Briwel</span> a rejoint votre équipe.</p>
                    <p className="text-xs text-slate-400 mt-1">Il y a 7 jours</p>
                  </div>
                </div>
              </div>

              <div className="p-3 text-center border-t border-slate-100">
                <button className="text-sm text-slate-500 hover:text-slate-900 cursor-pointer">Voir tout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};