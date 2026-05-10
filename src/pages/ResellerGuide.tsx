import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, TrendingUp, ShieldCheck, Zap, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

const SOURCES = [
  {
    name: 'Smile.One',
    url: 'https://www.smile.one/',
    description: 'The preferred official partner for bulk wholesale. Best profit margins for Mobile Legends.',
    tag: 'Recommended',
    color: 'bg-orange-500'
  },
  {
    name: 'Moogold',
    url: 'https://moogold.com/',
    description: 'International prices, very stable and reliable. Good for PUBG and Free Fire.',
    tag: 'Global',
    color: 'bg-blue-500'
  },
  {
    name: 'LapakGaming',
    url: 'https://www.lapakgaming.com/',
    description: 'extremely cheap prices from Indonesia. Great for professional resellers.',
    tag: 'Cheap',
    color: 'bg-brand-green'
  },
  {
    name: 'Kyats Shop',
    url: 'https://kyats.shop/',
    description: 'Local Myanmar aggregator with competitive local rates and KBZ Pay support.',
    tag: 'Local MM',
    color: 'bg-yellow-500'
  }
];

export default function ResellerGuide() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-32">
      <header className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft />
        </button>
        <div>
          <h2 className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Business Hub</h2>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Reseller Guide</h1>
        </div>
      </header>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-brand-purple to-[#2d0b5a] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3 text-brand-green">
            <TrendingUp size={24} />
            <span className="font-black uppercase tracking-widest text-xs">Maximize Profit</span>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed font-medium">
            အမြတ်အများဆုံးရရှိနိုင်မယ့် Diamond ရင်းမြစ်တွေကို စုစည်းပေးထားပါတယ်။ Reseller တစ်ယောက်အနေနဲ့ ဈေးနှုန်းအနှိမ့်ဆုံးနေရာတွေမှာ ဝယ်ယူပြီး ဒီ App ကနေတစ်ဆင့် ပြန်လည်ရောင်းချနိုင်ပါတယ်။
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
          <ShieldCheck size={14} className="text-brand-green" />
          Reliable Suppliers
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {SOURCES.map((source, idx) => (
            <motion.a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 flex items-center justify-between group hover:border-brand-green/30 transition-all bg-purple-900/5"
            >
              <div className="flex items-center space-x-5">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", source.color)}>
                  <Zap size={24} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-white uppercase tracking-tight">{source.name}</span>
                    <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-widest text-gray-400 border border-white/5">{source.tag}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold max-w-[200px] leading-snug">{source.description}</p>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-brand-green group-hover:text-black transition-all">
                <ExternalLink size={18} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Strategy Tips */}
      <div className="glass-card p-8 space-y-6 border-dashed border-brand-green/20">
        <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <DollarSign size={16} className="text-brand-green" />
          Profit Strategy
        </h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 font-black text-xs">1</div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Smile.one မှာ <span className="text-brand-green">Reseller Account</span> လျှောက်ထားပါ။ အဲ့ဒါမှ ပုံမှန်ထက်ဈေးသက်သာတဲ့ Wholesale Rates နဲ့ ဝယ်ယူနိုင်မှာပါ။
            </p>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 font-black text-xs">2</div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Lapakgaming (Indonesia) ကို သုံးမယ်ဆိုရင် <span className="text-brand-green">Wallet</span> ထဲ ငွေအရင်ဖြည့်ထားခြင်းက Transaction fee ကို သက်သာစေပါတယ်။
            </p>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 font-black text-xs">3</div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              ကျပ်ငွေဈေးအတက်အကျကို နေ့စဥ်စောင့်ကြည့်ပါ။ ဈေးနှုန်းအပြောင်းအလဲပေါ်မူတည်ပြီး သင့်ရဲ့ App မှာ <span className="text-brand-green">Admin Panel</span> ကနေ ဈေးနှုန်းတွေကို အချိန်နဲ့တစ်ပြေးညီ ပြင်ဆင်ပါ။
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
