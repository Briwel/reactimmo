import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

const Messages = () => {
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 1. Historique des messages mis à jour
  const [messagesHistory, setMessagesHistory] = useState({
    1: [
      { id: 101, text: "Bonjour, la résidence à Abidjan est-elle encore disponible ?", sender: "them", time: "10:42" },
      { id: 102, text: "Bonjour Mamadou ! Oui, tout à fait. Elle est libre pour une visite.", sender: "me", time: "10:45" }
    ],
    2: [
      { id: 201, text: "Le duplex à Dakar est magnifique, merci pour les photos !", sender: "them", time: "Hier" }
    ],
    3: [
      { id: 301, text: "Est-ce que le loyer inclut les charges d'entretien ?", sender: "them", time: "2 jours" }
    ]
  });

  // 2. Liste des contacts (Profils diversifiés)
  const chatList = [
    { 
        id: 1, 
        name: "Mamadou Traoré", 
        property: "Villa Riviera", 
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", 
        online: true, 
        price: "750 000 FCFA", 
        email: "m.traore@email.com", 
        phone: "+225 07 08 09 10 11", 
        unread: false 
    },
    { 
        id: 2, 
        name: "Awa Diop", 
        property: "Appart Plateau", 
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop", 
        online: false, 
        price: "450 000 FCFA", 
        email: "awa.diop@email.sn", 
        phone: "+221 77 123 45 67", 
        unread: true 
    },
    { 
        id: 3, 
        name: "Koffi Mensah", 
        property: "Duplex Cocody", 
        avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=200&auto=format&fit=crop", 
        online: false, 
        price: "1 200 000 FCFA", 
        email: "koffi.m@email.tg", 
        phone: "+228 90 12 34 56", 
        unread: false 
    }
  ];

  const activeChat = chatList.find(c => c.id === selectedChatId);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [selectedChatId, messagesHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesHistory(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    setMessageText("");
  };

  const getLastMessage = (id) => {
    const history = messagesHistory[id];
    if (!history || history.length === 0) return "Aucun message";
    const last = history[history.length - 1];
    return last.sender === "me" ? `Vous : ${last.text}` : last.text;
  };

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      <Sidebar activePage="messages" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Messagerie" />

        <main className="flex flex-1 overflow-hidden bg-white">
          
          {/* 1. LISTE DES DISCUSSIONS */}
          <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg uppercase tracking-tight">Discussions</h3>
                <button onClick={() => alert("Nouveau message")} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-primary transition-all active:scale-90">
                  <span className="material-symbols-outlined text-[20px]">edit_square</span>
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                <input 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Rechercher..." 
                  type="text"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chatList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-4 ${selectedChatId === chat.id ? 'border-primary bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}
                >
                  <div className="relative shrink-0">
                    <img src={chat.avatar} alt="" className="size-12 rounded-full object-cover border-2 border-slate-100" />
                    {chat.online && <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className={`text-sm truncate ${chat.unread && selectedChatId !== chat.id ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                        {chat.name}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">
                        {messagesHistory[chat.id][messagesHistory[chat.id].length - 1]?.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate mb-1 ${chat.unread && selectedChatId !== chat.id ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                      {getLastMessage(chat.id)}
                    </p>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500">
                      {chat.property}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. ZONE DE CHAT CENTRALE */}
          <div className="flex flex-col flex-1 bg-slate-50 relative">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <img src={activeChat.avatar} className="size-10 rounded-full object-cover" alt="" />
                <div>
                  <h3 className="font-bold text-slate-900">{activeChat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`size-1.5 rounded-full ${activeChat.online ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">En ligne</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => alert(`Appel vers ${activeChat.name}`)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">call</span></button>
                <button onClick={() => alert(`Vidéo avec ${activeChat.name}`)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">videocam</span></button>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <button onClick={() => setShowDetails(!showDetails)} className={`p-2 rounded-full ${showDetails ? 'bg-blue-100 text-primary' : 'text-slate-400'}`}>
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messagesHistory[selectedChatId]?.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} gap-4 max-w-2xl ${msg.sender === 'me' ? 'ml-auto' : ''}`}>
                  <div className={`flex flex-col gap-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.sender === 'me' ? 'bg-primary text-white rounded-tr-none shadow-blue-500/20 shadow-lg' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-end gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <button type="button" onClick={() => alert("Joindre un fichier")} className="p-2 text-slate-400 hover:text-primary"><span className="material-symbols-outlined">add_circle</span></button>
                <textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
                  className="w-full bg-transparent border-none p-2 text-sm text-slate-900 placeholder-slate-400 focus:ring-0 resize-none" 
                  placeholder="Écrivez à votre client..." 
                  rows="1"
                ></textarea>
                <button type="submit" className="p-3 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-all active:scale-90">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </form>
          </div>

          {/* 3. PANNEAU DÉTAILS DROITE */}
          {showDetails && (
            <div className="hidden xl:flex w-80 flex-col border-l border-slate-200 bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Fiche client</h3>
                  <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
                
                <div className="rounded-xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
                  <div className="h-32 bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400')" }}></div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-slate-900">{activeChat.property}</h4>
                    <p className="text-[10px] font-bold text-primary uppercase">{activeChat.price}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Coordonnées</h4>
                    <div className="space-y-3">
                      <button onClick={() => window.location.href = `mailto:${activeChat.email}`} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-all group text-left">
                        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">mail</span></div>
                        <p className="text-xs font-bold text-slate-700 truncate">{activeChat.email}</p>
                      </button>
                      <button onClick={() => alert(`Appel vers ${activeChat.phone}`)} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-all group text-left">
                        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">phone</span></div>
                        <p className="text-xs font-bold text-slate-700">{activeChat.phone}</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Notes privées</h4>
                    <textarea 
                      className="w-full rounded-lg border-slate-200 text-xs font-medium p-3 h-24 resize-none bg-yellow-50/30 text-slate-700 focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="Note sur Mamadou..."
                    ></textarea>
                    <button onClick={() => alert("Note enregistrée")} className="w-full mt-2 py-2 text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-lg">Mettre à jour</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;