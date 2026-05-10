import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { formatMMK, cn } from '../lib/utils';
import { Wallet, Landmark, Copy, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function WalletPage({ userData }: { userData: any }) {
  const [settings, setSettings] = useState<any>(null);
  const [method, setMethod] = useState<'KBZ Pay' | 'Wave Money'>('KBZ Pay');
  const [amount, setAmount] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [txId, setTxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const snap = await getDoc(doc(db, 'settings', 'config'));
      if (snap.exists()) {
        setSettings(snap.data());
      } else {
        // Fallback or Initial setup
        setSettings({
          kbzPayName: 'U Kyaw Swar',
          kbzPayNumber: '09791234567',
          waveMoneyName: 'K-Shop Admin',
          waveMoneyNumber: '09791234567'
        });
      }
    };
    fetchSettings();
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !txId) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'topupRequests'), {
        userId: userData.uid,
        userName: userData.displayName,
        method,
        amount: Number(amount),
        transactionId: txId,
        senderPhone,
        senderName,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      setAmount('');
      setTxId('');
      setSenderName('');
      setSenderPhone('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.2em]">My Wallet</h2>
          <h1 className="text-3xl font-black text-gray-100 mt-1 uppercase">Top-up Balance</h1>
        </div>
        <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green border border-brand-green/20">
          <Wallet size={24} />
        </div>
      </header>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-brand-purple to-[#2d0b5a] p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(45,11,90,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-green/10 transition-colors" />
        <div className="relative z-10">
          <p className="text-white/60 text-xs font-black uppercase tracking-widest">Available Balance</p>
          <div className="text-4xl font-black text-white mt-2 tracking-tighter">
            {formatMMK(userData?.balance || 0)}
          </div>
          <div className="mt-6 flex items-center space-x-2 text-[10px] text-brand-green bg-black/30 w-fit px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/5">
            <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
            <span>Active Account</span>
          </div>
        </div>
      </div>

      {!success ? (
        <section className="space-y-8">
          {/* Methods */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'KBZ Pay', num: settings?.kbzPayNumber, name: settings?.kbzPayName },
                { id: 'Wave Money', num: settings?.waveMoneyNumber, name: settings?.waveMoneyName }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={cn(
                    "glass-card p-6 flex items-center gap-4 transition-all relative group text-left w-full",
                    method === m.id 
                      ? "border-brand-green bg-brand-green/10 shadow-[0_0_20px_rgba(57,255,20,0.15)] scale-[1.02]" 
                      : "hover:border-purple-500/30 opacity-70"
                  )}
                >
                  <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border border-purple-500/20 group-hover:border-brand-green/30 transition-colors shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-black text-white",
                      m.id === 'KBZ Pay' ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                    )}>
                      {m.id[0]}
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-1">{m.id}</div>
                    <div className="text-lg font-black text-white tracking-tighter truncate">{m.num || '...'}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase truncate">{m.name}</div>
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(m.num || '', m.id); }}
                    className="p-3 bg-white/5 hover:bg-brand-green hover:text-black rounded-xl transition-all cursor-pointer"
                  >
                    {copied === m.id ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Topup Form */}
          <form onSubmit={handleRequest} className="glass-card p-8 space-y-8 bg-purple-900/10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1 text-center">Submit Transaction Info</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-brand-green uppercase tracking-widest ml-1">Transfer Amount (MMK)</label>
                  <input 
                    type="number" 
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full bg-purple-900/30 border border-purple-500/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green text-lg font-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-brand-green uppercase tracking-widest ml-1">Transaction ID (Last 6 digits)</label>
                  <input 
                    type="text" 
                    required
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="Last 6 digits"
                    className="w-full bg-purple-900/30 border border-purple-500/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green text-lg font-black transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-brand-green uppercase tracking-widest ml-1">Sender Name (Optional)</label>
                  <input 
                    type="text" 
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Name in K-Pay"
                    className="w-full bg-purple-900/10 border border-purple-500/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green text-sm font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-brand-green uppercase tracking-widest ml-1">Sender Phone (Optional)</label>
                  <input 
                    type="text" 
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full bg-purple-900/10 border border-purple-500/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green text-sm font-bold transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !amount || !txId}
                className="w-full bg-brand-green py-5 rounded-[1.5rem] text-black font-black text-lg hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50 disabled:grayscale"
              >
                {submitting ? <Loader2 className="animate-spin mx-auto" /> : <span>Confirm Deposit</span>}
              </button>

              <div className="flex items-start space-x-3 p-4 bg-brand-purple/10 rounded-2xl border border-brand-purple/20">
                <AlertCircle size={20} className="text-brand-purple shrink-0 mt-0.5" />
                <p className="text-[11px] text-purple-300 font-medium leading-relaxed italic">
                  ငွေသွင်းပြီးနောက် မိနစ် ၂၀ အတွင်း ငွေမဝင်လာပါက Admin Team ကို ဆက်သွယ်မေးမြန်းနိုင်ပါသည်။ ကျေးဇူးတင်ပါတယ်။
                </p>
              </div>
            </div>
          </form>
        </section>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center space-y-6 bg-brand-green/5 border-brand-green/30"
        >
          <div className="w-20 h-20 bg-brand-green text-black rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.4)]">
            <CheckCircle size={40} strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider">Deposit Requested!</h3>
            <p className="text-brand-green font-bold text-sm mt-2">
              Admin မှ စစ်ဆေးပြီးနောက် သင့် Wallet ထဲသို့ ငွေများ ရောက်ရှိလာပါမည်။
            </p>
          </div>
          <button 
            onClick={() => setSuccess(false)}
            className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            New Request
          </button>
        </motion.div>
      )}
    </div>
  );
}
