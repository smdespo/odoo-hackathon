import React from 'react';

const SafarSaathiLogin = () => {
  return (
    // min-h-screen ensures it fills the viewport. 
    // flex-col for mobile (stacked) and md:flex-row for desktop (side-by-side)
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F2EFE9] text-[#2D2926] font-sans">
      
      {/* --- Left Side: Brand Narrative --- */}
      {/* Hidden on mobile to keep the focus on login, or you can keep it as a hero section */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] p-12 lg:p-24 flex-col justify-between border-r border-[#E5E1D8] relative overflow-hidden">
        {/* Subtle background texture or glow can be added here */}
        <div className="z-10">
          <h1 className="text-2xl font-light tracking-[0.3em] uppercase">
            Safar<span className="italic font-serif normal-case tracking-normal text-3xl ml-1">Saathi</span>
          </h1>
        </div>

        <div className="max-w-xl z-10">
          <h2 className="text-5xl lg:text-7xl font-serif leading-[1.1] mb-8 animate-fade-in">
            Where curated <br /> journeys meet a <br /> 
            <span className="italic text-[#6B705C]">discerning</span> <br /> traveler.
          </h2>
          <div className="h-[1px] w-24 bg-[#2D2926] mb-6 opacity-20"></div>
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-60">
            — A Private Travel Collective, Est. 2026
          </p>
        </div>

        <div className="flex gap-8 text-[10px] tracking-[0.3em] uppercase opacity-40 z-10">
          <span className="hover:opacity-100 cursor-default transition-opacity">Udaipur</span>
          <span className="hover:opacity-100 cursor-default transition-opacity">Amalfi</span>
          <span className="hover:opacity-100 cursor-default transition-opacity">Kyoto</span>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-white md:bg-transparent">
        
        {/* Mobile Logo (Only visible on small screens) */}
        <div className="md:hidden mb-12 text-center">
          <h1 className="text-xl font-light tracking-[0.2em] uppercase">
            Safar<span className="italic font-serif normal-case tracking-normal text-2xl">Saathi</span>
          </h1>
        </div>

        <div className="w-full max-w-[400px] animate-slide-up">
          <header className="mb-10 lg:mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mb-3">Welcome Back</p>
            <h3 className="text-3xl lg:text-4xl font-serif tracking-tight text-[#1A1816]">Sign in to your account</h3>
          </header>

          <form className="space-y-8 lg:space-y-12">
            {/* Email Field */}
            <div className="relative group">
              <label className="text-[10px] tracking-[0.2em] uppercase opacity-50 block mb-1 group-focus-within:text-[#D4AF37] transition-colors">
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="you@luxetravel.com"
                className="w-full bg-transparent border-b border-[#D1CDC7] py-4 outline-none focus:border-[#2D2926] transition-all placeholder:text-[#C1BBB3] font-light text-lg"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] tracking-[0.2em] uppercase opacity-50 group-focus-within:text-[#D4AF37] transition-colors">
                  Password
                </label>
                <button type="button" className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity pb-1">
                  Show
                </button>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-[#D1CDC7] py-4 outline-none focus:border-[#2D2926] transition-all placeholder:text-[#C1BBB3] text-lg"
                required
              />
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button className="w-full bg-[#1A1816] text-white py-6 text-[11px] tracking-[0.4em] uppercase hover:bg-[#2D2926] active:scale-[0.98] transition-all flex justify-center items-center gap-3 group shadow-xl shadow-black/5">
                Sign In 
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </form>

          {/* Social / Link Footer */}
          <div className="mt-12 lg:mt-20 text-center">
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-[#E5E1D8]"></div>
              <span className="flex-shrink mx-6 text-[9px] tracking-[0.3em] uppercase opacity-30 font-bold">Member Portal</span>
              <div className="flex-grow border-t border-[#E5E1D8]"></div>
            </div>
            
            <p className="text-sm font-light text-[#2D2926]/70 mt-8">
              New to SafarSaathi? {' '}
              <a href="#" className="text-[#1A1816] font-normal border-b border-[#1A1816] pb-0.5 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
                Request an invite
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafarSaathiLogin;