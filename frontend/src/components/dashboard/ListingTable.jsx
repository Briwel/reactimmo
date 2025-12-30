export const ListingTable = ({ listings }) => (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-[#1e293b] dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-6 py-4">Bien immobilier</th>
              <th className="px-6 py-4">Prix</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {listings.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium">
                  <div className="flex gap-3">
                    <img src={item.img} className="h-12 w-16 rounded object-cover" alt={item.name} />
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                      <span className="text-xs text-slate-500">{item.loc}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 dark:text-slate-300">{item.price}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.sClass}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );