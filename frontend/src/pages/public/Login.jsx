import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import GoogleLogo from '../../assets/google.png';
import FacebookLogo from '../../assets/facebook.png';
import Immeuble from '../../assets/1.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLogin(params.get('mode') !== 'signup');
  }, [location.search]);

  const { setUser } = useUser();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("user_info", JSON.stringify(res.data.user || null));
        localStorage.setItem("user_name", res.data.user?.prenom || "Utilisateur");
        setUser(res.data.user || null);
        navigate('/dashboard');
      } else {
        await axios.post("http://localhost:3000/api/auth/register", { 
          nom, prenom, email, telephone, password 
        });
        alert("Compte créé avec succès ! Veuillez vous connecter.");
        setIsLogin(true);
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col h-full border-r border-gray-100 overflow-hidden">
        
        <div className="mb-8 px-8 pt-6 pb-2">
          <a href="/">
            <div className="flex items-center gap-3 text-black">
              <span className="material-symbols-outlined !text-3xl">apartment</span>
              <h2 className="text-sm font-black uppercase tracking-tighter">ImmoPlateform</h2>
            </div>
          </a>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 max-w-[540px] mx-auto w-full overflow-y-auto pb-10">
          <div className="mb-4">
            <h1 className="text-3xl font-black tracking-tighter uppercase">
                {isLogin ? 'Bienvenue' : 'Créer un compte'}
            </h1>
            {error && <p className="text-red-500 text-[10px] font-black mt-2 uppercase tracking-widest bg-red-50 p-2 rounded">{error}</p>}
          </div>

          {/* Onglets */}
          <div className="mb-6">
            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => { setIsLogin(true); navigate('/login'); }} 
                className={`pb-2 flex-1 text-[11px] font-black uppercase tracking-widest transition-all ${isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}>
                Se connecter
              </button>
              <button 
                onClick={() => { setIsLogin(false); navigate('/login?mode=signup'); }} 
                className={`pb-2 flex-1 text-[11px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}>
                S'inscrire
              </button>
            </div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleAuth}>
            
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase tracking-widest">Nom</label>
                    <input 
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 text-sm outline-none focus:border-black transition-all" 
                        type="text" placeholder="EX: TRAORÉ" required 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase tracking-widest">Prénom</label>
                    <input 
                        onChange={(e) => setPrenom(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 text-sm outline-none focus:border-black transition-all" 
                        type="text" placeholder="EX: MAMADOU" required 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 animate-in fade-in duration-300">
                  <label className="text-[9px] font-black uppercase tracking-widest">Téléphone</label>
                  <input 
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 text-sm outline-none focus:border-black transition-all" 
                    type="tel" placeholder="+229 xx xx xx xx xx" required 
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest">Adresse email</label>
              <input 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 text-sm outline-none focus:border-black transition-all" 
                type="email" placeholder="nom@exemple.com" required 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest">Mot de passe</label>
              <div className="relative">
                <input 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 h-11 px-4 pr-12 text-sm outline-none focus:border-black transition-all" 
                    type={showPassword ? "text" : "password"} required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black">
                  <span className="material-symbols-outlined !text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-black text-white h-11 rounded-lg font-black uppercase text-xs tracking-[0.2em] mt-2 shadow-lg hover:bg-zinc-800 transition-all disabled:bg-gray-400"
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
            </button>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink-0 mx-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Ou continuer avec</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 text-[10px] font-bold uppercase tracking-widest transition-colors">
              <img src={GoogleLogo} className="w-3.5 h-3.5" alt="Google" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 text-[10px] font-bold uppercase tracking-widest transition-colors">
              <img src={FacebookLogo} className="w-3.5 h-3.5" alt="Facebook" /> Facebook
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] h-full relative overflow-hidden bg-black">
        <img 
          src={Immeuble} 
          alt="Immobilier de prestige" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        <div className="relative z-20 flex flex-col justify-end w-full h-full p-20 text-white">
          <div className="max-w-xl animate-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/20">
              <span className="material-symbols-outlined !text-lg">verified_user</span>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Sécurité & Excellence</span>
            </div>
            
            <h2 className="text-6xl font-black leading-tight mb-4 uppercase tracking-tighter">
              {isLogin ? 'Le prestige à portée de main.' : 'Rejoignez l\'excellence.'}
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed mb-10 font-medium">
              Découvrez une nouvelle façon de gérer et d'acquérir vos biens immobiliers avec ImmoPlateform.
            </p>

            <div className="flex gap-12 border-t border-white/20 pt-8">
              <div>
                <p className="text-3xl font-black uppercase">15k+</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Biens vendus</p>
              </div>
              <div>
                <p className="text-3xl font-black uppercase">98%</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-black uppercase">24/7</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Support Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}