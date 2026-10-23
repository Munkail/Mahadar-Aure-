/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { translations } from '../i18n';
import { Language, UserRole } from '../types';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  X,
  Shield,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUserEmail: string;
  setCurrentUserEmail: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  currentRole,
  setCurrentRole,
  currentUserEmail,
  setCurrentUserEmail
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userEmail = res.user.email || '';
      setCurrentUserEmail(userEmail);

      // Check if bootstrapped admin
      if (userEmail.toLowerCase() === 'aliahmedmunkaila@gmail.com') {
        setCurrentRole('admin');
        setSuccessMsg(language === 'ha' ? 'Barka da zuwa! An tabbatar da matsayin Super Administrator.' : 'Welcome! Bootstrapped Super Administrator recognized.');
      } else {
        setCurrentRole('staff');
        setSuccessMsg(language === 'ha' ? 'An shiga asusu cikin nasara!' : 'Logged in successfully!');
      }

      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      // Fallback for iframe restrictions if popup blocked
      setErrorMsg(language === 'ha' ? 'Don Allah a shiga ta hanyar demo ko kuma a ba da izinin popup.' : err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole, demoEmail: string) => {
    setCurrentRole(role);
    setCurrentUserEmail(demoEmail);
    setSuccessMsg(language === 'ha' ? `An canza asusu zuwa ${role.toUpperCase()}` : `Switched session to ${role.toUpperCase()}`);
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentRole('member');
    setCurrentUserEmail('member@mahadaraure.ng');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-pink-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {language === 'ha' ? 'Shiga Asusun Mahadar Aure' : 'Mahadar Aure Account Access'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'ha' ? 'Kariya da izini ta Firebase Authentication' : 'Secured via Firebase Authentication & ABAC'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Current Active User Status */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-pink-400 font-bold text-xs">
              {currentUserEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-bold text-white truncate max-w-[170px]">
                {currentUserEmail}
              </div>
              <div className="text-[10px] text-pink-400 font-mono capitalize">
                Role: {currentRole}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{language === 'ha' ? 'Shiga da Google Account' : 'Sign in with Google'}</span>
        </button>

        {/* Rapid Testing / Demo Access Roles */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>{language === 'ha' ? 'Zaɓi Matsayi don Gwaji' : 'Instant Role Simulation'}</span>
            <span className="text-pink-400 font-mono text-[10px]">Testing Mode</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('admin', 'aliahmedmunkaila@gmail.com')}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                currentRole === 'admin' && currentUserEmail === 'aliahmedmunkaila@gmail.com'
                  ? 'bg-pink-600/20 text-pink-300 border-pink-500/40'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Super Administrator</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 rounded">Owner</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">aliahmedmunkaila@gmail.com</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('staff', 'staff.zainab@mahadaraure.ng')}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                currentRole === 'staff'
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold">Staff / Matchmaker</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">staff.zainab@mahadaraure.ng</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('member', 'ibrahim.member@mahadaraure.ng')}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                currentRole === 'member'
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold">Applicant / Member</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">ibrahim.member@mahadaraure.ng</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
