/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { translations } from '../i18n';
import { Language, UserRole } from '../types';
import {
  Bell,
  Globe,
  Shield,
  Smartphone,
  Monitor,
  Heart,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUserEmail: string;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  currentRole,
  setCurrentRole,
  currentUserEmail,
  isDeviceFrame,
  setIsDeviceFrame,
  unreadCount,
  onOpenNotifications,
  onOpenAuth
}) => {
  const t = translations[language];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none">
      {/* Android Device Status Bar Simulation when in Device Frame */}
      {isDeviceFrame && (
        <div className="bg-slate-950 px-4 py-1 flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-800/60">
          <div className="flex items-center space-x-1 font-semibold text-slate-300">
            <span>12:30</span>
            <span className="text-pink-400 font-bold ml-1">₦ NGN</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400">5G</span>
            <svg className="w-3.5 h-3.5 fill-current text-slate-300" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/>
            </svg>
            <div className="w-5 h-2.5 border border-slate-400 rounded-xs p-0.5 flex items-center">
              <div className="h-full bg-emerald-400 w-4 rounded-xs"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-pink-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-600/20 ring-1 ring-pink-400/30">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                {t.brandName}
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-mono font-medium border border-pink-500/30">
                  AI
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 italic hidden sm:block truncate max-w-xs">
              "{t.tagline}"
            </p>
          </div>
        </div>

        {/* Right Tools: Language, Role Switcher, Frame Toggle, Notifs, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Frame Mode Toggle (Android Phone vs Desktop) */}
          <button
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            title={isDeviceFrame ? "Koma Yanayin Kwamfuta (Desktop View)" : "Koma Yanayin Wayar Android (Mobile View)"}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 hidden md:flex items-center gap-1 text-xs"
          >
            {isDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[11px]">Tablet/Web</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[11px]">Android Phone</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ha' ? 'en' : 'ha')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 transition"
          >
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            <span>{language === 'ha' ? 'Hausa' : 'English'}</span>
          </button>

          {/* Role selector dropdown */}
          <div className="relative group">
            <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/60 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-pink-400" />
              <span className="capitalize">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 hidden group-hover:block z-50">
              <div className="px-2 py-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {t.switchRole}
              </div>
              <button
                onClick={() => setCurrentRole('admin')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                  currentRole === 'admin' ? 'bg-pink-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{t.roleAdmin}</span>
                {currentRole === 'admin' && <span className="text-[10px]">●</span>}
              </button>
              <button
                onClick={() => setCurrentRole('staff')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                  currentRole === 'staff' ? 'bg-pink-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{t.roleStaff}</span>
                {currentRole === 'staff' && <span className="text-[10px]">●</span>}
              </button>
              <button
                onClick={() => setCurrentRole('member')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                  currentRole === 'member' ? 'bg-pink-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{t.roleMember}</span>
                {currentRole === 'member' && <span className="text-[10px]">●</span>}
              </button>
            </div>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title={t.notifications}
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Sign In / Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700/60"
          >
            <User className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline max-w-[100px] truncate">
              {currentUserEmail.split('@')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
