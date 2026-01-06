import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import axios from 'axios';

const Settings = () => {
  const [profile, setProfile] = useState({ nom: '', prenom: '', telephone: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch {
        console.error("Impossible de charger le profil");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/users/update', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profil mis à jour avec succès !");
    } catch {
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f6f8]">
      <Sidebar activePage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Mon Compte" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8">Informations personnelles</h3>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom</label>
                        <input value={profile.nom} onChange={(e)=>setProfile({...profile, nom: e.target.value})} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prénom</label>
                        <input value={profile.prenom} onChange={(e)=>setProfile({...profile, prenom: e.target.value})} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</label>
                    <input value={profile.telephone} onChange={(e)=>setProfile({...profile, telephone: e.target.value})} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold" />
                </div>
                <button onClick={handleUpdate} disabled={loading} className="w-full h-12 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800">
                    {loading ? "Sauvegarde..." : "Enregistrer les modifications"}
                </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;