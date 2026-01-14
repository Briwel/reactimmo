import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import axios from 'axios';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        // On récupère les biens. Plus tard, tu pourras filtrer par /api/favorites
        const response = await axios.get('http://localhost:3000/api/properties/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Simulation : on affiche les biens comme étant en favoris
        setFavorites(response.data);
      } catch (error) {
        console.error("Erreur favoris:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="flex h-screen bg-[#f6f6f8]">
      <Sidebar activePage="favorites" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Mes Favoris" />
        <main className="flex-1 overflow-y-auto p-8">
          
          {loading ? (
            <div className="py-20 text-center font-black uppercase tracking-widest text-slate-300 animate-pulse">
              Chargement de vos coups de cœur...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((property) => (
                <div 
                  key={property.id} 
                  onClick={() => setSelectedProperty(property)}
                  className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 cursor-pointer"
                >
                  {/* Image du bien */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.photos?.[0] ? `http://localhost:3000/uploads/${property.photos[0].url}` : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={property.titre}
                    />
                    <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                      {property.type}
                    </div>
                    <button className="absolute top-4 right-4 size-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-lg">
                      <span className="material-symbols-outlined fill-1">favorite</span>
                    </button>
                  </div>

                  {/* Infos du bien */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-black text-slate-900 truncate">{property.titre}</h4>
                        <span className="text-[#135bec] font-black">{parseFloat(property.prix).toLocaleString()} €</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold mb-4 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {property.adresse}
                    </p>
                    
                    <div className="flex gap-4 py-4 border-t border-slate-50">
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">square_foot</span>
                            {property.superficie || '--'} m²
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">bed</span>
                            {property.nombrePieces || '--'} p.
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && favorites.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">heart_broken</span>
                <p className="font-bold italic text-sm tracking-widest uppercase">Aucun favori trouvé</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal de détail simplifiée */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedProperty(null)}>
          <div className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black mb-2">{selectedProperty.titre}</h3>
            <p className="text-slate-400 text-sm mb-6">{selectedProperty.description || "Aucune description fournie."}</p>
            
            <div className="bg-slate-50 p-6 rounded-3xl mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Prix</span>
                    <span className="font-black text-[#135bec]">{parseFloat(selectedProperty.prix).toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Contrat</span>
                    <span className="text-[10px] font-black uppercase text-emerald-500">
                        {selectedProperty.contrat ? 'Disponible immédiatement' : 'En attente'}
                    </span>
                </div>
            </div>

            <button 
                onClick={() => setSelectedProperty(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFavorites;