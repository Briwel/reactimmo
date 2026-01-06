import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import axios from 'axios';

const TYPE_OPTIONS = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
  { value: 'commercial', label: 'Commercial' },
];

const PublishListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // États locaux synchronisés avec le DTO Backend
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('appartement');
  const [adresse, setAdresse] = useState('');
  const [prix, setPrix] = useState('');
  const [surface, setSurface] = useState(''); // Sera mappé sur 'superficie'
  const [nbPieces, setNbPieces] = useState('1'); // Sera mappé sur 'nombrePieces'
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Utilisation de FormData pour supporter l'envoi de fichiers (Multipart)
    const formData = new FormData();
    
    // --- SYNCHRONISATION CRITIQUE AVEC LE DTO ---
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('adresse', adresse);
    formData.append('prix', prix);
    
    // On envoie les noms de clés EXACTS attendus par CreatePropertyDto
    formData.append('superficie', surface); 
    formData.append('nombrePieces', nbPieces); 

    // Ajout des images : la clé 'images' doit matcher FilesInterceptor('images')
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const token = localStorage.getItem('token');
      
      // Appel API vers la route unifiée (Texte + Photos)
      await axios.post('http://localhost:3000/api/properties', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });

      alert("Annonce publiée avec succès !");
      navigate('/annonces');
    } catch (error) {
      console.error("Erreur de synchronisation backend:", error.response?.data);
      const message = error.response?.data?.message || "Erreur lors de la publication.";
      // Affiche les erreurs de validation spécifiques (ex: "prix must be a number")
      alert(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f6f8]">
      <Sidebar activePage="publish" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Publier un bien" />
        
        <main className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            
            {/* Section 1 : Détails Financiers et Localisation */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Détails de l'annonce</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Titre de l'annonce (ex: Bel appartement F3)"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold focus:border-blue-500 transition-colors"
                  value={titre}
                  onChange={e => setTitre(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Prix (FCFA)"
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold"
                    value={prix}
                    onChange={e => setPrix(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ville / Adresse"
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold"
                    value={adresse}
                    onChange={e => setAdresse(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2 : Caractéristiques (Champs synchronisés) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Caractéristiques Techniques</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <select 
                  className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold text-slate-600"
                  value={type} 
                  onChange={e => setType(e.target.value)} 
                  required
                >
                  {TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Surface (m²)"
                  className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold"
                  value={surface}
                  onChange={e => setSurface(e.target.value)}
                  required
                />

                <input
                  type="number"
                  placeholder="Pièces"
                  className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold"
                  value={nbPieces}
                  onChange={e => setNbPieces(e.target.value)}
                  required
                />
              </div>

              <textarea
                placeholder="Description détaillée du bien..."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold h-32 resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Section 3 : Galerie Photo */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Photos du bien</h2>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:border-blue-300 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept="image/*"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center group">
                  <span className="text-blue-600 font-bold group-hover:underline">
                    {files.length > 0 ? `${files.length} fichiers prêts à l'envoi` : "Cliquez pour uploader vos photos"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">Format recommandé : JPG ou PNG</span>
                </label>
              </div>
              
              {/* Liste des fichiers sélectionnés */}
              {files.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {files.map((file, idx) => (
                    <div key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                      {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-[#135bec] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Envoi vers le serveur..." : "Publier l'annonce maintenant"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default PublishListing;