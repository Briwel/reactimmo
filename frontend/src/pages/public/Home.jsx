import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from '../../components/PropertyCard';

// Déclaration des villes pour le City Explorer
const CITIES = ["Cotonou", "Abomey-calavi", "Akpakpa", "Lokossa", "Akassato", "Parakou", "Natitingou", "Malanville"];

export default function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]); // État pour stocker les biens
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  // États pour les filtres de recherche
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("Maison");
  const [selectedPrice, setSelectedPrice] = useState("Budget");

  // Appel à l'API au montage du composant
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/properties"); 
        console.log('GET /api/properties ->', response.data);
        setProperties(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des propriétés:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fonction pour déclencher la recherche avec les filtres
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText) params.append("query", searchText);
    if (selectedType !== "Maison") params.append("type", selectedType);
    if (selectedPrice !== "Budget") params.append("price", selectedPrice);

    navigate(`/SearchResults?${params.toString()}`);
  };

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
              Découvrez des milliers de propriétés exclusives au Bénin.
            </p>
          </div>

          {/* SEARCH MODULE AVEC LISTES DÉROULANTES FONCTIONNELLES */}
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-2 sm:p-4 text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-black focus:border-primary focus:ring-primary outline-none" 
                  placeholder="Ville, quartier ou type de bien..." 
                />
              </div>
              <button 
                onClick={handleSearch}
                className="w-full sm:w-auto flex items-center justify-center rounded-lg h-11 px-6 bg-black text-white text-base font-bold hover:bg-zinc-800 transition-colors uppercase text-xs tracking-widest"
              >
                Rechercher
              </button>
            </div>

            {/* FILTERS / SELECTS */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {/* Sélecteur Type */}
              <div className="relative group">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm font-semibold text-black hover:bg-gray-50 outline-none cursor-pointer"
                >
                  <option value="Maison">Type: Maison</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Villa">Villa</option>
                  <option value="Terrain">Terrain</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
              </div>

              {/* Sélecteur Prix */}
              <div className="relative group">
                <select 
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="appearance-none flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm font-semibold text-black hover:bg-gray-50 outline-none cursor-pointer"
                >
                  <option value="Budget">Prix: Budget</option>
                  <option value="50000000">Max 50M FCFA</option>
                  <option value="100000000">Max 100M FCFA</option>
                  <option value="500000000">Max 500M FCFA</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS / TRUST BANNER */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {[
            { icon: "verified", title: "Annonces Vérifiées", desc: "Chaque propriété est visitée et validée par nos experts." },
            { icon: "bolt", title: "Contact Rapide", desc: "Entrez en contact direct avec les propriétaires." },
            { icon: "real_estate_agent", title: "Accompagnement", desc: "Une équipe disponible pour vous accompagner." }
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
          <Link to="/SearchResults" className="flex items-center gap-1 text-black font-bold border-b-2 border-black pb-1 hover:text-primary hover:border-primary transition-all uppercase text-xs tracking-widest" >
            Voir tout <span className="material-symbols-outlined !text-sm">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <p className="col-span-full text-center py-10">Chargement des biens...</p>
          ) : properties.length > 0 ? (
            properties.slice(0, 6).map(p => (
              <PropertyCard 
                key={p.id} 
                id={p.id}
                titre={p.titre}
                adresse={p.adresse || "Localisation non précisée"}
                prix={p.prix}
                beds={p.chambres || 0}
                baths={p.sallesDeBain || 0}
                size={`${p.surface || 0}m²`}
                image={p.photos && p.photos.length > 0 
                  ? `http://localhost:3000/uploads/${p.photos[0].url}` 
                  : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800"} 
              />
            ))
          ) : (
            <p className="col-span-full text-center py-10">Aucune propriété disponible pour le moment.</p>
          )}
        </div>
      </section>

      {/* 4. CITY EXPLORER */}
      <section className="py-16 bg-[#f9f9f9] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-black mb-8 uppercase tracking-widest">Explorez par ville</h2>
          <div className="flex flex-wrap gap-3">
            {CITIES.map(city => {
              const count = properties.filter(p => 
                p.adresse?.toLowerCase().includes(city.toLowerCase())
              ).length;

              return (
                <Link 
                  key={city} 
                  to={`/SearchResults?query=${city}`} 
                  className="group px-6 py-3 rounded-xl border border-gray-200 bg-white hover:border-black hover:shadow-md transition-all flex flex-col items-start"
                >
                  <span className="text-sm font-bold text-gray-900 group-hover:text-black">{city}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-medium">{count} annonce(s)</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}