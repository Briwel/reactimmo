import {Link} from "react-router-dom";
import PropertyCard from '../../components/PropertyCard';

const PROPERTIES = [
  { id: 1, price: "450 000 €", title: "Appartement lumineux avec balcon", location: "Paris 11ème, 75011", beds: 2, baths: 1, size: "68m²", tag: "EXCLUSIVITÉ", tagColor: "bg-black", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800" },
  { id: 2, price: "890 000 €", title: "Maison moderne avec jardin", location: "Bordeaux, 33000", beds: 4, baths: 2, size: "145m²", tag: "NOUVEAU", tagColor: "bg-primary", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop" },
  { id: 3, price: "320 000 €", title: "Loft industriel rénové", location: "Lyon, 69002", beds: 1, baths: 1, size: "55m²", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800" }
];

const CITIES = ["Cotonou", "Abomey-calavi", "Akpakpa", "Lokossa", "Akassato", "Parakou", "Natitingou", "Malanville"];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative flex flex-col items-center justify-center min-h-[550px] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920')` }}
      >
        <div className="w-full max-w-5xl px-4 flex flex-col items-center gap-8 text-center z-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">
              Trouvez la maison de vos rêves
            </h1>
            <p className="text-gray-100 text-lg sm:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
              Découvrez des milliers de propriétés exclusives à vendre et à louer dans votre région.
            </p>
          </div>

          {/* SEARCH MODULE */}
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                  type="text"
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-black focus:border-primary focus:ring-primary outline-none" 
                  placeholder="Ville, code postal ou adresse (ex: Paris, 75011)" 
                />
              </div>
              <Link to="/SearchResults" className="w-full sm:w-auto flex items-center justify-center rounded-lg h-11 px-6 bg-black text-white text-base font-bold hover:bg-zinc-800 transition-colors uppercase text-xs tracking-widest">
                Rechercher
              </Link>
            </div>

            {/* FILTERS / CHIPS */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {[
                { label: "Type", value: "Maison" },
                { label: "Prix", value: "Max 500k €" },
                { label: "Chambres", value: "3+" }
              ].map((filter) => (
                <button key={filter.label} className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 hover:bg-gray-50 transition-colors group">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{filter.label}</span>
                  <span className="text-sm font-semibold text-black">{filter.value}</span>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-black">expand_more</span>
                </button>
              ))}
              <button className="ml-auto flex h-9 items-center gap-1 rounded-lg px-2 text-black hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined !text-[18px]">tune</span>
                <span className="text-sm font-bold">Plus de filtres</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS / TRUST BANNER */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {[
            { icon: "verified", title: "Annonces Vérifiées", desc: "Chaque propriété est visitée et validée par nos experts." },
            { icon: "bolt", title: "Contact Rapide", desc: "Entrez en contact direct avec les propriétaires ou agents." },
            { icon: "real_estate_agent", title: "Support Dédié", desc: "Une équipe disponible 7j/7 pour vous accompagner." }
          ].map((stat) => (
            <div key={stat.title} className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-black">
                <span className="material-symbols-outlined !text-2xl">{stat.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">{stat.title}</h3>
                <p className="text-sm text-gray-500">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LISTINGS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-black tracking-tight uppercase">Annonces à la une</h2>
            <p className="text-gray-500 mt-2">Les biens les plus consultés de la semaine</p>
          </div>
          <a href="/SearchResults" className="flex items-center gap-1 text-black font-bold border-b-2 border-black pb-1 hover:text-primary hover:border-primary transition-all uppercase text-xs tracking-widest" >
            Voir tout <span className="material-symbols-outlined !text-sm">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROPERTIES.map(p => <PropertyCard key={p.id} {...p} />)}
        </div>
      </section>

      {/* 4. CITY EXPLORER */}
      <section className="py-16 bg-[#f9f9f9] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-black mb-8 uppercase tracking-widest">Explorez par ville</h2>
          <div className="flex flex-wrap gap-3">
            {CITIES.map(city => (
              <a 
                key={city} 
                href="/SearchResults" 
                className="px-6 py-2 rounded-full border border-gray-200 bg-white hover:border-black hover:text-black transition-all text-sm font-bold text-gray-600 shadow-sm"
              >
                {city}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}