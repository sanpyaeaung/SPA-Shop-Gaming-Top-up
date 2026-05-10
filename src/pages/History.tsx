import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatMMK, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CreditCard, ChevronRight, Clock, CheckCircle2, XCircle, History as HistoryIcon, Loader2 } from 'lucide-react';

export default function HistoryPage({ userData }: { userData: any }) {
  const [tab, setTab] = useState<'orders' | 'topups'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [topups, setTopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.uid) return;

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userData.uid),
      orderBy('createdAt', 'desc')
    );

    const topupsQuery = query(
      collection(db, 'topupRequests'),
      where('userId', '==', userData.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubOrders = onSnapshot(ordersQuery, (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubTopups = onSnapshot(topupsQuery, (snap) => {
      setTopups(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubOrders();
      unsubTopups();
    };
  }, [userData?.uid]);

  return (
    <div className="space-y-8 pb-32">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.2em]">Activity</h2>
          <h1 className="text-3xl font-black text-gray-100 mt-1 uppercase">Order History</h1>
        </div>
        <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green border border-brand-green/20">
          <HistoryIcon size={24} />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-purple-500/20 backdrop-blur-xl">
        <button
          onClick={() => setTab('orders')}
          className={cn(
            "flex-1 flex items-center justify-center space-x-3 py-4 rounded-2xl transition-all relative overflow-hidden group",
            tab === 'orders' ? "bg-brand-green text-black font-black" : "text-gray-500 font-bold"
          )}
        >
          <ShoppingBag size={20} className={cn(tab === 'orders' ? "" : "group-hover:text-white transition-colors")} />
          <span className="text-xs uppercase tracking-widest">Diamonds</span>
        </button>
        <button
          onClick={() => setTab('topups')}
          className={cn(
            "flex-1 flex items-center justify-center space-x-3 py-4 rounded-2xl transition-all relative overflow-hidden group",
            tab === 'topups' ? "bg-brand-green text-black font-black" : "text-gray-500 font-bold"
          )}
        >
          <CreditCard size={20} className={cn(tab === 'topups' ? "" : "group-hover:text-white transition-colors")} />
          <span className="text-xs uppercase tracking-widest">Wallet</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto text-brand-green" size={40} />
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-4">Fetching Data...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'orders' ? (
              <motion.div 
                key="orders" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 gap-4"
              >
                {orders.length === 0 ? (
                  <EmptyState message="No diamond orders yet" />
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="glass-card p-6 flex flex-col gap-4 relative group hover:border-brand-green/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-purple-900/40 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:border-brand-green/20 transition-colors">
                            <ShoppingBag size={24} className="text-brand-green" />
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-white uppercase tracking-tight">{order.gameName}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-t border-purple-500/10 pt-4">
                        <div className="space-y-1">
                          <p className="text-[9px] text-brand-green uppercase font-black tracking-[0.2em]">Pack / ID</p>
                          <p className="text-sm font-bold text-gray-200 uppercase truncate">
                            {order.itemName} <span className="text-gray-600 mx-1">|</span> {order.playerGameId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em]">Price</p>
                          <p className="text-xl font-black text-brand-green tracking-tighter">{formatMMK(order.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="topups" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 gap-4"
              >
                {topups.length === 0 ? (
                  <EmptyState message="No wallet requests yet" />
                ) : (
                  topups.map((req) => (
                    <div key={req.id} className="glass-card p-6 flex flex-col gap-4 relative group hover:border-brand-green/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg border border-purple-500/10",
                            req.method === 'KBZ Pay' ? "bg-blue-600 shadow-blue-600/20" : "bg-yellow-500 shadow-yellow-500/20"
                          )}>
                            {req.method[0]}
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-white uppercase tracking-tight">{req.method}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{new Date(req.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-t border-purple-500/10 pt-4">
                        <div className="space-y-1">
                          <p className="text-[9px] text-brand-green uppercase font-black tracking-[0.2em]">Tx ID / Name</p>
                          <p className="text-sm font-bold text-gray-200 uppercase truncate">
                            ...{req.transactionId.slice(-6)} <span className="text-gray-600 mx-1">|</span> {req.senderName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em]">Amount</p>
                          <p className="text-xl font-black text-brand-green tracking-tighter">+{formatMMK(req.amount)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]",
    completed: "bg-brand-green/10 text-brand-green border-brand-green/20 shadow-[0_0_10px_rgba(57,255,20,0.1)]",
    approved: "bg-brand-green/10 text-brand-green border-brand-green/20 shadow-[0_0_10px_rgba(57,255,20,0.1)]",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    failed: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
  };

  const icons: Record<string, any> = {
    pending: Clock,
    completed: CheckCircle2,
    approved: CheckCircle2,
    rejected: XCircle,
    failed: XCircle
  };

  const Icon = icons[status] || Clock;

  return (
    <div className={cn("flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest", styles[status])}>
      <Icon size={12} className={cn(status === 'pending' ? "animate-spin-slow" : "")} />
      <span>{status}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-24 glass-card border-dashed border-purple-500/20 bg-purple-900/5">
      <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700 border border-purple-500/10">
        <Clock size={32} />
      </div>
      <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">{message}</p>
    </div>
  );
}
