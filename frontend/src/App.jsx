import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarResults from './components/NavbarResults';
import Footer from './components/Footer';

// Pages Publiques
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import SearchResults from './pages/public/SearchResults';
import Details from './pages/public/PropertyDetails';

// Pages Privées (Dashboard)
import AgentDashboard from './pages/dashboard/AgentDashboard';
import PublishListing from './pages/dashboard/PublishListing';
import MyListing from './pages/dashboard/MyListings';
import Archives from './pages/dashboard/Archives';
import MyFavorites from './pages/dashboard/MyFavorites';
import Messages from './pages/dashboard/Messages';
import Parametres from './pages/dashboard/Parametres';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-background-dark">
        <Routes>
          {/* LOGIN : Pas de Navbar ni de Footer */}
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD AGENT : Structure autonome (Sidebar incluse) */}
          <Route path="/dashboard" element={<AgentDashboard />} />
          <Route path="/publishing" element={<PublishListing />} />
          <Route path="/annonces" element={<MyListing />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/favoris" element={<MyFavorites />} />
          <Route path="/parametres" element={<Parametres />} />

          <Route path="/details" element={<Details />} />

          {/* ACCUEIL */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />

          {/* RESULTATS DE RECHERCHE */}
          <Route
            path="/SearchResults"
            element={
              <>
                <NavbarResults />
                <SearchResults />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;