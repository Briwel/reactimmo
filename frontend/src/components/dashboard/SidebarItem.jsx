import { NavLink } from 'react-router-dom';

export const SidebarItem = ({ to, icon, label, badge }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
      isActive ? 'bg-blue-50 text-[#135bec] font-bold' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>
    )}
  </NavLink>
);