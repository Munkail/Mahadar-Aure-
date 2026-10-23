/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, MemberProfile, AuditLog, AppNotification } from '../types';
import { dataService } from '../services/dataService';
import {
  Users,
  UserCheck,
  Clock,
  Sparkles,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  History as HistoryIcon
} from 'lucide-react';
import { TabKey } from './Navigation';

interface DashboardViewProps {
  language: Language;
  currentRole: UserRole;
  onNavigate: (tab: TabKey) => void;
  onOpenNewMemberModal?: () => void;
  onSelectMember?: (member: MemberProfile) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  currentRole,
  onNavigate,
  onSelectMember
}) => {
  const t = translations[language];

  const [stats, setStats] = useState({
    totalMembers: 0,
    newRegistrations: 0,
    pendingApplications: 0,
    verifiedProfiles: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    standardPlanCount: 0,
    vipPlanCount: 0,
    pendingMatches: 0,
    unansweredEnquiries: 0,
    totalConfirmedFunds: 0
  });

  const [recentMembers, setRecentMembers] = useState<MemberProfile[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [computedStats, members, logs] = await Promise.all([
        dataService.computeDashboardStats(),
        dataService.getMembers(),
        dataService.getAuditLogs()
      ]);
      setStats(computedStats);
      setRecentMembers(members.slice(0, 4));
      setRecentLogs(logs.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Brand Tagline & Islamic Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ha' ? 'Tsarin Musulunci & Al\'ada' : 'Islamic Matchmaking Service'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.brandName} — {t.appTitle}
            </h2>
            <p className="text-sm text-slate-300 mt-1 italic font-serif">
              "{t.tagline}"
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-pink-400' : ''}`} />
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.navRegister}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid - Calculated strictly from database records */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Members */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-pink-500/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-400">{t.totalMembers}</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {stats.totalMembers}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">{stats.newRegistrations}</span>
              <span>{language === 'ha' ? 'sababbi cikin kwanaki 30' : 'new in 30 days'}</span>
            </div>
          </div>
        </div>

        {/* Verified Profiles */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-pink-500/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-400">{t.verifiedProfiles}</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              {stats.verifiedProfiles}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-amber-400 font-semibold">{stats.pendingApplications}</span>
              <span>{t.pendingApplications}</span>
            </div>
          </div>
        </div>

        {/* Pending Matches */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-pink-500/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-400">{t.pendingMatches}</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-pink-400 font-mono">
              {stats.pendingMatches}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {language === 'ha' ? 'Shawarwari na jiran amincewar jami\'i' : 'Awaiting staff review'}
            </div>
          </div>
        </div>

        {/* Total Funds Collected */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-pink-500/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-400">{t.totalCollected}</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
              ₦{stats.totalConfirmedFunds.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.vipPlanCount} VIP / {stats.standardPlanCount} Standard
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row: Active / Inactive / Unanswered Enquiries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">{t.activeMembers} / {t.inactiveMembers}</div>
            <div className="text-lg font-bold text-white mt-0.5">
              <span className="text-emerald-400">{stats.activeMembers}</span>{' '}
              <span className="text-slate-500">/</span>{' '}
              <span className="text-rose-400">{stats.inactiveMembers}</span>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">{t.unansweredEnquiries}</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5 font-mono">
              {stats.unansweredEnquiries} {language === 'ha' ? 'na jira' : 'open tickets'}
            </div>
          </div>
          <MessageSquare className="w-5 h-5 text-rose-400" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">{language === 'ha' ? 'Tsarin AI Secretary' : 'AI Secretary'}</div>
            <div className="text-sm font-semibold text-pink-400 mt-0.5">
              Gemini 3.8 Flash • Active
            </div>
          </div>
          <button
            onClick={() => onNavigate('secretary')}
            className="text-xs text-pink-400 hover:text-pink-300 font-medium underline flex items-center gap-1"
          >
            <span>{language === 'ha' ? 'Fara Tattaunawa' : 'Chat Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Launchpad & Fictional Data Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <span>{t.quickActions}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {language === 'ha' ? 'Jami\'i: Aliyu Ahmed Munkaila' : 'Admin: Aliyu Ahmed Munkaila'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('register')}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-left transition flex flex-col justify-between group"
          >
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 w-fit mb-2 group-hover:scale-110 transition">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-white">{t.navRegister}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{language === 'ha' ? 'Rijistar sabon memba' : 'Add member profile'}</span>
          </button>

          <button
            onClick={() => onNavigate('matchmaking')}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-left transition flex flex-col justify-between group"
          >
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 w-fit mb-2 group-hover:scale-110 transition">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-white">{t.navMatchmaking}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{language === 'ha' ? 'Bincika daidaituwa' : 'Evaluate compatibility'}</span>
          </button>

          <button
            onClick={() => onNavigate('secretary')}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-left transition flex flex-col justify-between group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 w-fit mb-2 group-hover:scale-110 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-white">{t.navSecretary}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{language === 'ha' ? 'Hausa/English AI Bot' : 'AI customer service'}</span>
          </button>

          <button
            onClick={() => onNavigate('payments')}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-left transition flex flex-col justify-between group"
          >
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 w-fit mb-2 group-hover:scale-110 transition">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-white">{t.navPayments}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{language === 'ha' ? 'Tabbatar da ₦' : 'Verify NGN payments'}</span>
          </button>
        </div>
      </div>

      {/* Two-Column Section: Recent Members & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Members */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-400" />
                <span>{t.recentActivity} — {t.navMembers}</span>
              </h3>
              <button
                onClick={() => onNavigate('members')}
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
              >
                <span>{t.all}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {recentMembers.map(m => (
                <div
                  key={m.memberId}
                  onClick={() => onSelectMember && onSelectMember(m)}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/50 px-2 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-pink-400 text-sm">
                      {m.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{m.fullName}</span>
                        {m.isVerified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {t.verified}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{m.gender.split('/')[0]}</span>
                        <span>•</span>
                        <span>{m.state}</span>
                        <span>•</span>
                        <span className="font-mono text-pink-400">{m.memberId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      m.membershipPlan === 'VIP'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {m.membershipPlan}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {m.registrationDate.substring(0, 10)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log / Admin Trail */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-indigo-400" />
                <span>{t.navAudit}</span>
              </h3>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>{t.all}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentLogs.map(log => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-pink-400 font-bold">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {log.timestamp.substring(11, 16)}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-1">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-slate-500 truncate">
                    {language === 'ha' ? 'Wanda ya aikata' : 'Actor'}: {log.performedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
