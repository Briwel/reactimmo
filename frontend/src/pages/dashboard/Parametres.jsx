import React, { useState, useRef } from 'react';
import Immeuble from '../../assets/immeuble.jpeg'
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profil");
  const [isSaving, setIsSaving] = useState(false);

  const handleGlobalSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("✅ Configuration sauvegardée sur le serveur !");
    }, 1200);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profil": return <ProfileTab />;
      case "notif": return <NotificationsTab />;
      case "security": return <SecurityTab />;
      case "billing": return <BillingTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      <Sidebar activePage="settings" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Paramètres du compte" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-5xl flex flex-col gap-8 pb-20">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">Paramètres</h1>
              <p className="text-slate-500 text-sm">Gérez votre identité numérique et vos accès.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <aside className="lg:col-span-3">
                <nav className="flex flex-col gap-2">
                  <SettingsNavLink icon="person" label="Mon Profil" active={activeTab === "profil"} onClick={() => setActiveTab("profil")} />
                  <SettingsNavLink icon="notifications" label="Notifications" active={activeTab === "notif"} onClick={() => setActiveTab("notif")} />
                  <SettingsNavLink icon="security" label="Sécurité" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
                  <SettingsNavLink icon="credit_card" label="Abonnement" active={activeTab === "billing"} onClick={() => setActiveTab("billing")} />
                </nav>
              </aside>

              <div className="lg:col-span-9 flex flex-col gap-6">
                {renderTabContent()}
                
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all px-4">Réinitialiser</button>
                  <button 
                    onClick={handleGlobalSave}
                    className={`rounded-lg bg-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2 ${isSaving ? 'opacity-70' : 'hover:bg-blue-600'}`}
                  >
                    {isSaving && <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    {isSaving ? 'Synchronisation...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ProfileTab = () => {
  const [user, setUser] = useState({
    prenom: "Odalric",
    nom: "Fassinou",
    email: "mathivetmavet@gmail.com",
    agence: "Particulier",
    avatar: Immeuble
  });

  const fileInputRef = useRef(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser({ ...user, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in duration-300">
      <h3 className="text-lg font-black uppercase tracking-tight mb-6 text-primary">Profil de l'Agent</h3>
      <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-2xl">
        <div className="size-24 rounded-full bg-slate-200 ring-4 ring-white overflow-hidden shadow-inner shrink-0">
          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
            <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Modifier</button>
            <button onClick={() => setUser({ ...user, avatar: "https://via.placeholder.com/200" })} className="px-4 py-2 bg-white border border-slate-200 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Supprimer</button>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Membre depuis Janvier 2024</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Prénom" value={user.prenom} onChange={(val) => setUser({...user, prenom: val})} />
        <InputField label="Nom" value={user.nom} onChange={(val) => setUser({...user, nom: val})} />
        <div className="col-span-1 md:col-span-2">
          <InputField label="Email Pro" value={user.email} onChange={(val) => setUser({...user, email: val})} />
        </div>
      </div>
    </div>
  );
};

const NotificationsTab = () => {
  const [prefs, setPrefs] = useState({ email: true, push: true, whatsapp: false });
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in duration-300">
      <h3 className="text-lg font-black uppercase tracking-tight mb-6">Alertes</h3>
      <div className="divide-y divide-slate-100">
        <ToggleRow label="Alertes Email" desc="Rapports hebdomadaires." checked={prefs.email} onChange={() => setPrefs({...prefs, email: !prefs.email})} />
        <ToggleRow label="Notifications Web" desc="Alertes de nouveaux messages." checked={prefs.push} onChange={() => setPrefs({...prefs, push: !prefs.push})} />
        <ToggleRow label="WhatsApp" desc="Liaison directe avec votre mobile." checked={prefs.whatsapp} onChange={() => setPrefs({...prefs, whatsapp: !prefs.whatsapp})} />
      </div>
    </div>
  );
};

const SecurityTab = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in duration-300">
    <h3 className="text-lg font-black uppercase tracking-tight mb-6">Sécurité</h3>
    <div className="space-y-6">
      <InputField label="Mot de passe actuel" type="password" placeholder="••••••••" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nouveau" type="password" />
        <InputField label="Confirmer" type="password" />
      </div>
    </div>
  </div>
);

const BillingTab = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in duration-300">
    <h3 className="text-lg font-black uppercase tracking-tight mb-6">Abonnement</h3>
    <div className="p-6 rounded-2xl bg-slate-900 text-white mb-6">
      <p className="text-[10px] font-black uppercase opacity-60 mb-1">Plan Actuel</p>
      <h4 className="text-2xl font-black mb-4">Pack Agence Pro</h4>
      <p className="text-2xl font-black">25.000 <span className="text-sm font-medium">FCFA / mois</span></p>
    </div>
    <div className="space-y-3">
        <p className="text-[10px] font-black uppercase text-slate-400">Factures</p>
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
            <span className="text-xs font-bold text-slate-700">Facture_Dec_2025.pdf</span>
            <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer">download</span>
        </div>
    </div>
  </div>
);

const SettingsNavLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${active ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100'}`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span> {label}
  </button>
);

const InputField = ({ label, value, type = "text", placeholder, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all" 
    />
  </div>
);

const ToggleRow = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-5">
    <div>
      {/* Modification ici : font-bold au lieu de font-black, et suppression de uppercase */}
      <p className="text-[13px] font-bold text-slate-800 tracking-tight">{label}</p>
      <p className="text-[11px] font-medium text-slate-400">{desc}</p>
    </div>
    <button 
      onClick={onChange} 
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ${checked ? 'bg-primary' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default Settings;