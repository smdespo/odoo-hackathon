import React, { useState } from 'react';
import { Plane, MapPin, Globe, ArrowRight, Shield } from 'lucide-react';

const SafarSaathiAuth = () => {
  // 1. Navigation State
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0A0908] font-sans">
      
      {/* --- Background Layer with Smooth Transition --- */}
      <div className="absolute inset-0 z-0">
        {/* Login Image */}
        <img 
          src="/Lake-Pichola.webp"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLogin ? 'opacity-100' : 'opacity-0'}`}
          alt="Login BG"
        />
        {/* Signup Image (Change the URL to your second image) */}
        <img 
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${!isLogin ? 'opacity-100' : 'opacity-0'}`}
          alt="Signup BG"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70" />
      </div>

      {/* Logo */}
      <div className="absolute top-4 left-10 hidden md:flex items-center gap-3 text-white/80 z-20">
        <img 
          src="/SafarSaathi_2.png"
          className='w-6 h-6 rounded-full object-cover border-2 border-[#D4AF37]'
        />
        <span className="text-[10px] tracking-[0.3em] uppercase">SafarSaathi</span>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Brand Narrative (Fades away on Signup) */}
        <div className={`text-white md:w-1/2 transition-all duration-700 ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">Est. 2026</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-serif mb-6 leading-none">
            Escape to <br />
            <span className="italic font-light">the sublime.</span>
          </h1>
          <p className="max-w-md text-white/70 text-lg font-light leading-relaxed mb-8">
            Access your private itinerary, curated stays, and 24/7 concierge assistance.
          </p>
        </div>

        {/* Right Side: Auth Card (Slides Left on Signup) */}
        <div className={`w-full max-w-[450px] transition-all duration-1000 ease-in-out ${isLogin ? 'md:translate-x-0' : 'md:-translate-x-[110%]'}`}>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-2xl shadow-2xl">
            
            <div className="mb-10 text-center">
              <h2 className="text-white text-2xl font-serif mb-2">
                {isLogin ? 'Member Login' : 'Create Account'}
              </h2>
              <p className="text-white/50 text-xs tracking-widest uppercase">
                {isLogin ? 'Welcome back, Traveler' : 'Join the elite collective'}
              </p>
            </div>

            <form className="space-y-6">
              {/* Conditional Name Field for Signup */}
              {/* Full Name Field with Smooth Expansion */}
              <div className={`grid transition-all duration-500 ease-in-out ${!isLogin ? 'grid-rows-[1fr] opacity-100 mb-5' : 'grid-rows-[0fr] opacity-0 mb-0'}`}>
                <div className="overflow-hidden">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/60 text-left">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Safar Saathi" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-4 text-white outline-none focus:border-[#D4AF37] transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-white/60 text-left">Email Address</label>
                <input type="email" placeholder="nomad@safarsaathi.com" className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-4 text-white outline-none focus:border-[#D4AF37]" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase tracking-widest text-white/60">Password</label>
                  {isLogin && <button type="button" className="text-[9px] uppercase text-[#D4AF37] hover:underline">Forgot?</button>}
                </div>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-4 text-white outline-none focus:border-[#D4AF37]" />
              </div>

              <button className="w-full bg-[#D4AF37] hover:bg-[#b8962d] text-[#1A1816] font-bold py-4 rounded-lg uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
                {isLogin ? 'Begin Journey' : 'Request Membership'}
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-white/50 text-sm font-light">
                {isLogin ? "Don't have an account?" : "Already a member?"} {' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-white hover:text-[#D4AF37] transition-colors border-b border-white/30"
                >
                  {isLogin ? 'Apply for Membership' : 'Back to Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Footer remains same --- */}
      <div className="absolute bottom-7 w-full hidden md:flex justify-evenly gap-12 text-white/30 text-[9px] tracking-[0.5em] uppercase">
        <span className="flex items-center gap-2"><Globe size={12}/> Global Access</span>
        <span className="flex items-center gap-2"><Plane size={12}/> Seamless Transit</span>
        <span className="flex items-center gap-2"><Shield size={12}/> Privacy Policy</span>
      </div>
    </div>
  );
};

export default SafarSaathiAuth;