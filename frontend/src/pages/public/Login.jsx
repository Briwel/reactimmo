import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleLogo from '../../assets/google.png'
import FacebookLogo from '../../assets/facebook.png'
import Immeuble from '../../assets/immeuble.jpeg'

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // LOGIQUE D'AJUSTEMENT : Détecter si on doit afficher "S'inscrire" au chargement
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.search]); // Se déclenche quand l'URL change

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col h-full border-r border-gray-100 overflow-hidden">

        <div className="mb-8 px-8 pt-6 pb-2">
          <a href="/">
            <div className="flex items-center gap-3 text-black">
              <span className="material-symbols-outlined !text-3xl text-black">apartment</span>
              <h2 className="text-sm font-black uppercase tracking-tighter">ImmoPlateform</h2>
            </div>
          </a>
        </div>

        <div className="flex-0 flex flex-col justify-center px-8 md:px-12 max-w-[540px] mx-auto w-full">
          <div className="mb-4">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-0">
              {isLogin ? 'Bienvenue' : 'Créer un compte'}
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              {isLogin
                ? 'Connectez-vous pour gérer vos alertes, favoris et vos recherches immobilières.'
                : 'Rejoignez-nous pour accéder aux meilleures opportunités immobilières.'}
            </p>
          </div>

          {/* Onglets Dynamiques */}
          <div className="mb-4">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => { setIsLogin(true); navigate('/login'); }} 
                className={`pb-2 flex-1 text-[11px] font-black uppercase tracking-widest transition-all ${isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
              >
                Se connecter
              </button>
              <button
                onClick={() => { setIsLogin(false); navigate('/login?mode=signup'); }} 
                className={`pb-2 flex-1 text-[11px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
              >
                S'inscrire
              </button>
            </div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>

            {!isLogin && (
              <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[9px] font-black uppercase tracking-widest text-black">Nom complet</label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    placeholder="Nom prénom"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 !text-lg">person</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-black">Adresse email</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  placeholder="votrenom@company.com"
                  type="email"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 !text-lg">mail</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-black">Mot de passe</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 pr-12 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  placeholder="•••••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black"
                >
                  <span className="material-symbols-outlined !text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 border-gray-300 rounded text-black focus:ring-black" />
                  <span className="text-[12px] font-bold text-gray-500 group-hover:text-black transition-colors">Se souvenir de moi</span>
                </label>
                <a className="text-[12px] font-black uppercase tracking-tighter text-black border-b border-black" href="#">Oublié ?</a>
              </div>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-black text-white h-11 rounded-lg font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 mt-1"
            >
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink-0 mx-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Ou</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-[10px] font-bold uppercase tracking-widest">
                <img src={GoogleLogo} className="w-3.5 h-3.5" alt="Google" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-[10px] font-bold uppercase tracking-widest">
                <img src={FacebookLogo} className="w-3.5 h-3.5" alt="Facebook" />
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-[10px] leading-relaxed text-gray-600 font-medium uppercase tracking-widest">
            {isLogin ? (
              <>Pas de compte ? <button onClick={() => navigate('/login?mode=signup')} className="text-black font-bold underline">S'inscrire</button></>
            ) : (
              <>Déjà inscrit ? <button onClick={() => navigate('/login')} className="text-black font-bold underline">Se connecter</button></>
            )}
          </p>
        </div>
      </div>

      {/* PANNEAU DROIT */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] h-full relative">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Immeuble})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className=" z-20 flex flex-col justify-end w-full h-full p-25 text-white">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/20">
              <span className="material-symbols-outlined !text-x1">verified_user</span>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Sécurité garantie</span>
            </div>
            <h2 className="text-6xl font-black leading-tight mb-4 uppercase tracking-tighter">
              {isLogin ? 'Le prestige à portée de main.' : 'Rejoignez l\'excellence.'}
            </h2>
            <p className="text-x9 text-gray-200 leading-relaxed mb-8 font-medium">
              Rejoignez la communauté exclusive ImmoPlateform.
            </p>

            <div className="flex gap-10 border-t border-white/20 pt-8">
              <div>
                <p className="text-2xl font-black uppercase">15k+</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Biens vendus</p>
              </div>
              <div>
                <p className="text-2xl font-black uppercase">98%</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}