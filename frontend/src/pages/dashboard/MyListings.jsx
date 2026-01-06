import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import axios from 'axios';

const MyListings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Toutes');
    const [searchQuery, setSearchQuery] = useState("");
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Récupération des données du Backend au chargement
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // Appel vers ton API NestJS (prefixée par /api)
            const response = await axios.get('http://localhost:3000/api/properties', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setListings(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des biens:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fonction pour supprimer un bien
    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/properties/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setListings(listings.filter(item => item.id !== id));
                alert("Annonce supprimée avec succès.");
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer ce bien.");
            }
        }
    };

    // Filtrage des annonces selon l'onglet et la recherche
    const filteredListings = listings.filter(item => {
        const matchesTab = activeTab === 'Toutes' || item.statut === activeTab;
        const matchesSearch = item.titre?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
            <Sidebar activePage="listings" />

            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader title="Mes Annonces" />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        
                        {/* BARRE D'OUTILS */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit">
                                {['Toutes', 'Disponible', 'Vendu', 'Loué'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                            activeTab === tab ? 'bg-white text-[#135bec] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">search</span>
                                <input 
                                    type="text" 
                                    placeholder="RECHERCHER UN BIEN..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#135bec] w-full md:w-80 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin size-8 border-4 border-[#135bec] border-t-transparent rounded-full"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredListings.length > 0 ? filteredListings.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group">
                                        {/* Image (placeholder si vide) */}
                                        <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                            <img 
                                                src={item.photos?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400"} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                alt={item.titre}
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{item.titre}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                        item.statut === 'Disponible' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {item.statut}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold flex items-center gap-1 uppercase mb-3">
                                                    <span className="material-symbols-outlined text-sm">location_on</span> {item.adresse}
                                                </p>
                                                
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <span className="material-symbols-outlined text-lg">square_foot</span>
                                                        <span className="text-[10px] font-black uppercase">{item.superficie} m²</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <span className="material-symbols-outlined text-lg">meeting_room</span>
                                                        <span className="text-[10px] font-black uppercase">{item.nombrePieces} Pièces</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 md:mt-0 flex items-center justify-between">
                                                <p className="text-[#135bec] text-xl font-black italic">{item.prix.toLocaleString()} €</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => navigate(`/dashboard/edit/${item.id}`)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-[#135bec] hover:bg-blue-50 transition-all">
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Aucun bien trouvé</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyListings;