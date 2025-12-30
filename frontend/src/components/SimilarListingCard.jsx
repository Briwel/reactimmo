import React from 'react';

const SimilarListingCard = ({ data }) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
             style={{ backgroundImage: `url('${data.img}')` }}></div>
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900">{data.price}</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900">{data.title}</h3>
        <p className="text-sm text-slate-500">{data.size} • {data.rooms} pièces</p>
      </div>
    </div>
  );
};

export default SimilarListingCard;