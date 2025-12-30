
export default function SearchCard({ price, title, loc, img, exclusive, tag, favorite, agency, isPrivate }) {
    return (
      <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
        <a href="/details">
        <div className="relative h-56 overflow-hidden">
          <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 right-3">
            <button className={`size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors ${favorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
              <span className={`material-symbols-outlined !text-[20px] ${favorite ? 'fill-current' : ''}`}>favorite</span>
            </button>
          </div>
          {(exclusive || tag) && (
            <div className="absolute bottom-3 left-3">
              <span className={`px-2.5 py-1 rounded backdrop-blur-md text-white text-xs font-semibold ${exclusive ? 'bg-black/70' : 'bg-primary/90'}`}>
                {exclusive ? 'Exclusivité' : tag}
              </span>
            </div>
          )}
        </div>
  
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-primary">{price}</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Vente</span>
          </div>
          <h4 className="text-gray-900 font-semibold mb-1 truncate">{title}</h4>
          <p className="text-gray-500 text-sm mb-4 truncate">{loc}</p>
          
          <div className="flex items-center gap-4 mb-5 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <span className="material-symbols-outlined !text-[18px]">bed</span><span>2</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <span className="material-symbols-outlined !text-[18px]">shower</span><span>1</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <span className="material-symbols-outlined !text-[18px]">square_foot</span><span>65 m²</span>
            </div>
          </div>
  
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${isPrivate ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-700'}`}>
                {isPrivate ? 'PL' : <span className="material-symbols-outlined !text-sm">person</span>}
              </div>
              <span className="text-xs font-medium text-gray-900">{agency}</span>
            </div>
            <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-sm font-bold transition-all">
              Contacter
            </button>
          </div>
        </div>
        </a>
      </div>
    );
  }