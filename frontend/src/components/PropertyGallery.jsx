import React from 'react';

const PropertyGallery = ({ images }) => {
  return (
    <div className="mb-8 grid h-[500px] w-full grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
      <div className="relative col-span-1 md:col-span-2 md:row-span-2 overflow-hidden rounded-xl group cursor-pointer">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10"></div>
<div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${images?.[0] ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgUGDrtMCnQO7upe75Jmwtyc4XjQEQXY5qup_8NbGYc4K9VddDFBcNaNq5NPHRzqsLdxr2w2V13yMCi-luBrVPCWP6u_VxgUlwBroBOxK5w-bgV0JBzQ66b-PyMKEtOejVWqV6Gcv4T74LaxM0OFz-GHzEYn9buSaVQdP3iV2VvLCVsn2Ov8YSJI5thldUW9pV8UsrdfHGFYcDRZs3IpgsfF3XgTibQoOZMZ5tjC-zCmdxOy5P8dYVAFv1QxqtV6cJewu7AMBq0TLi'})` }}></div>
      </div>
      <div className="relative col-span-1 overflow-hidden rounded-xl group cursor-pointer">
<div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${images?.[1] ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg9eUJa_eekgz7mUIAd0chd6TIFfreKMR3826hjjD82Rote_DluS32jzJr3DFrqv6k_EnqpvCfSpDqcw6ELAo2r6scNNQ3BCWeABNC7CSVa25Ws0WHfcuHgmWTh1S5OWB4ZKade8AErJ_3HYgyzVlJXMnKjkvrhaWhgXJv0ZORLsMZnr-IMlap-ird3T2gl7IY4zmDVrqEe8GOQxJ3BF8uHA7EsJjvHKOSCZCqk9Zh_4-kgG81qu9zrdH6YqiYQVWltInFisAlz3VO'})` }}></div>
      </div>
      <div className="relative col-span-1 overflow-hidden rounded-xl group cursor-pointer">
<div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${images?.[2] ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzbUKUds0fq5hkNzU9sxV41gkB7MPG_YCwpuyCZ17dcTkjFWeU52UAgG8cHbwOpaHA_hK0pi0n5ewk3ipYKAU1LQDoQAsg8e8GgE7FfNLvrZAMnOpBjObTPh8Tkwc0a0i82HqfJTdolPAQOGyGOHJ2KNcvKefN-EEAXyE3InZ0gtxSYkZmi6aMdGgeoFvQ-yDDA7vnN3vKv_sx95kg_HBQKPZM2HpvIpJUXiAhqnabygv9U101SzIQBEsBdo30j1LNtgUtLUJgY21o'})` }}></div>
      </div>
      <div className="relative col-span-1 overflow-hidden rounded-xl group cursor-pointer">
<div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${images?.[3] ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoaCMTmkEWb0MB1pSdpK24DkNU95cfnj4SocNGMjfvgsp6Xtp6QTbKVRNZb58mVFUZ8O-vZ4fo769nJ1rw7GK6YsKVYsN4foTJNKXZtAyQVcjxBMHVO855Z8K0Zimdotc_4xT-xO2ye1hkqVptRfAv-vartnllhtIkoiZio0-pHR7MWedtj4BGv9n-aieuVnKdUamdE5gLWbSsJHP6RvKaqCZeJNcMmlKrKUn3YIPhYbs91DC2a7Ak68mAtFCmNpl-t7XoNrPJa5CA'})` }}></div>
      </div>
      <div className="relative col-span-1 overflow-hidden rounded-xl group cursor-pointer">
        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10 flex items-center justify-center">
          <button className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105">
            Voir les 24 photos
          </button>
        </div>
<div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${images?.[4] ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc2xo5jPDtReSID73xFnyxQRj6ibF2zQ9A1c-_wInY9IqAG5PaZgvrZdNxxmnoRGLgd4nLrNf9GKpTEmQ2XUvFh9OX-phUUfBXme8iRMlBN3Z-2YcnzZOl-q9v6_I13lmiywE3R0hEyDKRUs6GWaS97M4b_mPPfwYaJVXnNKr9wfAYWd9mNYhjvdYyOrU8GhmSIrOtQ8NDa4_LbShY_4WjF5JJVJABwKM8jkcZh1896wOomfLxzcnj7LOxnK3Jf3jNOtgnOzXZ61Z9'})` }}></div>
      </div>
    </div>
  );
};

export default PropertyGallery;