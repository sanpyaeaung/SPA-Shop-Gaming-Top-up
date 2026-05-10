import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { GAMES } from '../constants';
import { ChevronRight, Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Banner */}
      <section className="relative h-48 md:h-64 rounded-3xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent flex flex-col justify-end p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 text-brand-green bg-brand-green/10 w-fit px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Flame size={12} />
              <span>NEW TOPUP BUNDLES</span>
            </div>
            <h2 className="text-3xl font-bold">24/7 Gaming Top-up</h2>
            <p className="text-slate-300 text-sm">အမြန်ဆုံးနှင့် အလွယ်ကူဆုံး စိန်ဖြည့်သွင်းနိုင်ပါပြီ</p>
          </motion.div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-brand-green uppercase tracking-[0.2em]">Select Game</h3>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Total {GAMES.length} games</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                to={`/game/${game.id}`}
                className="group bg-purple-900/20 border-l-4 border-transparent hover:border-brand-green p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-purple-800/40 cursor-pointer glass-card"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-lg border border-purple-500/30 overflow-hidden shadow-inner shrink-0">
                  <img 
                    src={game.logo} 
                    alt={game.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg group-hover:text-brand-green transition-colors">{game.name}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-medium">Official Recharge</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all">
                  <ChevronRight size={18} className="text-brand-green" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-2 gap-4 pb-12">
        <div className="glass-card p-5 flex flex-col items-center text-center space-y-3 bg-gradient-to-br from-brand-purple/10 to-transparent">
          <div className="w-12 h-12 bg-[#39FF14]/10 rounded-full flex items-center justify-center text-brand-green shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">Safe & Secure</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Trusted by 10k+ gamers</p>
          </div>
        </div>
        <div className="glass-card p-5 flex flex-col items-center text-center space-y-3 bg-gradient-to-br from-brand-purple/10 to-transparent">
          <div className="w-12 h-12 bg-[#39FF14]/10 rounded-full flex items-center justify-center text-brand-green shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">Fast Delivery</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Instant 24/7 Service</p>
          </div>
        </div>
      </section>
    </div>
  );
}
