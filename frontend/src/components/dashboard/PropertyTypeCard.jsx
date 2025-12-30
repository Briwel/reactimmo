export const PropertyTypeCard = ({ icon, label, name, value, defaultChecked }) => (
    <label className="cursor-pointer group relative">
      <input 
        defaultChecked={defaultChecked} 
        className="peer sr-only" 
        name={name} 
        type="radio" 
        value={value}
      />
      <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#e7ebf3] bg-white hover:border-[#135bec]/50 peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 transition-all h-full">
        <span className="material-symbols-outlined text-3xl mb-2 text-gray-400 peer-checked:text-[#135bec] group-hover:text-[#135bec]/70">
          {icon}
        </span>
        <span className="text-sm font-medium text-gray-600 peer-checked:text-[#135bec]">
          {label}
        </span>
      </div>
    </label>
  );