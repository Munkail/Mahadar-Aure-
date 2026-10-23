/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { translations } from '../i18n';
import { Language, UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Bot,
  HeartHandshake,
  Receipt,
  HelpCircle,
  History,
  Settings,
  Code2
} from 'lucide-react';

export type TabKey =
  | 'dashboard'
  | 'members'
  | 'register'
  | 'secretary'
  | 'matchmaking'
  | 'payments'
  | 'enquiries'
  | 'audit'
  | 'settings'
  | 'android';

interface NavigationProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  language: Language;
  currentRole: UserRole;
  isDeviceFrame: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  language,
  currentRole,
  isDeviceFrame
}) => {
  const t = translations[language];

  // Define tab items with role restrictions
  const allTabs: Array<{
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    roles: UserRole[];
    badge?: string;
  }> = [
    {
      key: 'dashboard',
      label: t.navDashboard,
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'staff', 'member']
    },
    {
      key: 'members',
      label: t.navMembers,
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'staff']
    },
    {
      key: 'register',
      label: t.navRegister,
      icon: <UserPlus className="w-5 h-5" />,
      roles: ['admin', 'staff', 'member']
    },
    {
      key: 'secretary',
      label: t.navSecretary,
      icon: <Bot className="w-5 h-5" />,
      roles: ['admin', 'staff', 'member'],
      badge: 'AI'
    },
    {
      key: 'matchmaking',
      label: t.navMatchmaking,
      icon: <HeartHandshake className="w-5 h-5" />,
      roles: ['admin', 'staff']
    },
    {
      key: 'payments',
      label: t.navPayments,
      icon: <Receipt className="w-5 h-5" />,
      roles: ['admin', 'staff']
    },
    {
      key: 'enquiries',
      label: t.navEnquiries,
      icon: <HelpCircle className="w-5 h-5" />,
      roles: ['admin', 'staff', 'member']
    },
    {
      key: 'audit',
      label: t.navAudit,
      icon: <History className="w-5 h-5" />,
      roles: ['admin', 'staff']
    },
    {
      key: 'settings',
      label: t.navSettings,
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin']
    },
    {
      key: 'android',
      label: t.navAndroidStudio,
      icon: <Code2 className="w-5 h-5" />,
      roles: ['admin', 'staff', 'member'],
      badge: 'SDK'
    }
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.includes(currentRole));

  // If in Android Phone Mode, render Material 3 Bottom Bar with scroll or priority icons
  if (isDeviceFrame) {
    // Primary bottom bar items for phone
    const phonePrimaryKeys: TabKey[] = ['dashboard', 'register', 'secretary', 'matchmaking', 'payments'];
    const phoneTabs = visibleTabs.filter(tab => phonePrimaryKeys.includes(tab.key));

    return (
      <div className="bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around z-30 select-none">
        {phoneTabs.map(tab => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-pink-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive ? 'bg-pink-600/20 scale-110 ring-1 ring-pink-500/30' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 truncate max-w-[62px]">
                {tab.label}
              </span>
              {tab.badge && (
                <span className="absolute top-0 right-3 bg-pink-600 text-white text-[9px] px-1 rounded-full font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop / Tablet Sidebar View
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0 select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Mahadar Navigation
        </div>
        {visibleTabs.map(tab => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-600/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="text-[10px] bg-slate-950/40 text-pink-200 px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info in sidebar */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online / Firestore</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Nigerian Naira: ₦ NGN <br/>
          Kano, Kaduna, Sokoto, Katsina
        </p>
      </div>
    </aside>
  );
};
