import React, { useEffect, useState } from 'react'; 
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { useNavigate } from 'react-router-dom'; // Ajout pour la redirection
import { useUser } from '../../context/UserContext';
import { useAgentListings } from '../../hooks/useAgentListings';
import axios from 'axios';

const AgentDashboard = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [notifError, setNotifError] = useState(null);
    const [notifLoading, setNotifLoading] = useState(false);
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientOps, setClientOps] = useState([]);
    const [clientLoading, setClientLoading] = useState(false);
    const [clientError, setClientError] = useState(null);

    // Hook de synchronisation temps réel + initial fetch
    const { listings, loading } = useAgentListings();

    // Redirection si pas d'utilisateur et le contexte a fini de charger
    useEffect(() => {
        if (!user && !userLoading) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    useEffect(() => {
        const fetchOps = async () => {
            if (!user?.id) return;
            setNotifLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:3000/api/operations/agent/me?pending=true`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setNotifications(res.data || []);
            } catch (err) {
                setNotifError(err?.response?.data?.message || err.message || 'Impossible de charger les opérations');
            } finally {
                setNotifLoading(false);
            }
        };
        fetchOps();
        const interval = setInterval(fetchOps, 12000);
        return () => clearInterval(interval);
    }, [user]);

    const confirmOperation = async (operationId, typeOperation) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/api/operations/${operationId}/confirmer`, {
                typeOperation,
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setNotifications((prev) => prev.filter((op) => op.id !== operationId));
        } catch (err) {
            setNotifError(err?.response?.data?.message || err.message || 'Erreur de confirmation');
        }
    };

    const viewClient = async (client) => {
        if (!client?.id) return;
        setClientLoading(true);
        setClientError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/api/operations/client/${client.id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setClientOps(res.data || []);
            setSelectedClient(client);
            setClientModalOpen(true);
        } catch (err) {
            setClientError(err?.response?.data?.message || err.message || 'Impossible de récupérer l\'historique du client');
        } finally {
            setClientLoading(false);
        }
    };

    // --- CALCUL DES STATISTIQUES RÉELLES (Maintenant uniques à l'agent) ---
    const totalProperties = (listings || []).length;
    const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const soldProperties = (listings || []).filter(item => ['vendu','loue'].includes(normalize(item.statut))).length;
    
    const totalValue = (listings || []).reduce((acc, item) => acc + (parseFloat(item.prix) || 0), 0);

    // Tri par date pour les récentes
    const recentListings = [...listings]
        .sort((a, b) => new Date(b.id) - new Date(a.id)) // Utilise createdAt si disponible
        .slice(0, 5);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f6f6f8]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#135bec] border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-center font-black uppercase tracking-widest text-slate-400">
                        Synchronisation de votre espace...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f6f6f8]">
            <Sidebar activePage="dashboard" />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header avec le nom de l'agent connecté */}
                <DashboardHeader title={`Espace de ${user?.prenom || 'Agent'}`} />
                
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        
                        {/* --- CARTES DE STATISTIQUES --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                title="Vos Annonces" 
                                value={totalProperties} 
                                icon="home_work" 
                                color="text-[#135bec]"
                            />
                            <StatCard 
                                title="Transactions" 
                                value={soldProperties} 
                                icon="verified" 
                                color="text-emerald-500"
                            />
                            <StatCard 
                                title="Valeur de votre Parc" 
                                value={`${totalValue.toLocaleString()} €`} 
                                icon="payments" 
                                color="text-amber-500"
                            />
                        </div>

                        {/* --- TABLEAU DES DERNIÈRES ANNONCES --- */}
                        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Vos publications récentes</h3>
                                <button 
                                    onClick={() => navigate('/annonces')}
                                    className="text-[10px] font-black uppercase tracking-widest text-[#135bec] bg-blue-50 px-4 py-2 rounded-full hover:bg-[#135bec] hover:text-white transition-all">
                                    Gérer mon catalogue
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                                            <th className="pb-4">Bien</th>
                                            <th className="pb-4">Prix</th>
                                            <th className="pb-4">Statut</th>
                                            <th className="pb-4 text-right">Contrat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recentListings.length > 0 ? (
                                            recentListings.map((item) => (
                                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                                                                {item.photos?.[0] ? (
                                                                    <img 
                                                                        src={`http://localhost:3000/uploads/${item.photos[0].url}`} 
                                                                        className="w-full h-full object-cover"
                                                                        alt={item.titre}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                        <span className="material-symbols-outlined">image</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-700">{item.titre}</span>
                                                                <span className="text-[10px] text-slate-400 uppercase font-medium">{item.type}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 font-black text-slate-900 text-lg">
                                                        {parseFloat(item.prix).toLocaleString()} €
                                                    </td>
                                                    <td className="py-5">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                                            item.statut?.toLowerCase() === 'vendu' 
                                                            ? 'bg-red-50 text-red-600' 
                                                            : 'bg-emerald-50 text-emerald-600'
                                                        }`}>
                                                            {item.statut || 'Disponible'}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        {item.client ? (
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] font-bold text-slate-600">{item.client.nom}</span>
                                                                <span className="text-[9px] text-slate-400">Client lié</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg">Aucun acquéreur</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-20 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="material-symbols-outlined text-slate-200 text-5xl">folder_open</span>
                                                        <p className="text-slate-400 font-bold italic">Vous n'avez pas encore publié d'annonces.</p>
                                                        <button 
                                                            onClick={() => navigate('/publishing')}
                                                            className="mt-4 bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase">Publier un bien
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Notifications opérations */}
                        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Nouvelles opérations (réservations)</h3>
                                {notifLoading && <span className="text-xs text-slate-400">Chargement...</span>}
                            </div>
                            {notifError && <div className="text-sm text-red-600 mb-2">{notifError}</div>}
                            {notifications.length === 0 ? (
                                <p className="text-sm text-slate-500">Aucune opération en attente.</p>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map((op) => (
                                        <div key={op.id} className="flex items-center justify-between border border-slate-100 rounded-2xl p-3">
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">Bien #{op.propriete?.id} - {op.propriete?.titre}</div>
                                                <div className="text-xs text-slate-500">
                                                    Client: {op.client?.prenom} {op.client?.nom} — {op.client?.email}
                                                </div>
                                                <div className="text-xs text-slate-500">Montant proposé: {Number(op.montantFinal).toLocaleString()} €</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => confirmOperation(op.id, 'vente')}
                                                    className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold uppercase hover:bg-red-100"
                                                >
                                                    Vendre
                                                </button>
                                                <button
                                                    onClick={() => confirmOperation(op.id, 'location')}
                                                    className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold uppercase hover:bg-amber-100"
                                                >
                                                    Louer
                                                </button>
                                                <button
                                                    onClick={() => viewClient(op.client)}
                                                    className="px-3 py-2 rounded-lg bg-slate-50 text-slate-700 text-xs font-bold uppercase hover:bg-slate-100"
                                                >
                                                    Voir client
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </main>

                {/* Client modal */}
                {clientModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold">Historique - {selectedClient?.prenom} {selectedClient?.nom}</h4>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { navigator.clipboard?.writeText(selectedClient?.telephone || ''); }} className="text-xs px-2 py-1 border rounded">Copier tél</button>
                                    <button onClick={() => { window.location.href = `mailto:${selectedClient?.email}`; }} className="text-xs px-3 py-1 bg-slate-100 rounded">Email</button>
                                    <button onClick={() => setClientModalOpen(false)} className="text-xs px-3 py-1 bg-slate-100 rounded">Fermer</button>
                                </div>
                            </div>

                            {clientLoading && <div className="text-sm text-slate-500">Chargement...</div>}
                            {clientError && <div className="text-sm text-red-600">{clientError}</div>}

                            {!clientLoading && clientOps.length === 0 && (
                                <div className="text-sm text-slate-500">Aucun historique trouvé pour ce client.</div>
                            )}

                            {!clientLoading && clientOps.length > 0 && (
                                <div className="space-y-3">
                                    {clientOps.map((op) => (
                                        <div key={op.id} className="border rounded p-3">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-bold text-sm">{op.propriete?.titre || '—'}</div>
                                                    <div className="text-xs text-slate-500">Type: {op.type}</div>
                                                    <div className="text-xs text-slate-500">Statut: {op.statut}</div>
                                                </div>
                                                <div className="text-right text-xs">
                                                    <div>{op.montantFinal ? Number(op.montantFinal).toLocaleString() + ' €' : '—'}</div>
                                                    <div className="text-slate-400">{op.createdAt ? new Date(op.createdAt).toLocaleString() : ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;