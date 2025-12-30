import React, { useState } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

const Archives = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const archivedListings = [
    { 
      id: 101, 
      name: "Penthouse Horizon", 
      address: "Quai de la Fosse, Nantes", 
      price: "890 000 €", 
      soldPrice: "875 000 €",
      status: "Vendu", 
      closeDate: "12/11/2023",
      type: "Appartement", 
      surface: "145m²",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop"
    },
    { 
      id: 102, 
      name: "Pavillon des Arts", 
      address: "Rue de la République, Lyon", 
      price: "520 000 €", 
      soldPrice: "520 000 €",
      status: "Vendu", 
      closeDate: "05/10/2023",
      type: "Maison", 
      surface: "120m²",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=500&auto=format&fit=crop"
    },
    { 
      id: 103, 
      name: "Ancien Garage Loft", 
      address: "Quartier St-Cyprien, Toulouse", 
      price: "410 000 €", 
      status: "Retiré", 
      closeDate: "20/09/2023",
      type: "Loft", 
      surface: "95m²",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=500&auto=format&fit=crop"
    }
  ];

  const filteredArchives = archivedListings.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      <Sidebar activePage="archives" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Archives" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl flex flex-col gap-8">
            
            {/* Header section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight uppercase">Historique des ventes</h1>
                <p className="text-slate-500 text-sm">Consultez vos biens vendus ou retirés du marché.</p>
              </div>
              
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                <input 
                  type="text"
                  placeholder="RECHERCHER DANS L'HISTORIQUE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full md:w-80 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#135bec] focus:border-[#135bec] outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Tableau Archives */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-slate-500">
                    <tr>
                      <th className="px-6 py-4 w-[40%]">Bien immobilier</th>
                      <th className="px-6 py-4">Prix Initial</th>
                      <th className="px-6 py-4">Prix de Vente</th>
                      <th className="px-6 py-4">Date de clôture</th>
                      <th className="px-6 py-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredArchives.map((listing) => (
                      <ArchiveRow key={listing.id} {...listing} />
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

const ArchiveRow = ({ name, address, price, soldPrice, status, closeDate, type, surface, image }) => (
  <tr className="group hover:bg-gray-50/50 transition-colors">
    <td className="px-6 py-5">
      <div className="flex gap-4 items-center">
        <div className="h-16 w-24 rounded-xl bg-gray-100 bg-cover bg-center shrink-0 border border-gray-100 grayscale-[50%] group-hover:grayscale-0 transition-all" 
             style={{ backgroundImage: `url('${image}')` }}>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-base">{name}</span>
          <span className="text-xs text-slate-500">{address}</span>
          <div className="mt-1 text-[9px] font-black uppercase tracking-tighter text-gray-400">
            {type} • {surface}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5 text-slate-400 line-through font-bold">{price}</td>
    <td className="px-6 py-5 font-black text-[#135bec]">{soldPrice || "--"}</td>
    <td className="px-6 py-5 text-xs font-bold text-slate-600">{closeDate}</td>
    <td className="px-6 py-5">
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
        status === 'Vendu' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-100 text-gray-500 border-gray-200'
      }`}>
        {status}
      </span>
    </td>
  </tr>
);

export default Archives;