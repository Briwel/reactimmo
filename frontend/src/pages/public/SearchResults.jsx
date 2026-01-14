import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Ajout de useLocation
import axios from 'axios';
import SearchCard from '../../components/SearchCard';

export default function SearchResults() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pour lire les paramètres de l'URL (ex: ?query=Cotonou)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('query')?.toLowerCase() || "";
  const typeFilter = searchParams.get('type')?.toLowerCase() || "";
  const priceFilter = Number(searchParams.get('price')) || null; // max price if provided

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Mise à jour de l'URL avec le préfixe /api configuré dans main.ts
        const res = await axios.get("http://localhost:3000/api/properties");
        setProperties(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des biens", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filtrage des propriétés en fonction de la recherche (ville ou titre)
  const filteredProperties = properties.filter(p => {
    // Apply query (address or title)
    if (searchQuery) {
      const matchesQuery = (p.adresse?.toLowerCase().includes(searchQuery) || p.titre?.toLowerCase().includes(searchQuery));
      if (!matchesQuery) return false;
    }

    // Apply type filter if present
    if (typeFilter) {
      if (!p.type || p.type.toLowerCase() !== typeFilter) return false;
    }

    // Apply max price filter if present
    if (priceFilter) {
      const price = Number(p.prix || 0);
      if (isNaN(price) || price > priceFilter) return false;
    }

    return true;
  });

  if (loading) return (
    <div className="p-20 text-center font-bold uppercase tracking-widest animate-pulse">
      Chargement des annonces...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Affichage du titre de recherche si une requête existe */}
        {searchQuery && (
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Résultats pour : <span className="text-primary capitalize">"{searchQuery}"</span>
          </h2>
        )}

        <div className="grid grid-cols-1 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => {
              // Logique robuste pour l'image
              let imageUrl = "https://via.placeholder.com/800x600";
              
              if (property.photos && property.photos.length > 0) {
                // Si relation OneToMany (Tableau d'objets)
                imageUrl = `http://localhost:3000/uploads/${property.photos[0].url}`;
              } else if (property.photo) {
                // Si champ texte simple
                imageUrl = `http://localhost:3000/uploads/${property.photo}`;
              }

              return (
                <Link key={property.id} to={`/details/${property.id}`} className="no-underline">
                  <SearchCard 
                    prix={property.prix}
                    titre={property.titre || "Sans titre"}
                    adresse={property.adresse || "Localisation non précisée"}
                    img={imageUrl}
                  />
                </Link>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
              <p className="text-gray-500 text-xl italic">
                {searchQuery 
                  ? `Aucun bien trouvé pour "${searchQuery}"` 
                  : "Aucune propriété disponible dans la base de données."}
              </p>
              <Link to="/" className="text-blue-600 underline mt-4 inline-block">
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}