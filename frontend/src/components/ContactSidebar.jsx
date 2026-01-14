import React, { useState } from 'react';
import axios from 'axios';

const ContactSidebar = ({ propertyId, prix, agent, statut, showOwnerActions = false }) => {
  const displayName = agent ? `${agent?.prenom || ''} ${agent?.nom || ''}`.trim() : 'Agent';

  const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const isAvailable = normalize(statut) === 'disponible';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [loadingContact, setLoadingContact] = useState(false);
  const [loadingReserve, setLoadingReserve] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleConfirm = async (status) => {
    setSuccess(null);
    setError(null);
    if (loadingConfirm) return;
    if (!localStorage.getItem('token')) {
      setError('Vous devez être connecté pour effectuer cette action.');
      return;
    }
    if (!isAvailable) {
      setError("Le bien n'est pas disponible.");
      return;
    }
    if (!window.confirm(`Voulez-vous vraiment marquer ce bien comme ${status === 'vendu' ? 'vendu' : 'loué'} ?`)) return;

    try {
      setLoadingConfirm(true);
      const token = localStorage.getItem('token');
      const res = await axios.patch(`http://localhost:3000/api/properties/${propertyId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Statut mis à jour: ${res.data.statut}`);
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error('Erreur confirmation', err);
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleContact = async () => {
    setSuccess(null);
    setError(null);
    if (loadingContact) return;
    if (!name || !email || !message) {
      setError('Veuillez renseigner votre nom, email et un message.');
      return;
    }
    try {
      setLoadingContact(true);
      const res = await axios.post(`http://localhost:3000/api/properties/${propertyId}/contact`, {
        name,
        email,
        phone,
        message,
      });
      setSuccess(res.data?.message || 'Message envoyé.');
      // clear form
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (err) {
      console.error('Erreur contact', err);
      setError(err?.response?.data?.message || err.message || 'Erreur lors de l envoi');
    } finally {
      setLoadingContact(false);
    }
  };

  const handleReserve = async () => {
    setSuccess(null);
    setError(null);
    if (loadingReserve) return;
    if (!name || !phone || !date) {
      setError('Veuillez renseigner votre nom, téléphone et la date souhaitée.');
      return;
    }
    try {
      setLoadingReserve(true);
      const res = await axios.post(`http://localhost:3000/api/properties/${propertyId}/reserve`, {
        name,
        phone,
        date,
      });
      setSuccess(res.data?.message || 'Réservation envoyée.');
      // clear date/phone
      setDate(''); setPhone('');
    } catch (err) {
      console.error('Erreur réservation', err);
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la réservation');
    } finally {
      setLoadingReserve(false);
    }
  };

  return (
    <div className="lg:col-span-1 w-full">
      <div className="lg:sticky lg:top-24 flex flex-col gap-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">Prix (champ brut)</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#135bec]">{prix ?? 'Prix sur demande'}</h2>
              {prix !== undefined && <p className="text-xs text-slate-400 mt-1">(valeur brute : {String(prix)})</p>}
            </div>
            <hr className="border-slate-100 mb-6" />
            <div className="mb-6 flex items-center gap-4">
              <img className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqw3AU1qBZq0uUTTgf0zbY7E0zpq3iMzrBldRoANoCqOWgDCpl4HXeaJofLsU3yrZIGbaUlMOAkuaORou2hDVyWjh9KK6QE4F324uLeHVrO4fUPVUqXdvqF8I79Dh3_ZaVXuDrc4ms9fcT_1eSLQS1_JNfjqtUtT0ymthVUi7hi8_rMV3dhDIekOWHLI6hFzEk2FLcYxr-g1n1BvY4ugu6gzwIfyqEvhSmfM5aLHLKg5AJuqTYdKZmlFH-0pD29rye5LB-NUW09Os1" alt="Agent" />
              <div>
                <h3 className="font-bold text-slate-900">{displayName}</h3>
                <p className="text-sm text-slate-500">Telephone: {agent?.telephone}</p>
                <div className="mt-1 flex gap-1 text-xs text-amber-500">
                  {[1, 2, 3, 4].map(i => <span key={i} className="material-symbols-outlined text-[16px] fill-current">star</span>)}
                  <span className="material-symbols-outlined text-[16px] fill-current">star_half</span>
                  <span className="ml-1 text-slate-400">(48 avis)</span>
                </div>
              </div>
            </div>

            {error && <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {success && <div className="mb-3 rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</div>}

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3.5 text-sm focus:border-[#135bec] focus:ring-[#135bec]" placeholder="Votre nom" type="text" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3.5 text-sm focus:border-[#135bec] focus:ring-[#135bec]" placeholder="Email" type="email" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3.5 text-sm focus:border-[#135bec] focus:ring-[#135bec]" placeholder="Téléphone" type="tel" />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full resize-none rounded-lg border-slate-200 bg-slate-50 px-4 py-3.5 text-sm focus:border-[#135bec] focus:ring-[#135bec] min-h-[88px]" placeholder="Bonjour, je suis intéressé..." rows="3"></textarea>

              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={handleContact} disabled={loadingContact} className={`w-full sm:flex-1 rounded-lg ${loadingContact ? 'bg-[#93b7ff] text-white' : 'bg-[#135bec] text-white'} py-3.5 text-sm font-bold shadow-md hover:bg-blue-600 transition-colors`} type="button">{loadingContact ? 'Envoi...' : 'Contacter l\'agent'}</button>
                <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full sm:w-40 rounded-lg border-slate-200 bg-slate-50 px-4 py-3.5 text-sm focus:border-[#135bec] focus:ring-[#135bec]" placeholder="Date souhaitée" type="date" />
              </div>

              <button onClick={handleReserve} disabled={loadingReserve} className={`w-full rounded-lg border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors ${loadingReserve ? 'opacity-60' : ''}`} type="button">{loadingReserve ? 'Envoi...' : 'Réserver une visite'}</button>

              {/* ACTIONS POUR UTILISATEUR CONNECTÉ : CONFIRMER VENTE / LOCATION */}
              {showOwnerActions && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button onClick={() => handleConfirm('vendu')} disabled={!isAvailable || loadingConfirm} className={`w-full sm:flex-1 rounded-lg ${!isAvailable ? 'bg-gray-200 text-gray-500' : 'bg-red-600 text-white hover:bg-red-700'} py-3.5 text-sm font-bold transition-colors`} type="button">{loadingConfirm ? 'En cours...' : 'Confirmer l\'achat'}</button>
                  <button onClick={() => handleConfirm('loue')} disabled={!isAvailable || loadingConfirm} className={`w-full sm:flex-1 rounded-lg ${!isAvailable ? 'bg-gray-200 text-gray-500' : 'bg-amber-600 text-white hover:bg-amber-700'} py-3.5 text-sm font-bold transition-colors`} type="button">{loadingConfirm ? 'En cours...' : 'Confirmer la location'}</button>
                </div>
              )}
            </form>
          </div>
          <div className="bg-slate-50 px-6 py-3 text-center text-xs text-slate-500">Réponse moyenne en moins de 1h</div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <span className="material-symbols-outlined text-2xl text-[#135bec]">verified_user</span>
          <div>
            <p className="text-sm font-bold text-slate-900">Annonce vérifiée</p>
            <p className="text-xs text-slate-500">Documents légaux</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSidebar;