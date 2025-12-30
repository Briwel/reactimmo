import React from 'react';
import NavbarResults from '../../components/NavbarResults'; // Votre composant existant
import PropertyGallery from '../../components/PropertyGallery';
import ContactSidebar from '../../components/ContactSidebar';

const PropertyDetails = () => {
  // Données prêtes pour le backend
  const propertyData = {
    title: "Appartement de luxe - Paris 16ème",
    price: "1 850 000",
    location: "123 Avenue Victor Hugo, 75116 Paris",
    stats: { rooms: 3, baths: 2, surface: "125 m²", year: 1998 },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgUGDrtMCnQO7upe75Jmwtyc4XjQEQXY5qup_8NbGYc4K9VddDFBcNaNq5NPHRzqsLdxr2w2V13yMCi-luBrVPCWP6u_VxgUlwBroBOxK5w-bgV0JBzQ66b-PyMKEtOejVWqV6Gcv4T74LaxM0OFz-GHzEYn9buSaVQdP3iV2VvLCVsn2Ov8YSJI5thldUW9pV8UsrdfHGFYcDRZs3IpgsfF3XgTibQoOZMZ5tjC-zCmdxOy5P8dYVAFv1QxqtV6cJewu7AMBq0TLi",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDg9eUJa_eekgz7mUIAd0chd6TIFfreKMR3826hjjD82Rote_DluS32jzJr3DFrqv6k_EnqpvCfSpDqcw6ELAo2r6scNNQ3BCWeABNC7CSVa25Ws0WHfcuHgmWTh1S5OWB4ZKade8AErJ_3HYgyzVlJXMnKjkvrhaWhgXJv0ZORLsMZnr-IMlap-ird3T2gl7IY4zmDVrqEe8GOQxJ3BF8uHA7EsJjvHKOSCZCqk9Zh_4-kgG81qu9zrdH6YqiYQVWltInFisAlz3VO",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzbUKUds0fq5hkNzU9sxV41gkB7MPG_YCwpuyCZ17dcTkjFWeU52UAgG8cHbwOpaHA_hK0pi0n5ewk3ipYKAU1LQDoQAsg8e8GgE7FfNLvrZAMnOpBjObTPh8Tkwc0a0i82HqfJTdolPAQOGyGOHJ2KNcvKefN-EEAXyE3InZ0gtxSYkZmi6aMdGgeoFvQ-yDDA7vnN3vKv_sx95kg_HBQKPZM2HpvIpJUXiAhqnabygv9U101SzIQBEsBdo30j1LNtgUtLUJgY21o",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoaCMTmkEWb0MB1pSdpK24DkNU95cfnj4SocNGMjfvgsp6Xtp6QTbKVRNZb58mVFUZ8O-vZ4fo769nJ1rw7GK6YsKVYsN4foTJNKXZtAyQVcjxBMHVO855Z8K0Zimdotc_4xT-xO2ye1hkqVptRfAv-vartnllhtIkoiZio0-pHR7MWedtj4BGv9n-aieuVnKdUamdE5gLWbSsJHP6RvKaqCZeJNcMmlKrKUn3YIPhYbs91DC2a7Ak68mAtFCmNpl-t7XoNrPJa5CA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBc2xo5jPDtReSID73xFnyxQRj6ibF2zQ9A1c-_wInY9IqAG5PaZgvrZdNxxmnoRGLgd4nLrNf9GKpTEmQ2XUvFh9OX-phUUfBXme8iRMlBN3Z-2YcnzZOl-q9v6_I13lmiywE3R0hEyDKRUs6GWaS97M4b_mPPfwYaJVXnNKr9wfAYWd9mNYhjvdYyOrU8GhmSIrOtQ8NDa4_LbShY_4WjF5JJVJABwKM8jkcZh1896wOomfLxzcnj7LOxnK3Jf3jNOtgnOzXZ61Z9"
    ],
    features: ["Ascenseur", "Cave", "Balcon / Terrasse", "Parking sécurisé", "Chauffage central", "Gardien", "Fibre optique", "Orientation Sud"],
    agent: { name: "Thomas Durand", title: "Agent Expert Paris 16", reviews: 48, photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqw3AU1qBZq0uUTTgf0zbY7E0zpq3iMzrBldRoANoCqOWgDCpl4HXeaJofLsU3yrZIGbaUlMOAkuaORou2hDVyWjh9KK6QE4F324uLeHVrO4fUPVUqXdvqF8I79Dh3_ZaVXuDrc4ms9fcT_1eSLQS1_JNfjqtUtT0ymthVUi7hi8_rMV3dhDIekOWHLI6hFzEk2FLcYxr-g1n1BvY4ugu6gzwIfyqEvhSmfM5aLHLKg5AJuqTYdKZmlFH-0pD29rye5LB-NUW09Os1" },
    similar: [
      { title: "Appartement Trocadéro", price: "1 650 000 €", size: "95 m²", rooms: 2, baths: 1, img: "18" },
      { title: "Duplex Passy", price: "1 920 000 €", size: "140 m²", rooms: 4, baths: 3, img: "19" },
      { title: "Penthouse Auteuil", price: "2 100 000 €", size: "110 m²", rooms: 3, baths: 2, img: "20" }
    ]
  };

  return (
    <div className="bg-[#f6f6f8] text-slate-900 font-sans min-h-screen">
      <NavbarResults />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* BREADCRUMBS */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <a href="/">Accueil</a> <span className="material-symbols-outlined text-xs">chevron_right</span>
          <a href="#">Paris</a> <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-slate-900">Vente</span>
        </nav>

        {/* TITRE ET ACTIONS */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#135bec]/10 px-2.5 py-0.5 text-xs font-semibold text-[#135bec]">À vendre</span>
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">Nouveauté</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Appartement de luxe - Paris 16ème
            </h1>
            <div className="mt-2 flex items-center text-slate-500">
              <span className="material-symbols-outlined mr-1 text-lg">location_on</span>
              <p className="text-base">123 Avenue Victor Hugo, 75116 Paris</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="group flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-[#135bec] hover:text-[#135bec]">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="group flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-[#135bec] hover:text-[#135bec]">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>

        <PropertyGallery images={propertyData.images} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">

            {/* HIGHLIGHTS */}
            <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-4">
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                <span className="material-symbols-outlined text-2xl text-[#135bec]">bed</span>
                <span className="text-sm font-medium text-slate-500">Chambres</span>
                <span className="text-lg font-bold text-slate-900">3</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 text-center border-l border-slate-100">
                <span className="material-symbols-outlined text-2xl text-[#135bec]">shower</span>
                <span className="text-sm font-medium text-slate-500">Salles de bain</span>
                <span className="text-lg font-bold text-slate-900">2</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 text-center border-l border-slate-100">
                <span className="material-symbols-outlined text-2xl text-[#135bec]">square_foot</span>
                <span className="text-sm font-medium text-slate-500">Surface</span>
                <span className="text-lg font-bold text-slate-900">125 m²</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 text-center border-l border-slate-100">
                <span className="material-symbols-outlined text-2xl text-[#135bec]">calendar_month</span>
                <span className="text-sm font-medium text-slate-500">Année</span>
                <span className="text-lg font-bold text-slate-900">1998</span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">À propos de ce bien</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p className="mb-4">Découvrez cet appartement d'exception situé au cœur du prestigieux 16ème arrondissement de Paris...</p>
                <p className="mb-4">L'espace de vie se compose d'un vaste salon lumineux avec parquet en chêne massif, moulures et cheminée d'époque...</p>
                <p>Idéalement situé à proximité des commerces, des écoles renommées...</p>
              </div>
              <button className="mt-2 text-sm font-semibold text-[#135bec] hover:underline">Lire la suite</button>
            </div>

            {/* FEATURES */}
            <div className="mb-8 border-t border-slate-200 py-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900">Caractéristiques</h2>
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                {["Ascenseur", "Cave", "Balcon / Terrasse", "Parking sécurisé", "Chauffage central", "Gardien", "Fibre optique", "Orientation Sud"].map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <span className="text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MAP SECTION */}
            <div className="mb-8 border-t border-slate-200 py-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900">Localisation</h2>
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-slate-100">
                <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhtRdHyyYRdmA_LdkwdbXuPLpFzHAlxOu--PHav6Ru-8wMtpSj1fqah-TTMkERvbWvOl-7fGFDCmQ5yIqbkioOVqgjVojhLierjxmYGC4yJuXLtJQ-g5GOPHF2Hxv3o9coUX_WP04avz7KbNVuAfhxFwMO2c6Jwa3Dl4eSkrKcT2QBY9RS4H_RHenR2CWofaxOxlayP12W2W0SlhtNIgQo5BS7rxctMd1aUEcL6b68JIKVxV6hi8jZ18jnmsQLLdCR8c7392Z9bvr8')" }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-md transition-transform hover:scale-105">
                    <span className="material-symbols-outlined text-[#135bec]">map</span>
                    Explorer sur la carte
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#135bec]">school</span>
                  <span>École primaire (5 min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#135bec]">train</span>
                  <span>Métro Victor Hugo (2 min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#135bec]">shopping_basket</span>
                  <span>Supermarché (3 min)</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="relative lg:col-span-1">
            <ContactSidebar price={propertyData.price} agent={propertyData.agent} />
          </aside>
        </div>

        {/* SIMILAR LISTINGS */}
        <div className="mt-10 border-t border-slate-200 pt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Ces biens pourraient vous plaire</h2>
            <a className="flex items-center gap-1 text-sm font-semibold text-[#135bec] hover:underline" href="#">
              Voir plus <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Appartement Trocadéro", price: "1 650 000 €", size: "95 m²", rooms: 2, baths: 1, img: "18" },
              { title: "Duplex Passy", price: "1 920 000 €", size: "140 m²", rooms: 4, baths: 3, img: "19" },
              { title: "Penthouse Auteuil", price: "2 100 000 €", size: "110 m²", rooms: 3, baths: 2, img: "20" }
            ].map((listing, idx) => (
              <div key={idx} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('http://googleusercontent.com/profile/picture/${listing.img}')` }}></div>
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm">{listing.price}</div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-1 text-lg font-bold text-slate-900">{listing.title}</h3>
                  <p className="mb-3 text-sm text-slate-500">Paris 16ème • {listing.size}</p>
                  <div className="mt-auto flex items-center gap-4 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">bed</span> {listing.rooms}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">shower</span> {listing.baths}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-transparent bg-white py-5 text-center text-slate-500 text-sm">
        © 2025 ImmoPlateform. Tous droits réservés.
      </footer>
    </div>
  );
};

export default PropertyDetails;