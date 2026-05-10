import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GAMES } from '../constants';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatMMK, cn } from '../lib/utils';
import { ChevronLeft, Info, CheckCircle2, User, Loader2 } from 'lucide-react';

export default function GameDetail({ userData }: { userData: any }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = GAMES.find(g => g.id === gameId);

  const [id, setId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!game) return <div>Game not found</div>;

  const validateId = async () => {
    if (!id) return;
    if (game.requiresZone && !zoneId) {
      setError('Zone ID is required for Mobile Legends');
      return;
    }

    setValidating(true);
    setPlayerName(null);
    setError(null);
    
    try {
      const endpoint = `/api/validate/${game.id}/${id}${game.requiresZone ? `/${zoneId}` : ''}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok && data.playerName) {
        setPlayerName(data.playerName);
      } else {
        setError(data.error || 'Player not found. Check ID/Zone.');
        setPlayerName(null);
      }
    } catch (err) {
      setError('Connection error. Try again.');
      setPlayerName(null);
    } finally {
      setValidating(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedItem || !playerName || !id) return;
    
    const item = game.items.find(i => i.id === selectedItem)!;
    
    if (userData.balance < item.price) {
      setError('Insufficient balance. Please top up your wallet.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: userData.uid,
        gameId: game.id,
        gameName: game.name,
        playerGameId: `${id}${zoneId ? ` (${zoneId})` : ''}`,
        playerName: playerName,
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      
      navigate('/history');
    } catch (err: any) {
      setError('Failed to place order. Try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in slide-in-from-right duration-500">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-card hover:bg-white/20 transition-colors">
          <ChevronLeft />
        </button>
        <h1 className="text-xl font-bold">{game.name}</h1>
      </div>

      <section className="glass-card overflow-hidden">
        <img src={game.banner} alt={game.name} className="w-full h-32 object-cover" />
        <div className="p-4 flex items-center space-x-4 -mt-10 relative z-10">
          <img src={game.logo} alt={game.name} className="w-20 h-20 rounded-2xl border-4 border-brand-dark shadow-xl" />
          <div className="pt-8">
            <h2 className="font-bold text-lg">{game.name}</h2>
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <CheckCircle2 size={12} className="text-brand-green" />
              <span>Official Top-up</span>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase text-brand-green font-black ml-1 tracking-widest">User ID & Info</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter User ID" 
                  className={cn(
                    "bg-purple-900/30 border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-green text-sm transition-all",
                    game.requiresZone ? "w-2/3" : "flex-1"
                  )}
                />
                {game.requiresZone && (
                  <input 
                    type="text" 
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    placeholder="Zone" 
                    className="w-1/3 bg-purple-900/30 border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-green text-sm transition-all"
                  />
                )}
                <button 
                  onClick={validateId}
                  disabled={!id || (game.requiresZone && !zoneId) || validating}
                  className="bg-brand-purple hover:bg-brand-purple/80 px-4 rounded-xl font-bold flex items-center justify-center min-w-[60px] transition-all text-xs uppercase tracking-widest"
                >
                  {validating ? <Loader2 className="animate-spin" size={18} /> : 'Check'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase text-brand-green font-black ml-1 tracking-widest">Verification Result</label>
            <div className={cn(
              "bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 flex items-center justify-between min-h-[48px]",
              playerName ? "border-brand-green/40 shadow-[0_0_10px_rgba(57,255,20,0.1)]" : ""
            )}>
              <span className="text-sm text-gray-400 font-medium">Player:</span>
              <span className={cn(
                "text-sm font-black uppercase",
                playerName ? "text-brand-green" : "text-gray-500"
              )}>
                {playerName || 'Pending...'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2 p-3 bg-brand-purple/10 rounded-xl border border-brand-purple/20">
          <Info size={16} className="text-brand-purple shrink-0 mt-0.5" />
          <p className="text-[11px] text-purple-300 font-medium italic">
            ID မှန်မမှန် သေချာစွာ စစ်ဆေးပါ။ အကယ်၍ ID မှားယွင်းပါက ပြန်လည်တာဝန်ယူပေးမည် မဟုတ်ပါ။
          </p>
        </div>
      </section>

      {/* Step 2: Select Items */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2">Choose Diamond Pack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {game.items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={cn(
                "glass-card p-5 flex flex-col items-center gap-2 transition-all relative overflow-hidden group",
                selectedItem === item.id 
                  ? "border-brand-green bg-brand-green/10 shadow-[0_0_20px_rgba(57,255,20,0.2)]" 
                  : "hover:border-brand-green/40 bg-purple-900/20"
              )}
            >
              {item.amount > 500 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                  Popular
                </div>
              )}
              <div className="text-2xl font-black text-brand-green group-hover:scale-110 transition-transform">
                {item.amount} <span className="text-xs text-white">💎</span>
              </div>
              <div className="text-sm font-bold text-gray-100">{formatMMK(item.price)}</div>
              <div className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mt-1">Instant Delivery</div>
            </button>
          ))}
        </div>
      </section>

      {/* Summary & Pay */}
      <section className={cn(
        "fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-8 lg:right-12 z-40 transition-all duration-500 max-w-sm ml-auto",
        selectedItem ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}>
        <button
          onClick={handleOrder}
          disabled={submitting || !playerName}
          className="w-full bg-brand-green py-5 rounded-2xl text-black font-black text-lg hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50 disabled:grayscale"
        >
          {submitting ? <Loader2 className="animate-spin mx-auto" /> : <span>Purchase Now</span>}
        </button>
        {error && <div className="mt-2 p-2 bg-red-500/20 text-red-500 rounded-lg text-center text-xs font-bold uppercase border border-red-500/30">{error}</div>}
      </section>
    </div>
  );
}
