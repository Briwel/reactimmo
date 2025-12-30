import React from 'react';

const ContactSidebar = ({ price, agent }) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 flex flex-col gap-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">Prix demandé</p>
              <h2 className="text-3xl font-bold text-[#135bec]">1 850 000 €</h2>
              <p className="text-xs text-slate-400 mt-1">~ 14 800 € / m²</p>
            </div>
            <hr className="border-slate-100 mb-6" />
            <div className="mb-6 flex items-center gap-4">
              <img className="size-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqw3AU1qBZq0uUTTgf0zbY7E0zpq3iMzrBldRoANoCqOWgDCpl4HXeaJofLsU3yrZIGbaUlMOAkuaORou2hDVyWjh9KK6QE4F324uLeHVrO4fUPVUqXdvqF8I79Dh3_ZaVXuDrc4ms9fcT_1eSLQS1_JNfjqtUtT0ymthVUi7hi8_rMV3dhDIekOWHLI6hFzEk2FLcYxr-g1n1BvY4ugu6gzwIfyqEvhSmfM5aLHLKg5AJuqTYdKZmlFH-0pD29rye5LB-NUW09Os1" alt="Agent" />
              <div>
                <h3 className="font-bold text-slate-900">Thomas Durand</h3>
                <p className="text-sm text-slate-500">Agent Expert Paris 16</p>
                <div className="mt-1 flex gap-1 text-xs text-amber-500">
                  {[1, 2, 3, 4].map(i => <span key={i} className="material-symbols-outlined text-[16px] fill-current">star</span>)}
                  <span className="material-symbols-outlined text-[16px] fill-current">star_half</span>
                  <span className="ml-1 text-slate-400">(48 avis)</span>
                </div>
              </div>
            </div>
            <form className="flex flex-col gap-4">
              <input className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#135bec] focus:ring-[#135bec]" placeholder="Votre nom" type="text" />
              <input className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#135bec] focus:ring-[#135bec]" placeholder="Email" type="email" />
              <textarea className="w-full resize-none rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#135bec] focus:ring-[#135bec]" placeholder="Bonjour, je suis intéressé..." rows="3"></textarea>
              <button className="w-full rounded-lg bg-[#135bec] py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors" type="button">Contacter l'agent</button>
              <button className="w-full rounded-lg border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors" type="button">Réserver une visite</button>
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