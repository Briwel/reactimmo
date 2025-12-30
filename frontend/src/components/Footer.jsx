export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* Colonne Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-black text-2xl">apartment</span>
              <span className="text-lg font-black uppercase tracking-tighter">ImmoPlateform</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Votre partenaire de confiance pour tous vos projets immobiliers depuis 2010. Excellence et discrétion garanties.
            </p>
          </div>

          {/* Liens : Immobilier */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-black mb-6">Immobilier</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-gray-500">
              {['Acheter', 'Louer', 'Vendre', 'Estimer'].map((item) => (
                <li key={item}><a href="#" className="hover:text-black transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Liens : Entreprise */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-black mb-6">Entreprise</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-gray-500">
              {['À propos', 'Carrières', 'Blog', 'Contact'].map((item) => (
                <li key={item}><a href="#" className="hover:text-black transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Liens : Légal */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-black mb-6">Légal</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-gray-500">
              {['Mentions légales', 'Confidentialité', 'Cookies'].map((item) => (
                <li key={item}><a href="#" className="hover:text-black transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Barre de Copyright Basse */}
        <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            © 2025 ImmoPlateform. Tous droits réservés.
          </p>
          <div className="flex gap-8">
            {['FB', 'TW', 'IG'].map((social) => (
              <a key={social} href="#" className="text-[11px] font-black hover:text-primary transition-colors tracking-tighter">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}