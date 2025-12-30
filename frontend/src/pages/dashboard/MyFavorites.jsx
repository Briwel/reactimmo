import React, { useState } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

const MyFavorites = () => {
  const [sortBy, setSortBy] = useState("Plus récents");
  const [selectedProperty, setSelectedProperty] = useState(null); // État pour le bien sélectionné

  const favoriteProperties = [
    {
      id: 1,
      name: "Villa des Roses",
      price: "450 000 €",
      address: "12 Rue des Fleurs, Lyon",
      beds: 4,
      baths: 2,
      surface: "180 m²",
      status: "En vente",
      statusColor: "bg-emerald-500",
      description: "Une magnifique villa lumineuse avec un grand jardin fleuri, idéale pour une famille cherchant le calme en ville.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Appartement T3 Centre",
      price: "320 000 €",
      address: "45 Av. Jean Jaurès, Paris",
      beds: 2,
      baths: 1,
      surface: "65 m²",
      status: "Option posée",
      statusColor: "bg-amber-500",
      description: "Appartement moderne entièrement rénové au cœur du centre-ville. Proche de toutes commodités et transports.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Studio Gare",
      price: "110 000 €",
      address: "8 Impasse du Train, Lille",
      beds: 1,
      baths: 1,
      surface: "28 m²",
      status: "Nouveau",
      statusColor: "bg-emerald-500",
      description: "Parfait pour un investissement locatif ou un étudiant. Studio optimisé à 2 minutes de la gare centrale.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Maison de Campagne",
      price: "210 000 €",
      address: "Route de la Forêt, Bordeaux",
      beds: 3,
      baths: 1,
      surface: "110 m²",
      status: "Vendu",
      statusColor: "bg-slate-500",
      isSold: true,
      description: "Maison de charme en pierre avec un immense terrain boisé. Vendue récemment.",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=500&auto=format&fit=crop"
    }
  ];

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden relative">
      <Sidebar activePage="favorites" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Mes favoris" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl flex flex-col gap-8">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black uppercase tracking-tight">Propriétés sauvegardées</h1>
                <p className="text-slate-500 text-sm">Cliquez sur un bien pour voir les détails.</p>
              </div>
              <div className="flex gap-3">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 rounded-lg border-slate-200 bg-white pl-4 pr-10 text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm outline-none"
                >
                  <option>Plus récents</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteProperties.map((property) => (
                <FavoriteCard 
                  key={property.id} 
                  property={property} 
                  onViewDetails={() => setSelectedProperty(property)} 
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL DE DÉTAILS --- */}
      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
};

const FavoriteCard = ({ property, onViewDetails }) => (
  <div 
    onClick={onViewDetails}
    className="group cursor-pointer relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
  >
    <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url('${property.image}')` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
      
      <span className={`absolute top-3 left-3 rounded-md ${property.statusColor} px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm`}>
        {property.status}
      </span>

      <button onClick={(e) => { e.stopPropagation(); alert("Retiré des favoris"); }} className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:scale-110 active:scale-95">
        <span className="material-symbols-outlined fill text-[20px]">favorite</span>
      </button>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight truncate">
            {property.name}
          </h3>
          <span className={`text-lg font-black shrink-0 ${property.isSold ? 'text-slate-400 line-through decoration-red-500' : 'text-primary'}`}>
            {property.price}
          </span>
        </div>
        <p className="text-sm text-slate-500">{property.address}</p>
      </div>

      <div className="flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-bold text-slate-600">
        <Feature icon="bed" value={property.beds} />
        <Feature icon="bathtub" value={property.baths} />
        <Feature icon="square_foot" value={property.surface} />
      </div>

      <div className="mt-5 flex gap-2">
        <button className="flex-1 rounded-lg bg-slate-100 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-200">
          Détails
        </button>
        {!property.isSold && (
          <button onClick={(e) => e.stopPropagation()} className="flex-1 rounded-lg bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:bg-blue-600">
            Contacter
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- NOUVEAU COMPOSANT : MODAL DE DÉTAILS ---
const PropertyModal = ({ property, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      
      {/* Bouton Fermer */}
      <button onClick={onClose} className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-all">
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Image Modal */}
      <div className="h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${property.image}')` }}></div>

      {/* Contenu Modal */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded ${property.statusColor} text-white`}>
              {property.status}
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight mt-3">{property.name}</h2>
            <p className="text-slate-500 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-sm">location_on</span> {property.address}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{property.price}</p>
            <p className="text-xs font-bold text-slate-400 uppercase">Honoraires inclus</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 my-6">
          <Feature icon="bed" value={`${property.beds} Chambres`} vertical />
          <Feature icon="bathtub" value={`${property.baths} Salles d'eau`} vertical />
          <Feature icon="square_foot" value={`${property.surface} de surface`} vertical />
        </div>

        <div className="mb-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description du bien</h4>
          <p className="text-slate-600 leading-relaxed text-sm">{property.description}</p>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 rounded-xl bg-slate-900 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all">
            Prendre rendez-vous
          </button>
          <button className="flex-1 rounded-xl bg-primary py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all">
            Envoyer un message
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Feature = ({ icon, value, vertical = false }) => (
  <div className={`flex ${vertical ? 'flex-col items-center gap-1' : 'items-center gap-1.5'}`}>
    <span className="material-symbols-outlined text-slate-400 text-[18px]">{icon}</span>
    <span className="font-bold text-slate-700">{value}</span>
  </div>
);

export default MyFavorites;