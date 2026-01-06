import { useState } from "react";
import axios from "axios";

function Register({ onClose, onLoginClick }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        nom,
        prenom,
        telephone,
        email,
        password,
      });

      if (response.status === 201) {
        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        onLoginClick();
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Inscription
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-gray-700 mb-2 font-bold text-sm">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ton nom"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-gray-700 mb-2 font-bold text-sm">
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="telephone" className="block text-gray-700 mb-2 font-bold text-sm">
              Téléphone
            </label>
            <input
              type="text"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Ton numéro"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-bold text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@domaine.com"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 font-bold text-sm">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded font-bold transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Déjà un compte ?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline font-bold"
            onClick={(e) => {
              e.preventDefault();
              onLoginClick();
            }}
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;