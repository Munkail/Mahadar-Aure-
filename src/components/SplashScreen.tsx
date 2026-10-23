/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface SplashScreenProps {
  onDismiss: () => void;
  language: Language;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss, language }) => {
  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-between p-8 text-center cursor-pointer select-none overflow-hidden animate-fadeIn"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Islamic Greeting */}
      <div className="pt-8 text-center space-y-1 z-10">
        <div className="text-pink-400 font-['Amiri'] text-2xl tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          Bismillahi Ar-Rahman Ar-Rahim
        </p>
      </div>

      {/* Brand Center */}
      <div className="flex flex-col items-center space-y-5 z-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-pink-600 via-pink-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-pink-600/40 ring-4 ring-pink-500/20">
            <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-pink-500 text-pink-400 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
            AI
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Mahadar Aure
          </h1>
          <p className="text-pink-400 font-medium text-sm sm:text-base italic font-serif">
            "Haɗa Zuciya, Gina Gida, Gina Al’umma"
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {language === 'ha'
              ? 'Dandalin Sasanta Aure bisa Tsarin Addinin Musulunci da Al\'adar Hausa'
              : 'Dignified Islamic Matchmaking & Guidance Administration'}
          </p>
        </div>
      </div>

      {/* Bottom Launch Button */}
      <div className="pb-8 z-10 space-y-3">
        <button
          onClick={onDismiss}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-sm shadow-xl shadow-pink-600/40 transition transform active:scale-95"
        >
          {language === 'ha' ? 'Shiga Manhajar (Enter App)' : 'Launch Application'}
        </button>
        <div className="text-[11px] text-slate-500 font-mono">
          Native Android 14 Edition • Material 3
        </div>
      </div>
    </div>
  );
};
