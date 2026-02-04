import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { useUser } from '../../context/UserContext'; 
import axios from 'axios';

const Settings = () => {
  const { user, refreshUser } = useUser();
  
  const [profile, setProfile] = useState({ 
    nom: '', 
    prenom: '', 
    telephone: '', 
    email: '',
    photo: '' 
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || '',
        email: user.email || '',
        photo: user.photo || ''
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      let photoUrl = profile.photo;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await axios.post('http://localhost:3000/api/users/upload-photo', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        photoUrl = uploadRes.data.filename;
      }

      await axios.put('http://localhost:3000/api/users/update', {
        ...profile,
        photo: photoUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await refreshUser();
      
      alert("Profil mis à jour avec succès ! La Sidebar a été actualisée.");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f6f8]">
      <Sidebar activePage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Paramètres du compte" />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Header Profil */}
            <div className="p-10 border-b border-slate-50 flex flex-col items-center text-center">
                <div className="relative group mb-4">
                    <div className="size-32 rounded-[40px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                        {selectedFile ? (
                            <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" alt="Preview" />
                        ) : profile.photo ? (
                            <img src={`http://localhost:3000/uploads/${profile.photo}`} className="w-full h-full object-cover" alt="Profil" />
                        ) : (
                            <span className="text-4xl font-black text-slate-300">{profile.prenom?.charAt(0)}</span>
                        )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 size-10 bg-[#135bec] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                        <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </label>
                </div>
                <h3 className="text-xl font-black text-slate-900">{profile.prenom} {profile.nom}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{user?.role || 'Agent Immobilier'}</p>
            </div>

            {/* Formulaire */}
            <div className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom</label>
                        <input 
                            value={profile.nom} 
                            onChange={(e)=>setProfile({...profile, nom: e.target.value})} 
                            className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 ring-blue-500/10 outline-none transition-all" 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prénom</label>
                        <input 
                            value={profile.prenom} 
                            onChange={(e)=>setProfile({...profile, prenom: e.target.value})} 
                            className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 ring-blue-500/10 outline-none transition-all" 
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email (non modifiable)</label>
                    <input 
                        value={profile.email} 
                        disabled
                        className="rounded-2xl border border-slate-100 bg-slate-100/50 px-5 py-4 text-sm font-bold text-slate-400 cursor-not-allowed" 
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</label>
                    <input 
                        value={profile.telephone} 
                        onChange={(e)=>setProfile({...profile, telephone: e.target.value})} 
                        className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 ring-blue-500/10 outline-none transition-all" 
                    />
                </div>

                <button 
                    onClick={handleUpdate} 
                    disabled={loading} 
                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all mt-4"
                >
                    {loading ? "Synchronisation..." : "Mettre à jour mon profil"}
                </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;