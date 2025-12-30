import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

const MyListings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Toutes');
    const [searchQuery, setSearchQuery] = useState("");
    const [listings, setListings] = useState([
        { id: 1, name: "Villa des Roses", address: "12 Rue des Fleurs, Lyon", price: "450 000 €", status: "Actif", stats: { views: 1245, favs: 42 }, type: "Maison", surface: "180m²", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=500&auto=format&fit=crop" },
        { id: 2, name: "Appartement T3 Centre", address: "45 Av. Jean Jaurès, Paris", price: "320 000 €", status: "En attente", stats: { views: 0, favs: 0 }, type: "Appartement", surface: "65m²", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop" },
        { id: 3, name: "Studio Gare", address: "8 Impasse du Train, Lille", price: "110 000 €", status: "Brouillon", stats: { views: 0, favs: 0 }, type: "Studio", surface: "22m²", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop" },
        { id: 4, name: "Duplex Loft", address: "22 Rue de la Paix, Nantes", price: "650 000 €", status: "Actif", stats: { views: 540, favs: 18 }, type: "Loft", surface: "110m²", image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=500&auto=format&fit=crop" },
    ]);

    const [editingListing, setEditingListing] = useState(null);

    // --- ACTIONS ---
    const handleDelete = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
            setListings(listings.filter(l => l.id !== id));
        }
    };

    const handleUpdate = (updatedItem) => {
        setListings(listings.map(l => l.id === updatedItem.id ? updatedItem : l));
        setEditingListing(null);
    };

    const filteredListings = listings.filter(item => {
        const matchesTab = activeTab === 'Toutes' || item.status === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs = [
        { name: 'Toutes', count: listings.length },
        { name: 'Actif', count: listings.filter(l => l.status === 'Actif').length },
        { name: 'En attente', count: listings.filter(l => l.status === 'En attente').length },
        { name: 'Brouillon', count: listings.filter(l => l.status === 'Brouillon').length },
    ];

    return (
        <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden relative">
            <Sidebar activePage="listings" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader title="Mes annonces" />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl flex flex-col gap-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tight uppercase">Gérer vos annonces</h1>
                                <p className="text-slate-500 text-sm">Gérez, éditez et analysez vos propriétés en temps réel.</p>
                            </div>
                            <button onClick={() => { navigate('/publishing'); }} className="flex h-11 items-center gap-2 rounded-lg bg-[#135bec] px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>Nouvelle annonce</span>
                            </button>
                        </div>

                        {/* Filtres & Recherche */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
                                <div className="flex overflow-x-auto no-scrollbar">
                                    {tabs.map((tab) => (
                                        <button key={tab.name} onClick={() => setActiveTab(tab.name)}
                                            className={`px-6 py-4 text-[11px] whitespace-nowrap font-black uppercase tracking-widest transition-all ${activeTab === tab.name ? 'border-b-2 border-[#135bec] text-[#135bec]' : 'text-gray-400 hover:text-slate-600'}`}>
                                            {tab.name} ({tab.count})
                                        </button>
                                    ))}
                                </div>
                                <div className="relative mb-2 md:mb-0">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                                    <input type="text" placeholder="RECHERCHER UN BIEN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9 w-full md:w-64 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#135bec] outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Tableau des annonces */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4 w-[40%]">Bien immobilier</th>
                                            <th className="px-6 py-4">Prix</th>
                                            <th className="px-6 py-4">Stats (30j)</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredListings.length > 0 ? (
                                            filteredListings.map((listing) => (
                                                <ListingRow key={listing.id} listing={listing} onEdit={() => setEditingListing(listing)} onDelete={() => handleDelete(listing.id)} />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-20 text-center text-gray-400 uppercase font-black text-[10px] tracking-widest">Aucun bien trouvé</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal d'édition */}
            {editingListing && (
                <EditModal listing={editingListing} onSave={handleUpdate} onClose={() => setEditingListing(null)} />
            )}
        </div>
    );
};

const ListingRow = ({ listing, onEdit, onDelete }) => {
    const statusStyles = {
        'Actif': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
        'Brouillon': 'bg-gray-50 text-gray-500 border-gray-100',
    };

    return (
        <tr className="group hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-5">
                <div className="flex gap-4">
                    <div className="h-16 w-24 rounded-lg bg-cover bg-center shrink-0 border border-gray-100 shadow-sm" style={{ backgroundImage: `url('${listing.image}')` }}></div>
                    <div className="flex flex-col justify-center">
                        <span className="font-bold text-slate-900 text-sm leading-tight">{listing.name}</span>
                        <span className="text-[11px] text-slate-500 truncate w-48">{listing.address}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5 font-black text-slate-900 text-xs">{listing.price}</td>
            <td className="px-6 py-5">
                <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> {listing.stats.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-red-400">favorite</span> {listing.stats.favs}</span>
                </div>
            </td>
            <td className="px-6 py-5">
                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${statusStyles[listing.status]}`}>
                    {listing.status}
                </span>
            </td>
            <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2">
                    <button onClick={onEdit} className="size-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-400 hover:text-[#135bec] hover:border-[#135bec] transition-all">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={onDelete} className="size-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-400 hover:text-red-600 hover:border-red-600 transition-all">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

const EditModal = ({ listing, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...listing });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-sm font-black uppercase tracking-widest">Modifier l'annonce</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    {/* Gestion Image */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Image principale</label>
                        <div className="relative group h-40 w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-[#135bec] transition-all">
                            <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-white mb-1">upload</span>
                                <span className="text-white text-[9px] font-black uppercase tracking-widest">Remplacer la photo</span>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                        </div>
                        <input type="text" placeholder="Ou URL directe : https://..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} 
                               className="w-full h-9 px-4 bg-slate-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none focus:border-[#135bec]" />
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

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Adresse complète</label>
                        <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} 
                               className="w-full h-11 px-4 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#135bec]" />
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

export default MyListings;