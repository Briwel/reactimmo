import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavbarResults from '../../components/NavbarResults';
import PropertyGallery from '../../components/PropertyGallery';
import ContactSidebar from '../../components/ContactSidebar';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractText, setContractText] = useState(null);
  const [opError, setOpError] = useState(null);
  const [opSuccess, setOpSuccess] = useState(null);
  const [interest, setInterest] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) {
          setError('ID manquant');
          return;
        }

        const res = await axios.get(`http://localhost:3000/api/properties/${id}`);
        console.log('GET /api/properties/{id} ->', id, res.data);
        setProperty(res.data);
      } catch (err) {
        console.error("Erreur de chargement", err);
        setError(err?.response?.data?.message || err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/operations/property/${id}`);
        const ops = res.data || [];

        const opWithContrat = ops.find((op) => op.contrat);
        if (opWithContrat?.contrat) {
          const c = opWithContrat.contrat;
          const client = opWithContrat.client;
          const lines = [];
          lines.push(`Statut: ${c.statut}`);
          lines.push(`Montant: ${c.montant !== undefined && c.montant !== null ? Number(c.montant).toLocaleString() + ' €' : '—'}`);
          lines.push(`Début: ${c.dateDebut ? new Date(c.dateDebut).toLocaleDateString() : '—'}`);
          if (client) lines.push(`Client: ${client.prenom ?? ''} ${client.nom ?? ''} ${client.email ? '(' + client.email + ')' : ''}`);
          setContractText(lines.join('\n'));
        } else if (property?.contratClauses) {

          setContractText(property.contratClauses);
        } else {
          setContractText(null);
        }
      } catch (err) {
        console.warn('Impossible de charger le contrat', err?.message || err);
      }
    };
    fetchContract();
  }, [id, property]);

  const submitInterest = async (e) => {
    e.preventDefault();
    if (!property) return;
    setOpError(null);
    setOpSuccess(null);
    try {
      const nom = (interest.nom || '').trim();
      const prenom = (interest.prenom || '').trim();
      const email = (interest.email || '').trim();
      const telephone = (interest.telephone || '').trim();

      if (!nom && !telephone) {
        setOpError('Veuillez saisir au moins votre nom ou votre numéro de téléphone.');
        return;
      }

      const client = {
        nom: nom || '',
        prenom: prenom || '',
        email: email || '',
        telephone: telephone || '',
      };

      await axios.post('http://localhost:3000/api/operations/create', {
        type: 'reservation',
        proprieteId: Number(id),
        montantFinal: property.prix,
        client,
      });
      setOpSuccess('Votre intérêt a bien été enregistré. Un agent vous recontactera.');
      setInterest({ nom: '', prenom: '', email: '', telephone: '' });
    } catch (err) {
      setOpError(err?.response?.data?.message || err.message || 'Impossible de créer la réservation');
    }
  };

  if (loading) return <div className="p-20 text-center uppercase font-black">Chargement du détail...</div>;
  if (error) return <div className="p-20 text-center uppercase font-black text-red-600">Erreur: {error}</div>;
  if (!property) return <div className="p-20 text-center uppercase font-black">Bien introuvable.</div>;

  return (
    <main className="min-h-screen bg-white">
      <NavbarResults />
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">{property.titre}</h1>
            <p className="text-sm sm:text-lg text-slate-500 mb-6">{property.adresse}</p>

            <PropertyGallery images={
              property.photos && property.photos.length > 0
                ? property.photos.map(p => `http://localhost:3000/uploads/${p.url}`)
                : property.photo
                ? [`http://localhost:3000/uploads/${property.photo}`]
                : ["https://via.placeholder.com/1200x800"]
            } />

            <div className="mt-4 rounded-2xl border border-slate-200 p-4 bg-white shadow-sm">
              <h3 className="font-black uppercase text-sm tracking-widest mb-3">Contrat lié au bien</h3>
              {contractText ? (
                <textarea readOnly value={contractText} rows={6} className="w-full resize-none rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-sm min-h-[120px]" />
              ) : (
                <p className="text-sm text-slate-500">Aucun contrat actif pour ce bien.</p>
              )}
            </div>
          </div>

          <aside>
            <ContactSidebar 
              propertyId={id}
              prix={property.prix}
              agent={property.proprietaire}
              statut={property.statut}
            />

            <div className="mt-6 rounded-2xl border border-slate-200 p-4 bg-white shadow-sm">
              <h3 className="font-black uppercase text-sm tracking-widest mb-3">Intérêt client</h3>
              {opError && <div className="mb-2 text-sm text-red-600">{opError}</div>}
              {opSuccess && <div className="mb-2 text-sm text-emerald-600">{opSuccess}</div>}
              <form className="space-y-3" onSubmit={submitInterest}>
                <input
                  className="w-full border rounded-lg px-3 py-3.5 text-sm"
                  placeholder="Nom"
                  value={interest.nom}
                  onChange={(e) => setInterest({ ...interest, nom: e.target.value })}
                />
                <input
                  className="w-full border rounded-lg px-3 py-3.5 text-sm"
                  placeholder="Prénom"
                  value={interest.prenom}
                  onChange={(e) => setInterest({ ...interest, prenom: e.target.value })}
                />
                <input
                  className="w-full border rounded-lg px-3 py-3.5 text-sm"
                  placeholder="Email"
                  type="email"
                  value={interest.email}
                  onChange={(e) => setInterest({ ...interest, email: e.target.value })}
                />
                <input
                  className="w-full border rounded-lg px-3 py-3.5 text-sm"
                  placeholder="Téléphone"
                  value={interest.telephone}
                  onChange={(e) => setInterest({ ...interest, telephone: e.target.value })}
                />
                <button
                  type="submit"
                  className="w-full bg-[#135bec] text-white font-bold uppercase text-xs tracking-widest py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Demander un contact
                </button>
              </form>
            </div>

            
          </aside>
        </div>
      </div>
    </main>
  );
};



export default PropertyDetails;