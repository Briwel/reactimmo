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
    const [newFiles, setNewFiles] = useState([]);
    const [formData, setFormData] = useState({
        titre: '',
        prix: '',
        description: '',
        type: 'appartement',
        adresse: '',
        contratClauses: '' // On va récupérer ça du backend
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/properties/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // On peuple le formulaire avec les données reçues, y compris le contrat
                const data = response.data;
                setFormData({
                    titre: data.titre,
                    prix: data.prix,
                    description: data.description,
                    type: data.type,
                    adresse: data.adresse,
                    contratClauses: data.contrat?.clauses || '' // Récupération sécurisée
                });
            } catch (error) {
                console.error("Erreur chargement:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        newFiles.forEach(file => data.append('images', file));

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/api/properties/${id}`, data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            alert("Modifications enregistrées !");
            navigate('/annonces');
        } catch (error) {
            console.error("Erreur:", error);
            alert("Échec de la mise à jour.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-black">Chargement...</div>;

    return (
        <div className="flex h-screen bg-[#f6f6f8]">
            <Sidebar activePage="listings" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title="Modifier l'annonce & le contrat" />
                <main className="flex-1 overflow-y-auto p-8">
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
                            {/* Infos de base */}
                            <input className="w-full h-12 px-4 rounded-xl bg-slate-50 border" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} />
                            
                            {/* Modification des clauses du contrat */}
                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Conditions contractuelles</label>
                                <textarea 
                                    className="w-full p-4 rounded-xl bg-blue-50/30 border border-blue-100 min-h-[150px] outline-none" 
                                    value={formData.contratClauses}
                                    onChange={e => setFormData({...formData, contratClauses: e.target.value})}
                                />
                            </div>

                            {/* Nouvelles photos */}
                            <div className="pt-4 border-t border-slate-100">
                                <input type="file" multiple onChange={e => setNewFiles(Array.from(e.target.files))} />
                            </div>

                            <button type="submit" disabled={updating} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase">
                                {updating ? "Enregistrement..." : "Valider les changements"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditProperty;