import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; 
import Immeuble from '../../assets/immeuble.jpeg';

export const Sidebar = () => {
    const { user } = useUser(); 
    const [isAssetsOpen, setIsAssetsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Garde l'accordéon ouvert si on est sur une page liée aux annonces
    const isInsideAssets = location.pathname.includes('/annonces') || 
                           location.pathname.includes('/publishing') ||
                           location.pathname.includes('/dashboard/edit');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // --- LOGIQUE DE L'URL DE PHOTO ---
    const getPhotoUrl = () => {
        if (!user?.photo) return null;
        
        // Si la photo est une URL externe (ex: Google)
        if (user.photo.startsWith('http')) {
            return user.photo;
        }
        
        // Si c'est un fichier stocké localement sur votre serveur NestJS
        // Note: On utilise le port 3000 et le dossier /uploads/ configuré dans main.ts
        return `http://localhost:3000/uploads/${user.photo}`;
    };

    return (
        <aside className="hidden w-72 flex-col border-r border-slate-100 bg-white lg:flex h-screen sticky top-0 px-6 py-8">

            {/* Logo Section */}
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#135bec] text-white shadow-xl shadow-blue-500/20">
                    <span className="material-symbols-outlined font-bold">apartment</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                        IMMO<span className="text-[#135bec]">PLATFORM</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Espace Agent</p>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <nav className="flex flex-col gap-1">
                    <div className="mb-2 px-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">Menu Principal</p>
                    </div>

                    <NavItem to="/dashboard" icon="grid_view" label="Vue d'ensemble" />

                    {/* --- MENU DÉROULANT : GESTION --- */}
                    <div className="mt-2">
                        <button
                            onClick={() => setIsAssetsOpen(!isAssetsOpen)}
                            className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${isAssetsOpen || isInsideAssets ? 'text-[#135bec] bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: (isAssetsOpen || isInsideAssets) ? "'FILL' 1" : "'FILL' 0" }}>home_work</span>
                            <span className="text-sm font-bold flex-1 text-left tracking-tight">Gestion Immobilière</span>
                            <span className={`material-symbols-outlined transition-transform duration-300 text-slate-400 ${isAssetsOpen || isInsideAssets ? 'rotate-180' : ''}`}>
                                keyboard_arrow_down
                            </span>
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${(isAssetsOpen || isInsideAssets) ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <div className="ml-6 flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                                <SubNavItem to="/annonces" label="Toutes mes annonces" icon="format_list_bulleted" />
                                <SubNavItem to="/publishing" label="Publier un bien" icon="add_box" />
                                <SubNavItem to="/archives" label="Ventes archivées" icon="inventory_2" />
                            </div>
                        </div>
                    </div>

                    <NavItem to="/favoris" icon="favorite" label="Mes Favoris" />
                    <NavItem to="/parametres" icon="settings" label="Paramètres" />
                </nav>

                {/* Profil Section Bas de Sidebar */}
                <div className="mt-auto border-t border-slate-100 pt-8">
                    <div className="flex mb-4 items-center gap-3 rounded-[24px] bg-slate-50 p-4 border border-slate-100">
                        {/* Avatar Dynamique corrigé */}
                        <div
                            className="size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm flex items-center justify-center text-[#135bec] font-black text-xs overflow-hidden"
                            style={user?.photo ? { backgroundImage: `url(${getPhotoUrl()})` } : {}}
                        >
                            {!user?.photo && user?.prenom?.charAt(0)}
                        </div>
                        
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-xs font-black text-slate-900">
                                {user ? `${user.prenom} ${user.nom}` : "Chargement..."}
                            </span>
                            <span className="truncate text-[10px] font-bold text-[#135bec] uppercase tracking-wider">
                                {user?.role || "Agent Premium"}
                            </span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout} 
                        className="flex w-full items-center gap-3 rounded-2xl p-4 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all duration-300 mb-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-black uppercase tracking-widest text-[10px]">Déconnexion</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

function NavItem({ to, icon, label, badge }) {
    return (
        <NavLink
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) => `flex w-full items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 ${isActive
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 font-bold'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
        >
            <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
                <span className="text-sm font-bold tracking-tight">{label}</span>
            </div>
            {badge && (
                <span className="bg-[#135bec] text-white text-[10px] font-black px-2 py-1 rounded-lg">{badge}</span>
            )}
        </NavLink>
    );
}

function SubNavItem({ to, label, icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs transition-all duration-300 ${isActive ? 'text-[#135bec] font-black bg-blue-50' : 'text-slate-400 hover:text-slate-900'
                }`}
        >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            <span className="font-bold">{label}</span>
        </NavLink>
    );
}