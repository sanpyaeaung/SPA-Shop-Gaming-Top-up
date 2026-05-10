import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Wallet, 
  History as HistoryIcon, 
  User as UserIcon, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';
import { cn, formatMMK } from './lib/utils';

// Pages
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import WalletPage from './pages/Wallet';
import HistoryPage from './pages/History';
import ProfilePage from './pages/Profile';
import AdminDashboard from './pages/Admin';
import ResellerGuide from './pages/ResellerGuide';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Sync user data
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const isAdmin = user.email === 'sanpyaeaung2001.spa@gmail.com';
          const newData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            balance: 0,
            role: isAdmin ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, newData);
          setUserData(newData);

          // Seed settings if not exists
          const settingsRef = doc(db, 'settings', 'config');
          const settingsSnap = await getDoc(settingsRef);
          if (!settingsSnap.exists()) {
            await setDoc(settingsRef, {
              kbzPayName: 'SPA-Shop Admin',
              kbzPayNumber: '09791234567',
              waveMoneyName: 'SPA-Shop Admin',
              waveMoneyNumber: '09791234567',
              maintenance: false
            });
          }
        } else {
          setUserData(userSnap.data());
        }

        // Real-time balance updates
        onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setUserData(snap.data());
          }
        });
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login Error:", error);
      // Firebase auth/cancelled-popup-request is common if double clicked
      if (error.code !== 'auth/cancelled-popup-request') {
        alert("Login Error: " + error.message + "\n\nPlease ensure Google Login is enabled in Firebase Console and popups are allowed.");
      }
    }
  };
  const logout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Landing login={login} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-dark pb-24 md:pb-0 md:pl-64">
        <Sidebar userData={userData} logout={logout} />
        <main className="max-w-4xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameId" element={<GameDetail userData={userData} />} />
            <Route path="/wallet" element={<WalletPage userData={userData} />} />
            <Route path="/history" element={<HistoryPage userData={userData} />} />
            <Route path="/profile" element={<ProfilePage userData={userData} logout={logout} />} />
            <Route path="/reseller-guide" element={<ResellerGuide />} />
            {userData?.role === 'admin' && (
              <Route path="/admin" element={<AdminDashboard />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <BottomNav userData={userData} />
      </div>
    </BrowserRouter>
  );
}

function Landing({ login }: { login: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0a0510] flex flex-col items-center justify-center p-6 text-center space-y-8 overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 relative z-10"
      >
        <div className="w-24 h-24 bg-gradient-to-tr from-brand-purple to-brand-green rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.3)]">
          <Gamepad2 size={48} className="text-black" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-brand-green to-purple-400 bg-clip-text text-transparent">SPA-SHOP GAMING</h1>
        <p className="text-purple-200/60 max-w-sm mx-auto font-medium">
          ဂိမ်းစိန်များကို အမြန်ဆုံးနှင့် အလွယ်ကူဆုံး ဝယ်ယူနိုင်တဲ့ platform ဖြစ်ပါတယ်။
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={login}
          className="bg-brand-green text-black px-10 py-5 rounded-2xl font-black flex items-center space-x-3 shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] transition-all uppercase tracking-widest"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 contrast-125" />
          <span>Continue with Google</span>
        </motion.button>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="#" // User should replace this with real APK link
          onClick={(e) => {
            if (e.currentTarget.getAttribute('href') === '#') {
              e.preventDefault();
              alert("APK link has not been set yet. Please add your APK download URL in App.tsx");
            }
          }}
          className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black flex items-center space-x-3 hover:bg-white/10 transition-all uppercase tracking-widest"
        >
          <Download size={24} className="text-brand-green" />
          <span>Download App (APK)</span>
        </motion.a>
      </motion.div>
    </div>
  );
}

function Sidebar({ userData, logout }: { userData: any, logout: () => void }) {
  const location = useLocation();

  const links = [
    { to: '/', icon: Gamepad2, label: 'Store' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/history', icon: HistoryIcon, label: 'History' },
    { to: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  if (userData?.role === 'admin') {
    links.push({ to: '/admin', icon: LayoutDashboard, label: 'Admin' });
  }

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-black/40 backdrop-blur-2xl border-r border-purple-500/20 p-6 space-y-8 z-50">
      <div className="flex items-center space-x-3 px-2">
        <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.4)]">
          <Gamepad2 size={24} className="text-black" />
        </div>
        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-brand-green to-purple-400 bg-clip-text text-transparent uppercase">SPA-Shop</span>
      </div>

      <div className="flex-1 space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex items-center space-x-3 p-4 rounded-xl transition-all group overflow-hidden relative",
              location.pathname === link.to 
                ? "bg-purple-900/40 border-l-4 border-brand-green text-brand-green" 
                : "text-gray-400 hover:text-white hover:bg-purple-800/20 shadow-none border-l-4 border-transparent"
            )}
          >
            <link.icon size={20} className={cn(location.pathname === link.to ? "animate-pulse" : "group-hover:translate-x-1 transition-transform")} />
            <span className="font-bold uppercase tracking-widest text-xs">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 bg-purple-900/30 border border-purple-500/20 rounded-2xl space-y-4">
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-green p-0.5">
            <img src={userData?.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold truncate text-gray-100">{userData?.displayName}</p>
            <p className="text-brand-green font-black text-base">{formatMMK(userData?.balance || 0)}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function BottomNav({ userData }: { userData: any }) {
  const location = useLocation();
  const links = [
    { to: '/', icon: Gamepad2, label: 'HOME' },
    { to: '/wallet', icon: Wallet, label: 'WALLET' },
    { to: '/history', icon: HistoryIcon, label: 'HISTORY' },
    { to: '/profile', icon: UserIcon, label: 'PROFILE' },
  ];

  if (userData?.role === 'admin') {
    links.push({ to: '/admin', icon: LayoutDashboard, label: 'ADMIN' });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-3xl border-t border-purple-500/30 flex items-center justify-around px-4 z-50">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link key={link.to} to={link.to} className="relative flex flex-col items-center gap-1 min-w-[64px]">
            {isActive ? (
              <motion.div
                layoutId="active-nav"
                className="w-12 h-14 bg-brand-green water-drop absolute -top-8 flex items-center justify-center shadow-[0_-5px_20px_rgba(57,255,20,0.5)]"
              >
                <link.icon size={22} className="text-black" />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <link.icon size={20} />
              </div>
            )}
            <span className={cn(
              "text-[9px] font-black tracking-widest uppercase mt-4 transition-colors",
              isActive ? "text-brand-green" : "text-gray-400"
            )}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
