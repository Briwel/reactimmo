import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const DashboardHeader = ({ title = "Tableau de bord" }) => {
  // 2. États pour gérer l'ouverture du menu et les notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = () => localStorage.getItem('token');

  const fetchNotifications = React.useCallback(async () => {
    const t = token();
    if (!t) return; // Pas d'utilisateur connecté
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/notifications/mine', { headers: { Authorization: `Bearer ${t}` } });
      setNotifications(res.data || []);
    } catch (e) {
      console.error('Impossible de récupérer les notifications', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    const t = token();
    if (!t) return;
    try {
      await axios.patch(`http://localhost:3000/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${t}` } });
      setNotifications((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error('Erreur markRead', e);
    }
  };

  const markAllRead = async () => {
    const t = token();
    if (!t) return;
    try {
      await axios.patch('http://localhost:3000/api/notifications/read-all', {}, { headers: { Authorization: `Bearer ${t}` } });
      setNotifications((s) => s.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error('Erreur markAllRead', e);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <input 
            className="h-10 w-64 rounded-lg border-none bg-slate-100 px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-[#135bec]" 
            placeholder="Rechercher..." 
            type="text"
          />
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400">search</span>
        </div>
        
        {/* 3. Conteneur relatif pour positionner le menu par rapport au bouton */}
        <div className="relative">
          <button 
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); if (!isNotificationsOpen) fetchNotifications(); }}
            className={`flex size-10 items-center justify-center rounded-lg text-slate-900 transition-colors ${
                isNotificationsOpen ? 'bg-slate-200' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] px-1 text-[11px] text-white bg-red-500 rounded-full border border-white text-center">{unreadCount}</span>
            )}
          </button>

          {/* 4. Le bloc de notifications (Dropdown) */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Notifications</span>
                <button onClick={markAllRead} className="text-xs text-[#135bec] hover:underline">Tout marquer comme lu</button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {loading && <div className="p-4 text-center text-sm text-slate-500">Chargement...</div>}
                {!loading && notifications.length === 0 && (
                  <div className="p-4 text-center text-sm text-slate-500">Aucune notification</div>
                )}
                {notifications.map((notif) => (
                  <div key={notif.id} onClick={() => markRead(notif.id)} className={`p-4 flex gap-3 cursor-pointer border-b border-slate-50 ${notif.read ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-blue-600 text-sm">mail</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-800"><span className="font-medium">{notif.title}</span></p>
                      {notif.body && <p className="text-xs text-slate-400 line-clamp-2 mt-1">{notif.body}</p>}
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 text-center border-t border-slate-100">
                <button className="text-sm text-slate-500 hover:text-slate-900 cursor-pointer">Voir tout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};