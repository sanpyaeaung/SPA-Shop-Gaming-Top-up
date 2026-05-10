import { motion } from 'motion/react';
import { formatMMK } from '../lib/utils';
import { User, Mail, Shield, LogOut, MessageCircle, Info, ChevronRight, Gamepad2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage({ userData, logout }: { userData: any, logout: () => void }) {
  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col items-center text-center space-y-6 py-10 relative overflow-hidden mt-4">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl -z-10" />
        
        <div className="relative group cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-tr from-brand-purple via-brand-green to-brand-purple shadow-[0_0_40px_rgba(57,255,20,0.2)] group-hover:shadow-[0_0_60px_rgba(57,255,20,0.4)] transition-all duration-500 overflow-hidden"
          >
            <img src={userData?.photoURL} alt={userData?.displayName} className="w-full h-full object-cover rounded-[2.2rem]" />
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-black border-2 border-brand-green w-10 h-10 rounded-2xl flex items-center justify-center text-brand-green shadow-xl">
            <Shield size={20} fill="#39FF14" fillOpacity={0.1} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{userData?.displayName}</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{userData?.email}</p>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-brand-green font-black uppercase tracking-[0.25em] bg-brand-green/10 px-4 py-2 rounded-full border border-brand-green/20">
          <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
          <span>{userData?.role || 'Verified Member'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gradient-to-br from-[#1a0b2e] to-black p-8 rounded-[2.5rem] flex justify-between items-center border border-purple-500/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 blur-2xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-brand-green/10 transition-colors" />
          <div className="space-y-2 relative z-10">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Live Balance</p>
            <p className="text-4xl font-black text-brand-green tracking-tighter">{formatMMK(userData?.balance || 0)}</p>
          </div>
          <div className="w-16 h-16 bg-purple-900/40 rounded-3xl flex items-center justify-center text-brand-green border border-purple-500/20 group-hover:scale-110 transition-transform relative z-10">
            <Gamepad2 size={32} />
          </div>
        </div>

        <div className="glass-card divide-y divide-purple-500/10 overflow-hidden ring-1 ring-purple-500/5">
          <Link to="/reseller-guide">
            <ProfileLink icon={TrendingUp} label="Reseller Hub" sub="Maximize your profits" />
          </Link>
          <ProfileLink icon={MessageCircle} label="Contact Support" sub="Fast Respond 24/7" />
          <ProfileLink icon={Info} label="Terms of Service" sub="Read carefully" />
          <ProfileLink icon={Shield} label="Privacy Shield" sub="Your data is safe" />
        </div>

        <button 
          onClick={logout}
          className="w-full py-6 rounded-[2rem] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black flex items-center justify-center space-x-3 border border-red-500/20 transition-all uppercase tracking-[0.25em] text-xs shadow-xl "
        >
          <LogOut size={22} />
          <span>Exit Account</span>
        </button>
      </div>

      <p className="text-center text-[9px] text-gray-600 uppercase font-black tracking-[0.3em] pb-10">
        SPA-Shop • Ver 2.4.0 • Built for MM Gamers
      </p>
    </div>
  );
}

function ProfileLink({ icon: Icon, label, sub }: any) {
  return (
    <button className="w-full p-6 flex items-center justify-between hover:bg-purple-900/20 transition-all group relative overflow-hidden">
      <div className="flex items-center space-x-5">
        <div className="w-12 h-12 bg-purple-900/30 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-brand-green transition-colors border border-purple-500/10 group-hover:border-brand-green/30">
          <Icon size={24} />
        </div>
        <div className="text-left space-y-1">
          <p className="font-black text-xs uppercase tracking-widest text-gray-200 group-hover:text-white transition-colors">{label}</p>
          {sub && <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">{sub}</p>}
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-700 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
    </button>
  );
}
