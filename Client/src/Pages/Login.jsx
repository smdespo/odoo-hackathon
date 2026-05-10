<<<<<<< HEAD
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
=======
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
>>>>>>> origin/Frontend_Aavishkar
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default SafarSaathiLogin;
=======
export default SafarSaathiAuth;
>>>>>>> origin/Frontend_Aavishkar
