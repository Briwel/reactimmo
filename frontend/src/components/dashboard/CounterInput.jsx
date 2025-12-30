export const CounterInput = ({ label, value }) => (
    <div>
      <label className="block text-[#0d121b] text-sm font-bold mb-2">{label}</label>
      <div className="relative">
        <button className="absolute left-1 top-1 bottom-1 w-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded bg-transparent" type="button">
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <input 
          className="block w-full px-12 py-3 text-center border border-gray-200 rounded-lg bg-white focus:ring-[#135bec] focus:border-[#135bec] text-[#0d121b]" 
          type="number" 
          defaultValue={value} 
        />
        <button className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded bg-transparent" type="button">
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>
    </div>
  );