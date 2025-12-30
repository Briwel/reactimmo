export default function PropertyCard({ price, title, location, beds, baths, size, tag, tagColor, image }) {
    return (
      <article className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <a href="/details">
        <div className="relative h-64 overflow-hidden">
          {tag && (
            <div className={`absolute top-3 left-3 ${tagColor} text-white text-xs font-bold px-2 py-1 rounded`}>
              {tag}
            </div>
          )}
          <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-xl">favorite_border</span>
          </button>
          <div 
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        </div>
        
        <div className="flex flex-col p-5 gap-3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-black">{price}</h3>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Bien</span>
          </div>
          <div>
            <p className="text-base font-semibold text-black line-clamp-1">{title}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined !text-base">location_on</span> {location}
            </p>
          </div>
          <div className="flex items-center gap-4 py-3 border-t border-gray-50 mt-auto">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span className="material-symbols-outlined">bed</span> {beds}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span className="material-symbols-outlined">bathtub</span> {baths}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span className="material-symbols-outlined">square_foot</span> {size}
            </div>
          </div>
        </div>
        </a>
      </article>
    );
  }