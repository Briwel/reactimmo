import React, { useState } from 'react';
import { Link } from "react-router-dom";

export default function NavbarResults() {

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const notifications = [
  ];

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsNotifOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2 group" to="/">
              <div className="size-8 bg-black rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined !text-[20px]">apartment</span>
              </div>
              <h2 className="text-gray-900 text-lg font-bold tracking-tight">ImmoPlateform</h2>
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" 
                placeholder="Rechercher une ville" 
                type="text"
              />
            </div>
          </div>

          {/* Navigation (desktop) 
          <div className="hidden xl:flex items-center gap-6">
            <a className="text-gray-900 text-sm font-medium hover:text-black" href="#">Acheter</a>
            <a className="text-gray-600 text-sm font-medium hover:text-black" href="#">Louer</a>
            <a className="text-gray-600 text-sm font-medium hover:text-black" href="#">Vendre</a>
          </div> */}

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center">
            <button
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setIsMenuOpen((s) => !s)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">

            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`flex items-center justify-center p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black'}`}
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Menu Déroulant */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] overflow-hidden">
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Activités récentes</p>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 flex gap-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors">
                        <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <span translate="no" className="material-symbols-outlined text-red-500 text-sm">{notif.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900">{notif.text}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{notif.detail}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="#" className="block p-3 text-center text-xs font-medium text-gray-600 hover:bg-gray-50 border-t border-gray-100">
                    Voir toutes les alertes
                  </Link>
                </div>
              )}
            </div>

            <Link to="/Login" className="flex items-center justify-center h-9 px-4 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
              Se connecter
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-3">
              <input className="block w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 sm:text-sm" placeholder="Rechercher une ville" type="text" />
              {/* <nav className="flex flex-col gap-2">
                <a className="px-3 py-2 rounded-md text-gray-900 font-medium hover:bg-gray-50" href="#">Acheter</a>
                <a className="px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-50" href="#">Louer</a>
                <a className="px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-50" href="#">Vendre</a>
              </nav> */}
              <div className="pt-2 flex gap-2">
                <Link to="/Login" className="flex-1 text-center px-4 py-2 rounded-lg border bg-white text-gray-900 font-medium">Se connecter</Link>
                <Link to="/login?mode=signup" className="flex-1 text-center px-4 py-2 rounded-lg bg-black text-white font-bold">S'inscrire</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}