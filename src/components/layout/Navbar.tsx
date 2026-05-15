import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, User as UserIcon } from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../../services/firebase';
import { User } from 'firebase/auth';

interface NavbarProps {
  user: User | null;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ user, loading }) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-sm">
            <Video className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">TubeSummarizer</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/pricing" className="text-white/40 hover:text-white transition-colors hidden md:block text-xs font-bold tracking-[0.2em] uppercase">Pricing</Link>
          
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-white/40 hover:text-white transition-colors text-xs font-bold tracking-[0.2em] uppercase">Dashboard</Link>
              <div className="hidden sm:block text-right">
                <div className="text-[10px] font-black text-white tracking-widest uppercase truncate max-w-[100px]">{user.displayName}</div>
                <button onClick={handleLogout} className="text-[8px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Sign Out</button>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                 {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    <UserIcon className="w-5 h-5 text-white/20" />
                 )}
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="px-6 py-2 bg-white text-black font-bold rounded-lg text-xs tracking-wider uppercase hover:bg-slate-200 transition-all font-black"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
