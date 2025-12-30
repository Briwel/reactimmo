import React from 'react';
import { useNavigate } from 'react-router-dom';
import Immeuble from '../../assets/immeuble.jpeg'
import { PropertyTypeCard } from '../../components/dashboard/PropertyTypeCard';
import { CounterInput } from '../../components/dashboard/CounterInput';

const PublishListing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f6f8] text-[#0d121b] font-display min-h-screen flex flex-col">
      
      {/* HEADER AVEC FLÈCHE RETOUR */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e7ebf3] px-4 lg:px-10 py-3 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-4">
            {/* Bouton Retour */}
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center gap-2 text-slate-600 hover:text-[#135bec] transition-colors"
            >
              <div className="flex items-center justify-center size-9 rounded-full group-hover:bg-blue-50 transition-colors">
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </div>
              <span className="hidden sm:inline text-sm font-bold">Retour</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <h2 className="text-[#0d121b] text-lg font-bold tracking-tight">Publier une annonce</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-slate-900">Odalric Fassinou</span>
              <span className="text-[11px] text-slate-500 font-medium">Espace Agent</span>
            </div>
            <button className="size-10 rounded-full overflow-hidden border border-gray-200">
              <img src={ Immeuble } alt="User" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
          
          {/* Titre & Intro */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[#0d121b] text-3xl md:text-4xl font-black leading-tight tracking-tight">Publier une annonce</h1>
            <p className="text-[#4c669a] text-base font-normal">Remplissez les informations ci-dessous pour mettre votre bien en ligne.</p>
          </div>

          <form action="#" className="flex flex-col gap-6" method="POST">
            
            {/* SECTION 1: LES BASES */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e7ebf3] p-6 md:p-8">
              <h2 className="text-[#0d121b] text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">feed</span>
                1. Les bases
              </h2>
              <div className="space-y-8">
                {/* Transaction */}
                <div>
                  <label className="block text-sm font-bold mb-3">Type de transaction</label>
                  <div className="flex h-12 w-full max-w-sm bg-[#e7ebf3] p-1 rounded-lg">
                    <label className="flex-1 cursor-pointer flex items-center justify-center rounded-md transition-all has-[:checked]:bg-white has-[:checked]:text-[#135bec] font-medium text-gray-500">
                      <span>Vente</span>
                      <input defaultChecked className="hidden" name="transaction_type" type="radio" value="vente"/>
                    </label>
                    <label className="flex-1 cursor-pointer flex items-center justify-center rounded-md transition-all has-[:checked]:bg-white has-[:checked]:text-[#135bec] font-medium text-gray-500">
                      <span>Location</span>
                      <input className="hidden" name="transaction_type" type="radio" value="location"/>
                    </label>
                  </div>
                </div>

                {/* Type de bien */}
                <div>
                  <label className="block text-sm font-bold mb-3">Type de bien</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <PropertyTypeCard icon="home" label="Maison" name="property_type" value="maison" defaultChecked />
                    <PropertyTypeCard icon="apartment" label="Appartement" name="property_type" value="appartement" />
                    <PropertyTypeCard icon="landscape" label="Terrain" name="property_type" value="terrain" />
                    <PropertyTypeCard icon="directions_car" label="Parking" name="property_type" value="parking" />
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-bold mb-3">Adresse du bien</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400">location_on</span>
                    </div>
                    <input className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-[#135bec] focus:border-[#135bec] text-gray-900" placeholder="Ex: 12 Rue de la Paix, Paris" type="text"/>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: MÉDIAS */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e7ebf3] p-6 md:p-8">
              <h2 className="text-[#0d121b] text-xl font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">imagesmode</span>
                2. Photos & Vidéos
              </h2>
              <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#135bec] transition-all cursor-pointer bg-gray-50/50">
                <div className="size-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-[#135bec]">
                  <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                </div>
                <p className="text-[#0d121b] font-bold text-lg mb-1">Glissez vos photos ici</p>
                <p className="text-gray-500 text-sm mb-6">ou cliquez pour parcourir vos fichiers</p>
                <button className="px-6 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors" type="button">
                  Sélectionner des fichiers
                </button>
              </div>
            </div>

            {/* SECTION 3: DÉTAILS */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e7ebf3] p-6 md:p-8">
              <h2 className="text-[#0d121b] text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">tune</span>
                3. Caractéristiques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Surface (m²)</label>
                  <div className="relative">
                    <input className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#135bec] focus:border-[#135bec]" placeholder="0" type="number"/>
                    <span className="absolute right-4 top-3 text-gray-400 text-sm font-medium">m²</span>
                  </div>
                </div>
                <CounterInput label="Pièces" value={1} />
                <CounterInput label="Chambres" value={1} />
              </div>
            </div>

            {/* SECTION 4: PRIX */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e7ebf3] p-6 md:p-8">
              <h2 className="text-[#0d121b] text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">euro</span>
                4. Description & Prix
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Prix de vente</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-medium">€</span>
                    <input className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-[#135bec] font-semibold text-lg" placeholder="0" type="text"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Charges / mois</label>
                  <input className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#135bec]" placeholder="0" type="text"/>
                </div>
              </div>
              <textarea className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-[#135bec] min-h-[150px]" placeholder="Décrivez votre bien en détail..."></textarea>
            </div>

            {/* ACTION BAR FIXE */}
            <div className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between shadow-lg">
              <div className="hidden sm:flex items-center text-sm text-gray-500">
                <span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>
                Brouillon sauvegardé automatiquement
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <button className="px-6 h-12 rounded-lg border border-gray-300 text-[#0d121b] font-bold text-sm bg-white hover:bg-gray-50 transition-colors" type="button">
                  Brouillon
                </button>
                <button className="px-8 h-12 rounded-lg bg-[#135bec] text-white font-bold text-sm hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2" type="submit">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  Publier l'annonce
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default PublishListing;