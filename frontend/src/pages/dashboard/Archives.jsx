import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import axios from 'axios';

const Archives = () => {
  const [archivedListings, setArchivedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/properties/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // On ne garde que les biens vendus ou loués
        const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
        const archived = response.data.filter(item => ['vendu','loue'].includes(normalize(item.statut)));
        setArchivedListings(archived);
      } catch (error) {
        console.error("Erreur archives:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, []);

  return (
    <div className="flex h-screen bg-[#f6f6f8]">
      <Sidebar activePage="archives" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Archives des Ventes" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4">Bien</th>
                  <th className="px-6 py-4">Prix de Vente</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {archivedListings.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50">
                    <td className="px-6 py-4 font-bold">{item.titre}</td>
                    <td className="px-6 py-4 font-black text-[#135bec]">{parseFloat(item.prix).toLocaleString()} €</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                       {new Date(item.updatedAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {archivedListings.length === 0 && !loading && (
              <p className="p-10 text-center text-slate-400 italic">Aucune archive disponible.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Archives;