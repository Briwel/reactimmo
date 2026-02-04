import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';


const PublishListing = () => {
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        prix: '',
        type: 'appartement',
        adresse: '',
        superficie: '',
        nombrePieces: '',
        contratClauses: '' 
    });

    const applyBeninTemplate = () => {
        const contratBenin = `CONTRAT DE BAIL À USAGE D'HABITATION (BÉNIN)
--------------------------------------------------
OBJET : Location d'un(e) ${formData.type || 'bien immobilier'}
ADRESSE : ${formData.adresse || '_______'}
LOYER MENSUEL : ${formData.prix || '_______'} FCFA
CAUTION : 3 mois maximum (Conforme Loi 2017-12)
PRÉAVIS : 3 mois (Sauf accord contraire)

CLAUSES PARTICULIÈRES :
1. Paiement du loyer au plus tard le 05 du mois.
2. Électricité (SBEE) et Eau (SONEB) à la charge du locataire.
3. Interdiction de sous-location sans accord écrit.`;
        setFormData({ ...formData, contratClauses: contratBenin });
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Votre session a expiré. Veuillez vous reconnecter.");
                navigate('/login');
                return;
            }

            const dataToSend = new FormData();
            
            // 1. Champs obligatoires
            dataToSend.append('titre', formData.titre);
            dataToSend.append('adresse', formData.adresse);
            dataToSend.append('type', formData.type);
            dataToSend.append('prix', Number(formData.prix));

            // 2. Champs optionnels
            if (formData.description) dataToSend.append('description', formData.description);
            if (formData.contratClauses) dataToSend.append('contratClauses', formData.contratClauses);
            if (formData.superficie) dataToSend.append('superficie', Number(formData.superficie));
            if (formData.nombrePieces) dataToSend.append('nombrePieces', Number(formData.nombrePieces));

            // 3. Images 
            files.forEach((file) => {
                dataToSend.append('images', file);
            });

            const response = await axios.post('http://localhost:3000/api/properties', dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201 || response.status === 200) {
                alert('Annonce publiée avec succès !');
                navigate('/annonces');
            }
        } catch (error) {
            console.error("Erreur serveur:", error.response?.data);
            const errorMsg = error.response?.data?.message;
            alert(Array.isArray(errorMsg) ? errorMsg.join("\n") : (errorMsg || "Erreur lors de la publication."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Sidebar />
            <div className="flex-1">
                <DashboardHeader />
                <main className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-slate-800">Publier une annonce</h1>
                            <p className="text-slate-500">Remplissez les informations de votre bien immobilier</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Titre de l'annonce</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] focus:ring-0 transition-all outline-none bg-white"
                                    placeholder="Ex: Villa duplex avec piscine à Cocotomey"
                                    value={formData.titre}
                                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Type de bien</label>
                                <select 
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] outline-none bg-white"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="appartement">Appartement</option>
                                    <option value="maison">Maison</option>
                                    <option value="villa">Villa</option>
                                    <option value="studio">Studio</option>
                                    <option value="commercial">Local Commercial</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Prix (FCFA)</label>
                                <input 
                                    type="number"
                                    required
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] outline-none"
                                    placeholder="Ex: 150000"
                                    value={formData.prix}
                                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Superficie (m²)</label>
                                <input 
                                    type="number"
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] outline-none"
                                    placeholder="Ex: 200"
                                    value={formData.superficie}
                                    onChange={(e) => setFormData({...formData, superficie: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Nombre de pièces</label>
                                <input 
                                    type="number"
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] outline-none"
                                    placeholder="Ex: 4"
                                    value={formData.nombrePieces}
                                    onChange={(e) => setFormData({...formData, nombrePieces: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Adresse précise</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] outline-none"
                                    placeholder="Quartier, Rue, Ville..."
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Description détaillée</label>
                                <textarea 
                                    className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] outline-none min-h-[120px]"
                                    placeholder="Décrivez les atouts du bien..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Clauses du contrat</label>
                                    <button 
                                        type="button"
                                        onClick={applyBeninTemplate}
                                        className="text-xs font-bold text-[#135bec] bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                                    >
                                        + Appliquer Modèle Bénin
                                    </button>
                                </div>
                                <textarea 
                                    className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-[#135bec] outline-none min-h-[150px] font-mono text-sm"
                                    value={formData.contratClauses}
                                    onChange={(e) => setFormData({...formData, contratClauses: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 p-8 border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:border-[#135bec]/30 transition-all text-center">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer group">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-[#135bec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="block text-slate-600 font-bold">Ajouter des photos</span>
                                    <span className="text-xs text-slate-400">PNG, JPG jusqu'à 10MB</span>
                                </label>
                                {files.length > 0 && (
                                    <p className="text-sm font-bold text-[#135bec] mt-4 italic">
                                        {files.length} photo(s) sélectionnée(s)
                                    </p>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className={`md:col-span-2 w-full h-16 rounded-2xl font-black uppercase tracking-widest transition-all ${loading ? 'bg-slate-300' : 'bg-[#135bec] text-white shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-95'}`}
                            >
                                {loading ? 'Synchronisation...' : 'Publier l\'annonces'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PublishListing;