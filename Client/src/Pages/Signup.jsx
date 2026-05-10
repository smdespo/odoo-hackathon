import React, { useState } from 'react';
import { Plane, MapPin, Globe, ArrowRight, ShieldCheck, UserPlus, Mail, Lock, User } from 'lucide-react';

const SafarSaathiAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0A0908] font-sans">
      
      {/* --- Smooth Background Transition --- */}
      <div className="absolute inset-0 z-0">
        {/* Background 1: Login (Udaipur) */}
        <img 
          src="/Lake-Pichola.webp" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isLogin ? 'opacity-100' : 'opacity-0'}`}
          alt="Login Background"
        />
        {/* Background 2: Signup (Change this to your second image) */}
        <img 
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${!isLogin ? 'opacity-100' : 'opacity-0'}`}
          alt="Signup Background"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Brand Narrative */}
        <div className={`text-white md:w-1/2 transition-all duration-700 ease-in-out ${isLogin ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold">Est. 2026</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-serif mb-6 leading-tight">
            Escape to <br /> <span className="italic font-light">the sublime.</span>
          </h1>
          <p className="max-w-md text-white/80 text-lg font-light leading-relaxed">
            Access your private itinerary and curated global stays.
          </p>
        </div>

        {/* Right Side: Sliding Auth Card */}
        <div className={`w-full max-w-[420px] transition-all duration-700 ease-in-out ${isLogin ? 'translate-x-0' : 'md:-translate-x-[120%]'}`}>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl">
            
            {/* Header Toggle */}
            <div className="mb-8">
              <h2 className="text-white text-2xl font-serif mb-1">
                {isLogin ? 'Member Login' : 'Join the Collective'}
              </h2>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold">
                {isLogin ? 'Welcome back, traveler' : 'Begin your private membership'}
              </p>
            </div>

            <form className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/50 text-left">Full Name</label>
                  <input type="text" placeholder="Aavishkar" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-left outline-none focus:border-[#D4AF37]" />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/50 text-left">Email Address</label>
                <input type="email" placeholder="nomad@safarsaathi.com" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-left outline-none focus:border-[#D4AF37]" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/50">Password</label>
                  {isLogin && <button type="button" className="text-[9px] uppercase text-[#D4AF37] font-bold">Forgot?</button>}
                </div>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-left outline-none focus:border-[#D4AF37]" />
              </div>

              <button className="w-full bg-[#D4AF37] hover:bg-[#C19A2D] text-black font-bold py-4 rounded-lg uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-4">
                {isLogin ? 'Begin Journey' : 'Request Membership'}
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Footer Toggle Link */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-white/40 text-sm font-light">
                {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-white hover:text-[#D4AF37] border-b border-white/20 pb-0.5 transition-colors font-medium"
                >
                  {isLogin ? 'Apply for Membership' : 'Log in here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Footer Links --- */}
      <div className="absolute bottom-8 w-full hidden md:flex justify-center gap-12 text-white/30 text-[9px] tracking-[0.4em] uppercase">
        <span className="flex items-center gap-2"><Globe size={12}/> Global Access</span>
        <span className="flex items-center gap-2"><ShieldCheck size={12}/> Privacy Policy</span>
        <span className="flex items-center gap-2">Made with ❤️ by SafarSaathi</span>
      </div>
    </div>
  );
};

export default SafarSaathiAuth;