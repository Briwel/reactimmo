import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Immeuble from '../../assets/immeuble.jpeg'

export const Sidebar = () => {
    const [isAssetsOpen, setIsAssetsOpen] = useState(false);
    const location = useLocation();

    // Garde l'accordéon ouvert si on est sur une page liée aux annonces
    const isInsideAssets = location.pathname.includes('/annonces');

    return (
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex h-screen sticky top-0 px-4 py-6">

            {/* Logo Section */}
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#135bec] text-white shadow-lg shadow-blue-500/20">
                    <span className="material-symbols-outlined">apartment</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-black tracking-tight text-slate-900">ImmoPlateform</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Espace Agent</p>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <nav className="flex flex-col gap-1">

                    <div className="mb-2 px-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Menu</p>
                    </div>

                    <NavItem to="/dashboard" icon="dashboard" label="Vue d'ensemble" />

                    {/* --- MENU DÉROULANT : MES PROPRIÉTÉS --- */}
                    <div>
                        <button
                            onClick={() => setIsAssetsOpen(!isAssetsOpen)}
                            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${isAssetsOpen || isInsideAssets ? 'text-[#135bec] bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: (isAssetsOpen || isInsideAssets) ? "'FILL' 1" : "'FILL' 0" }}>home_work</span>
                            <span className="text-sm font-semibold flex-1 text-left">Mes Biens</span>
                            <span className={`material-symbols-outlined transition-transform duration-300 ${isAssetsOpen ? 'rotate-180' : ''}`}>
                                keyboard_arrow_down
                            </span>
                        </button>

                        {/* Sous-menu */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAssetsOpen || isInsideAssets ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="ml-6 flex flex-col gap-1 border-l-2 border-slate-100 pl-4 mt-1">
                                <SubNavItem to="/annonces" label="Toutes mes annonces" icon="list" />
                                <SubNavItem to="/publishing" label="Publier un bien" icon="add_circle" />
                                {/*<SubNavItem to="/archives" label="Archives" icon="archive" />*/}
                            </div>
                        </div>
                    </div>

                    <NavItem to="/messages" icon="chat" label="Messages" badge="1" />
                    {/*<NavItem to="/favoris" icon="favorite" label="Favoris" />*/}
                    <NavItem to="/parametres" icon="settings" label="Paramètres" />
                </nav>

                {/* Profil Section Bas de Sidebar */}
                <div className="mt-auto border-t border-slate-100 pt-6">

                    <div className="flex mb-2 items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                        <div
                            className="size-9 rounded-full bg-slate-200 bg-cover bg-center"
                            style={{ backgroundImage: `url(${Immeuble})` }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-xs font-bold text-slate-900">Odalric Fassinou</span>
                            <span className="truncate text-[10px] font-medium text-slate-500">Agent Premium</span>
                        </div>
                    </div>
                    <NavLink to="/login" className="flex bg-slate-50 items-center gap-3 rounded-xl p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors mb-4">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-bold">Déconnexion</span>
                    </NavLink>
                </div>
            </div>
        </aside>
    );
};

/* --- COMPOSANT NAVITEM --- */
function NavItem({ to, icon, label, badge }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all ${isActive
                ? 'bg-blue-50 text-[#135bec] font-bold'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
                <span className="text-sm">{label}</span>
            </div>
            {badge && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>
            )}
        </NavLink>
    );
}

/* --- COMPOSANT SUBNAVITEM --- */
function SubNavItem({ to, label, icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `flex items-center gap-2 py-2 px-2 rounded-lg text-sm transition-colors ${isActive ? 'text-[#135bec] font-bold bg-blue-50/50' : 'text-slate-500 hover:text-slate-900'
                }`}
        >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            {label}
        </NavLink>
    );
}