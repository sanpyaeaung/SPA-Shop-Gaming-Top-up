import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  runTransaction,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatMMK, cn } from '../lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Settings, 
  Users, 
  Wallet, 
  ShoppingBag,
  Bell,
  Save,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'topups' | 'orders' | 'settings'>('topups');
  const [topups, setTopups] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    kbzPayName: '',
    kbzPayNumber: '',
    waveMoneyName: '',
    waveMoneyNumber: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const unsubTopups = onSnapshot(
      query(collection(db, 'topupRequests'), orderBy('createdAt', 'desc')),
      (snap) => setTopups(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );

    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snap) => setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );

    const unsubSettings = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });

    return () => {
      unsubTopups();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  const approveTopup = async (request: any) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', request.userId);
        const requestRef = doc(db, 'topupRequests', request.id);
        
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw "User not found";

        const newBalance = (userSnap.data().balance || 0) + request.amount;
        
        transaction.update(userRef, { balance: newBalance });
        transaction.update(requestRef, { 
          status: 'approved', 
          processedAt: new Date().toISOString() 
        });
      });
      alert('Top-up approved successfully!');
    } catch (err) {
      console.error(err);
      alert('Approval failed.');
    }
  };

  const rejectTopup = async (requestId: string) => {
    await updateDoc(doc(db, 'topupRequests', requestId), {
      status: 'rejected',
      processedAt: new Date().toISOString()
    });
  };

  const completeOrder = async (orderId: string, orderPrice: number, userId: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId);
        const orderRef = doc(db, 'orders', orderId);
        
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw "User not found";

        const currentBalance = userSnap.data().balance || 0;
        if (currentBalance < orderPrice) throw "Insufficient user balance";

        transaction.update(userRef, { balance: currentBalance - orderPrice });
        transaction.update(orderRef, { status: 'completed' });
      });
      alert('Order marked as completed!');
    } catch (err) {
      console.error(err);
      alert('Failed to complete order.');
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'config'), settings);
      alert('Settings updated!');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <ShieldCheck className="text-brand-green" />
          <span>Admin Control Panel</span>
        </h1>
        <div className="relative">
          <Bell className="text-slate-400" />
          {topups.some(t => t.status === 'pending') && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-brand-dark" />
          )}
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <TabButton active={activeTab === 'topups'} onClick={() => setActiveTab('topups')} icon={Wallet} label="Topups" count={topups.filter(t => t.status === 'pending').length} />
        <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={ShoppingBag} label="Orders" count={orders.filter(o => o.status === 'pending').length} />
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Payment Info" />
      </div>

      <div className="space-y-4">
        {activeTab === 'topups' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Wallet Requests</h2>
            {topups.map(req => (
              <div key={req.id} className={cn("glass-card p-4 space-y-3", req.status === 'pending' ? "border-brand-purple/50" : "opacity-50")}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold">
                      {req.method[0]}
                    </div>
                    <div>
                      <p className="font-bold">{req.userName}</p>
                      <p className="text-xs text-slate-400">{req.method} • {new Date(req.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-brand-green font-bold text-lg">{formatMMK(req.amount)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-black/20 p-2 rounded-lg">
                  <p><span className="text-slate-500">Sender:</span> {req.senderName}</p>
                  <p><span className="text-slate-500">Phone:</span> {req.senderPhone}</p>
                  <p className="col-span-2"><span className="text-slate-500">Tx ID:</span> <span className="font-mono text-brand-purple">{req.transactionId}</span></p>
                </div>
                {req.status === 'pending' && (
                  <div className="flex space-x-3 pt-2">
                    <button onClick={() => approveTopup(req)} className="flex-1 py-2 bg-brand-green text-brand-dark rounded-xl font-bold flex items-center justify-center space-x-2">
                      <CheckCircle2 size={16} />
                      <span>Approve</span>
                    </button>
                    <button onClick={() => rejectTopup(req.id)} className="flex-1 py-2 bg-red-500/20 text-red-500 rounded-xl font-bold flex items-center justify-center space-x-2">
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Game Orders</h2>
            {orders.map(order => (
              <div key={order.id} className={cn("glass-card p-4 space-y-3", order.status === 'pending' ? "border-brand-green/50" : "opacity-50")}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{order.gameName}</h4>
                    <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-brand-green font-bold">{formatMMK(order.price)}</p>
                </div>
                <div className="bg-black/20 p-2 rounded-lg space-y-1">
                  <p className="text-xs"><span className="text-slate-500">Player ID:</span> <span className="font-bold text-brand-green">{order.playerGameId}</span></p>
                  <p className="text-xs"><span className="text-slate-500">Item:</span> {order.itemName}</p>
                </div>
                {order.status === 'pending' && (
                  <button 
                    onClick={() => completeOrder(order.id, order.price, order.userId)}
                    className="w-full py-2 bg-brand-purple text-white rounded-xl font-bold flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Completed</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-bold">Payment Settings</h2>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase">KBZ Pay</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Name" value={settings.kbzPayName} onChange={v => setSettings({...settings, kbzPayName: v})} />
                <Input label="Number" value={settings.kbzPayNumber} onChange={v => setSettings({...settings, kbzPayNumber: v})} />
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase pt-4 border-t border-white/5">Wave Money</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Name" value={settings.waveMoneyName} onChange={v => setSettings({...settings, waveMoneyName: v})} />
                <Input label="Number" value={settings.waveMoneyNumber} onChange={v => setSettings({...settings, waveMoneyNumber: v})} />
              </div>
            </div>

            <button 
              onClick={saveSettings}
              disabled={savingSettings}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {savingSettings ? <Loader2 className="animate-spin" /> : (
                <>
                  <Save size={18} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all shrink-0",
        active ? "bg-brand-green border-brand-green text-brand-dark font-bold shadow-lg shadow-brand-green/20" : "bg-white/5 border-white/10 text-slate-400"
      )}
    >
      <Icon size={16} />
      <span>{label}</span>
      {count > 0 && (
        <span className={cn("ml-2 px-2 py-0.5 rounded-full text-[10px]", active ? "bg-brand-dark text-brand-green" : "bg-red-500 text-white")}>
          {count}
        </span>
      )}
    </button>
  );
}

function Input({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 font-bold uppercase">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand-green transition-all"
      />
    </div>
  );
}
