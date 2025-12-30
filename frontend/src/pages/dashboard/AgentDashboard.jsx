import React, { useState } from 'react'; 
import { Link } from "react-router-dom"; 
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';

// --- COMPOSANT DE MODIFICATION ---
const EditModal = ({ listing, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...listing });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, img: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-slate-900">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-sm font-black uppercase tracking-widest">Modifier l'annonce</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Image principale</label>
                        <div className="relative group h-40 w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-[#135bec] transition-all">
                            <img src={formData.img} alt="Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-white mb-1">upload</span>
                                <span className="text-white text-[9px] font-black uppercase tracking-widest">Changer la photo</span>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Nom du bien</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                               className="w-full h-11 px-4 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#135bec]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Prix</label>
                            <input type="text" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                   className="w-full h-11 px-4 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#135bec]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Statut</label>
                            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} 
                                    className="w-full h-11 px-4 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none cursor-pointer">
                                <option>Actif</option>
                                <option>En attente</option>
                                <option>Brouillon</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex gap-3">
                    <button onClick={onClose} className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-gray-200 transition-all">Annuler</button>
                    <button onClick={() => onSave(formData)} className="flex-1 h-11 bg-[#135bec] rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

const AgentDashboard = () => {
  // --- ÉTATS DYNAMIQUES AVEC DONNÉES AFRICAINES ---
  const [editingListing, setEditingListing] = useState(null);
  
  const [messages] = useState([
    { id: 1, name: "Mamadou Traoré", msg: "Est-ce que la villa est encore disponible ?", time: "10:42", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
    { id: 2, name: "Awa Diop", msg: "Merci pour la visite de ce matin !", time: "Hier", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop" },
    { id: 3, name: "Koffi Mensah", msg: "Le prix est-il négociable ?", time: "2 jours", img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=200&auto=format&fit=crop" },
    { id: 4, name: "David Level", msg: "Quand êtes-vous disponibles ?", time: "7 jours", img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=100&auto=format&fit=crop" }
  ]);

  const [listings, setListings] = useState([
    { id: 1, name: "Villa des Roses", city: "Abidjan, Cocody", price: "450 000 000 FCFA", status: "Actif", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=200&auto=format&fit=crop" },
    { id: 2, name: "Appartement Plateau", city: "Dakar", price: "120 000 000 FCFA", status: "En attente", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=200&auto=format&fit=crop" }
  ]);

  // --- ACTIONS ---
  const handleUpdate = (updatedItem) => {
    setListings(listings.map(l => l.id === updatedItem.id ? updatedItem : l));
    setEditingListing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous supprimer cette annonce ?")) {
        setListings(listings.filter(l => l.id !== id));
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden relative">
      
      <Sidebar activePage="dashboard" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Tableau de bord" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl flex flex-col gap-8">
            
            {/* Welcome Section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900">Bonjour, Odalric 👋</h1>
                <p className="text-slate-500">Voici un aperçu de vos activités immobilières aujourd'hui.</p>
              </div>
              <Link to="/publishing" className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#135bec] px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Déposer une annonce</span>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Vues totales" value="1,245" icon="visibility" trend="+12% vs. mois dernier" />
              <StatCard title="Annonces actives" value={listings.length} icon="real_estate_agent" subValue="2 en attente" />
              <StatCard title="Messages" value={messages.length} icon="mail" trend="+2 nouveaux" />
              <StatCard title="Favoris" value="12" icon="favorite" trend="+1 cette semaine" />
            </div>

            {/* Chart & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Performance des annonces</h3>
                </div>
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 40">
                    <path d="M0 35 C 10 35, 10 15, 20 15 C 30 15, 30 25, 40 25 C 50 25, 50 5, 60 5 C 70 5, 70 20, 80 20 C 90 20, 90 30, 100 30 V 40 H 0 Z" fill="#135bec" fillOpacity="0.1"></path>
                    <path d="M0 35 C 10 35, 10 15, 20 15 C 30 15, 30 25, 40 25 C 50 25, 50 5, 60 5 C 70 5, 70 20, 80 20 C 90 20, 90 30, 100 30" stroke="#135bec" strokeWidth="1"></path>
                  </svg>
                </div>
              </div>

              {/* MESSAGES RECENTS (Dynamique) */}
              <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Messages récents</h3>
                <div className="flex flex-col gap-4 overflow-y-auto">
                  {messages.map((m) => (
                    <Link key={m.id} to="/messages" className="flex gap-3 items-start border-b border-slate-100 pb-3 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="size-10 rounded-full bg-cover bg-center shrink-0 border border-slate-100" style={{ backgroundImage: `url('${m.img}')` }}></div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-bold text-slate-900 truncate">{m.name}</p>
                          <span className="text-[10px] text-slate-400">{m.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{m.msg}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/messages" className="mt-4 text-center text-xs font-black uppercase tracking-widest text-[#135bec] hover:underline">Voir tout</Link>
              </div>
            </div>

            {/* Table des annonces */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-900">Vos annonces récentes</h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                      <tr>
                        <th className="px-6 py-4">Bien immobilier</th>
                        <th className="px-6 py-4">Prix</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {listings.length > 0 ? listings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <div className="h-12 w-16 rounded bg-cover bg-center border border-slate-100 shadow-sm" style={{ backgroundImage: `url('${item.img}')` }}></div>
                              <div className="flex flex-col">
                                <span className="font-bold">{item.name}</span>
                                <span className="text-xs text-slate-500">{item.city}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-black text-xs">{item.price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.status === 'Actif' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingListing(item)} className="text-slate-400 hover:text-[#135bec] transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Aucune annonce récente</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- MODAL DE MODIFICATION --- */}
      {editingListing && (
        <EditModal 
            listing={editingListing} 
            onSave={handleUpdate} 
            onClose={() => setEditingListing(null)} 
        />
      )}
    </div>
  );
};

export default AgentDashboard;