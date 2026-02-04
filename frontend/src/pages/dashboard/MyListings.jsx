import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import axios from 'axios';

const MyListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Tous'); 
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);

    const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/properties/mine', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setListings(response.data);
        } catch (error) {
            console.error("Erreur de chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer définitivement cette annonce et son contrat ?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/properties/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setListings(listings.filter(item => item.id !== id));
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
            }
        }
    };

    const handleConfirm = async (propertyId, typeOperation) => {
        setActionError(null);
        setActionSuccess(null);
        try {
            const pendingRes = await axios.get(`http://localhost:3000/api/operations/property/${propertyId}`);
            const pending = (pendingRes.data || []).find(op => op.statut === 'en_attente');
            if (!pending) {
                setActionError("Aucune opération en attente pour ce bien.");
                return;
            }
            await axios.patch(`http://localhost:3000/api/operations/${pending.id}/confirmer`, {
                typeOperation,
            });
            setActionSuccess('Opération confirmée.');
            // rafraîchir la liste
            fetchProperties();
        } catch (err) {
            setActionError(err?.response?.data?.message || err.message || 'Erreur lors de la confirmation');
        }
    };

    const filteredListings = listings.filter(item => {
        if (filter === 'Tous') return true;
        const norm = normalize(item.statut);
        return norm === normalize(filter);
    });

    return (
        <div className="flex h-screen bg-[#f6f6f8]">
            <Sidebar activePage="listings" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title="Mes Annonces" />
                
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Barre d'outils et Filtres */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                                {['Tous', 'Disponible', 'Vendu', 'Loué'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilter(tab)}
                                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            filter === tab ? 'bg-[#135bec] text-white' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/publishing')}
                                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-slate-800 transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Nouveau Bien
                            </button>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Chargement de vos biens...</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {actionError && <div className="text-sm text-red-600">{actionError}</div>}
                                {actionSuccess && <div className="text-sm text-emerald-600">{actionSuccess}</div>}
                                {filteredListings.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                                        {/* Miniature */}
                                        <div className="size-24 rounded-[24px] bg-slate-100 overflow-hidden shrink-0">
                                            <img 
                                                src={item.photos?.[0] ? `http://localhost:3000/uploads/${item.photos[0].url}` : 'https://via.placeholder.com/150'} 
                                                className="w-full h-full object-cover"
                                                alt={item.titre}
                                            />
                                        </div>

                                        {/* Infos */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`size-2 rounded-full ${item.statut?.toLowerCase() === 'vendu' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.titre}</h4>
                                            </div>
                                            <p className="text-slate-400 text-xs font-bold mb-2">{item.adresse}</p>
                                            
                                            {/* Badge Contrat */}
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.contrat ? 'bg-blue-50 text-[#135bec]' : 'bg-amber-50 text-amber-600'}`}>
                                                    <span className="material-symbols-outlined text-[12px]">{item.contrat ? 'description' : 'warning'}</span>
                                                    {item.contrat ? 'Contrat Prêt' : 'Pas de contrat'}
                                                </div>
                                                <span className="text-slate-300 text-[10px]">|</span>
                                                <span className="text-[#135bec] font-black text-sm">{parseFloat(item.prix).toLocaleString()} €</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pr-4">
                                            <button 
                                                onClick={() => navigate(`/dashboard/edit/${item.id}`)}
                                                className="size-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-[#135bec] hover:bg-blue-50 transition-all flex items-center justify-center"
                                                title="Modifier"
                                            >
                                                <span className="material-symbols-outlined">edit_note</span>
                                            </button>
                                            <button
                                                onClick={() => handleConfirm(item.id, 'vente')}
                                                className="size-12 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center"
                                                title="Vendre"
                                            >
                                                <span className="material-symbols-outlined">sell</span>
                                            </button>
                                            <button
                                                onClick={() => handleConfirm(item.id, 'location')}
                                                className="size-12 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all flex items-center justify-center"
                                                title="Louer"
                                            >
                                                <span className="material-symbols-outlined">key</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="size-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center"
                                                title="Supprimer"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {filteredListings.length === 0 && (
                                    <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Aucune annonce dans cette catégorie</p>
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