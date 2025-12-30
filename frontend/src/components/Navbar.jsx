import {Link} from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            <span className="material-symbols-outlined !text-3xl">apartment</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight" style={{color: "black"}}><span className="text-black">Immo</span>Plateform</h2>
        </div>
        
        {/*
        <nav className="hidden md:flex items-center gap-8">
          {['Acheter', 'Louer', 'Vendre', 'Estimer'].map((link) => (
            <a key={link} href="#" className="text-sm font-medium hover:text-primary transition-colors text-black">
              {link}
            </a>
          ))}
        </nav>
          */}

        <div className="flex items-center gap-4">
          <Link to="/Login" className="hidden sm:flex text-sm font-medium hover:text-primary transition-colors text-black">
            Connexion
          </Link>
          <Link to="/login?mode=signup" className="flex items-center justify-center rounded-lg h-10 px-4 bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10">
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}