import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]); // Pour les nouvelles images
    
    const [formData, setFormData] = useState({
        titre: '',
        prix: '',
        description: '',
        type: 'appartement',
        adresse: '',
        superficie: '',
        nombrePieces: ''
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/properties/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFormData(response.data);
            } catch (error) {
                console.error("Erreur chargement:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        // Utilisation de FormData pour envoyer texte + fichiers
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('prix', formData.prix);
        data.append('description', formData.description);
        data.append('type', formData.type);
        data.append('adresse', formData.adresse);
        data.append('superficie', formData.superficie);
        data.append('nombrePieces', formData.nombrePieces);

        // Ajouter les nouvelles images si l'utilisateur en a choisi
        selectedFiles.forEach((file) => {
            data.append('images', file);
        });

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/api/properties/${id}`, data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Très important
                }
            });
            alert("Propriété mise à jour avec succès !");
            navigate('/annonces');
        } catch (error) {
            console.error("Erreur modification:", error.response?.data);
            alert("Erreur lors de la modification.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Chargement des données...</div>;

    return (
        <div className="flex h-screen bg-[#f6f6f8]">
            <Sidebar activePage="listings" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title="Modifier l'annonce" />
                <main className="flex-1 overflow-y-auto p-8">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
                            {/* --- Champs Textes --- */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase text-slate-400">Titre</label>
                                <input 
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none font-bold"
                                    value={formData.titre}
                                    onChange={e => setFormData({...formData, titre: e.target.value})}
                                />
                                {/* ... Reproduis les autres champs (prix, adresse, etc.) comme dans PublishListing ... */}
                            </div>

                            {/* --- Zone Upload pour nouvelles photos --- */}
                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                                    Ajouter de nouvelles photos
                                </label>
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {selectedFiles.length > 0 && (
                                    <p className="mt-2 text-xs text-blue-600 font-bold">
                                        {selectedFiles.length} nouveaux fichiers sélectionnés
                                    </p>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={updating}
                                className="w-full h-16 bg-[#135bec] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
                            >
                                {updating ? "Mise à jour en cours..." : "Confirmer les modifications"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditProperty;