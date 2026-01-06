import React, { useState, useEffect } from 'react'; 
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import axios from 'axios';

const AgentDashboard = () => {
    const [stats, setStats] = useState({ totalProperties: 0, soldProperties: 0, pendingMessages: 0 });
    const [recentListings, setRecentListings] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [statsRes, propertiesRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/properties/my-stats', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:3000/api/properties/recent', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setRecentListings(propertiesRes.data);
            } catch (error) {
                console.error("Erreur de chargement du dashboard", error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
            <Sidebar activePage="dashboard" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title="Vue d'ensemble" />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Annonces Actives" value={stats.totalProperties} icon="home" />
                            <StatCard title="Biens Vendus" value={stats.soldProperties} icon="sell" />
                            <StatCard title="Messages" value={stats.pendingMessages} icon="chat" />
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Annonces Récentes</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            <th className="pb-4">Bien</th>
                                            <th className="pb-4">Prix</th>
                                            <th className="pb-4">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-sm">
                                        {recentListings.map(item => (
                                            <tr key={item.id} className="group">
                                                <td className="py-4 font-bold">{item.titre}</td>
                                                <td className="py-4 font-black text-[#135bec]">{item.prix} €</td>
                                                <td className="py-4">
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                                                        {item.statut}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AgentDashboard;