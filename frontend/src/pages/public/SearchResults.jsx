import SearchCard from '../../components/SearchCard';

export default function SearchResults() {
  const properties = [
    { id: 1, price: "450 000 €", title: "Appartement 3 pièces • 65 m²", loc: "Paris 11ème, République", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800", exclusive: true, agency: "ImmoPro" },
    { id: 2, price: "320 000 €", title: "Studio Loft • 42 m²", loc: "Paris 18ème, Montmartre", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800", favorite: true, agency: "Particulier", isPrivate: true },
    { id: 3, price: "890 000 €", title: "Appartement familial • 105 m²", loc: "Levallois-Perret, Mairie", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800", tag: "Nouveau", agency: "Century 22" },
    { id: 4, price: "690 000 €", title: "Appartement Soft • 70 m²", loc: "Levallois-Perret, Mairie", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800", tag: "Nouveau", agency: "Linda" },
    { id: 5, price: "350 000 €", title: "Soft Studio • 55 m²", loc: "Levallois-Perret, Mairie", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800", exclusive: true, agency: "CentImmobilier" },
    { id: 6, price: "240 000 €", title: "Appartement Loft • 100 m²", loc: "Levallois-Perret, Mairie", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800", tag: "Réservé", agency: "Immao" },

    // Ajoute d'autres objets ici pour remplir la grille...
  ];

  return (
    <div className="bg-background-light min-h-screen font-display">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Filtres</h1>
            <button className="text-sm font-medium text-primary hover:underline">Réinitialiser</button>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Budget</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input className="block w-full rounded-lg border-gray-300 py-2.5 px-3 text-sm focus:ring-primary focus:border-primary" placeholder="Min" />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">€</span>
              </div>
              <div className="relative flex-1">
                <input className="block w-full rounded-lg border-gray-300 py-2.5 px-3 text-sm focus:ring-primary focus:border-primary" placeholder="Max" />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">€</span>
              </div>
            </div>
          </div>

          {/* Surface */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Surface (m²)</label>
            <div className="flex gap-3">
              <input className="block w-full rounded-lg border-gray-300 py-2.5 px-3 text-sm focus:ring-primary focus:border-primary" placeholder="Min" />
              <input className="block w-full rounded-lg border-gray-300 py-2.5 px-3 text-sm focus:ring-primary focus:border-primary" placeholder="Max" />
            </div>
          </div>

          {/* Pièces */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Pièces</label>
            <div className="flex flex-wrap gap-2">
              {['Tous', '1', '2', '3', '4+'].map((n, i) => (
                <button key={n} className={`px-4 py-2 rounded-lg text-sm font-medium border ${i === 0 ? 'bg-black/80 text-white border-primary' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Update Button */}
          <button className="w-full py-3 rounded-lg bg-black/85 hover:bg-black-800 text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">search</span>
            Mettre à jour (142)
          </button>
        </aside>

        {/* RESULTS CONTENT */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Appartements à vendre à Paris</h1>
              <p className="text-gray-500 text-sm mt-1">142 annonces trouvées</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="pl-4 pr-10 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium focus:ring-primary">
                <option>Trier par : Pertinence</option>
                <option>Prix croissant</option>
              </select>
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button className="p-1.5 rounded bg-gray-100 text-primary"><span className="material-symbols-outlined !text-[20px]">grid_view</span></button>
                <button className="p-1.5 rounded text-gray-500"><span className="material-symbols-outlined !text-[20px]">map</span></button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map(item => <SearchCard key={item.id} {...item} />)}
          </div>

           {/* Pagination */}
           <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="size-10 flex items-center justify-center rounded-lg bg-white text-black font-bold text-sm shadow-sm">1</button>
              <button className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">2</button>
              <span className="flex items-center justify-center px-2 text-gray-400">...</span>
              <button className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">12</button>
              <button className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}