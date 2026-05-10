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
        <div className="relative h-24">
          <img src={game.banner} alt={game.name} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent" />
        </div>
        <div className="p-4 flex items-center space-x-4 -mt-12 relative z-10">
          <div className="w-20 h-20 bg-brand-dark rounded-2xl p-1 shadow-2xl">
            <img src={game.logo} alt={game.name} className="w-full h-full rounded-xl object-contain bg-white/5" />
          </div>
          <div className="pt-6">
            <h2 className="font-black text-xl text-white uppercase tracking-tight">{game.name}</h2>
            <div className="flex items-center space-x-1 text-[10px] text-brand-green font-black uppercase tracking-widest">
              <CheckCircle2 size={12} />
              <span>Official Top-up</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card p-5 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-brand-green font-black ml-1 tracking-[0.2em]">Game Identity</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="User ID" 
                    className={cn(
                      "bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-green text-sm transition-all",
                      game.requiresZone ? "w-2/3" : "flex-1"
                    )}
                  />
                  {game.requiresZone && (
                    <input 
                      type="text" 
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="Zone" 
                      className="w-1/3 bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-green text-sm transition-all"
                    />
                  )}
                  <button 
                    onClick={validateId}
                    disabled={!id || (game.requiresZone && !zoneId) || validating}
                    className="bg-brand-purple hover:bg-brand-purple/80 px-4 rounded-xl font-bold flex items-center justify-center min-w-[60px] transition-all text-[10px] uppercase tracking-widest"
                  >
                    {validating ? <Loader2 className="animate-spin" size={16} /> : 'Check'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-brand-green font-black ml-1 tracking-[0.2em]">Verification</label>
                <div className={cn(
                  "bg-black/20 border border-purple-500/10 rounded-xl px-4 py-2.5 flex items-center justify-between min-h-[42px]",
                  playerName ? "border-brand-green/40 shadow-[0_0_10px_rgba(57,255,20,0.1)]" : ""
                )}>
                  <span className="text-[10px] text-gray-500 font-black uppercase">Name:</span>
                  <span className={cn(
                    "text-xs font-black uppercase tracking-tight",
                    playerName ? "text-brand-green" : "text-gray-600"
                  )}>
                    {playerName || 'Waiting...'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <ShoppingBag size={14} className="text-brand-green" />
              Available Diamond Packs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {game.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={cn(
                    "glass-card p-4 flex flex-col items-center gap-1 transition-all relative overflow-hidden group",
                    selectedItem === item.id 
                      ? "border-brand-green bg-brand-green/5 shadow-[0_0_15px_rgba(57,255,20,0.1)]" 
                      : "hover:border-white/10 bg-purple-900/5"
                  )}
                >
                  <div className="text-xl font-black text-white group-hover:scale-110 transition-transform">
                    {item.amount} <span className="text-[10px] text-brand-green">💎</span>
                  </div>
                  <div className="text-[11px] font-bold text-gray-400">{formatMMK(item.price)}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Order Panel */}
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4 sticky top-24">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Order Summary</h3>
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">Package:</span>
                  <span className="text-white font-black">{game.items.find(i => i.id === selectedItem)?.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">Total:</span>
                  <span className="text-brand-green font-black text-lg">{formatMMK(game.items.find(i => i.id === selectedItem)?.price || 0)}</span>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={submitting || !playerName}
                  className="w-full bg-brand-green py-4 rounded-xl text-black font-black text-sm hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all uppercase tracking-widest disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto text-black" size={20} /> : 'Process Checkout'}
                </button>
              </div>
            ) : (
              <p className="text-[10px] text-gray-600 font-black uppercase text-center py-10 tracking-widest italic">Please select diamonds to continue</p>
            )}
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-tight text-center">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
