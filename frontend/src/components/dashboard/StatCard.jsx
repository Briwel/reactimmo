export const StatCard = ({ title, value, icon, trend, subValue }) => (
  <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <span className="material-symbols-outlined text-[#135bec] bg-blue-50 p-1.5 rounded-lg text-[20px]">
        {icon}
      </span>
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    {trend ? (
      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
        <span className="material-symbols-outlined text-[14px]">trending_up</span>
        <span>{trend}</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded-full">
        <span>{subValue}</span>
      </div>
    )}
  </div>
);