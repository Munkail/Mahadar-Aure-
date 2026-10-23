/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, MemberProfile } from '../types';
import { dataService } from '../services/dataService';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  RefreshCw,
  Lock,
  Heart,
  Plus
} from 'lucide-react';

interface MemberListViewProps {
  language: Language;
  currentRole: UserRole;
  actorEmail: string;
  onSelectMember: (member: MemberProfile) => void;
  onNavigateRegister: () => void;
}

export const MemberListView: React.FC<MemberListViewProps> = ({
  language,
  currentRole,
  actorEmail,
  onSelectMember,
  onNavigateRegister
}) => {
  const t = translations[language];

  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleExportCsv = async () => {
    if (currentRole !== 'admin') {
      alert(language === 'ha' ? 'Masu gudanarwa (Admin) ne kawai ke da izinin fitar da CSV.' : 'Only administrators can export CSV.');
      return;
    }
    try {
      const csv = await dataService.exportMembersCsv(actorEmail || 'admin');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Mahadar_Aure_Members_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportNotice(language === 'ha' ? 'An fitar da CSV cikin nasara (an kiyaye asirin genotype).' : 'CSV exported successfully with sensitive fields masked.');
      setTimeout(() => setExportNotice(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleArchiveToggle = async (member: MemberProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...member, isArchived: !member.isArchived };
    await dataService.updateMember(updated, actorEmail || 'staff');
    await fetchMembers();
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phoneNumber.includes(searchQuery);

    const matchesPlan = selectedPlan === 'all' || m.membershipPlan === selectedPlan;
    const matchesGender = selectedGender === 'all' || m.gender.includes(selectedGender);
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'verified' && m.isVerified) ||
      (selectedStatus === 'pending' && !m.isVerified) ||
      (selectedStatus === 'archived' && m.isArchived);

    return matchesSearch && matchesPlan && matchesGender && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>{t.navMembers}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-mono font-medium">
              {filteredMembers.length} {t.all}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'ha' ? 'Kula da bayanan membobi, tantancewa, da neman daidaituwa' : 'Manage registered applicants, verification, and preferences'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'admin' && (
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Export CSV (Admin Only)"
            >
              <Download className="w-4 h-4 text-pink-400" />
              <span>{t.exportCsv}</span>
            </button>
          )}

          <button
            onClick={fetchMembers}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-pink-400' : ''}`} />
          </button>

          <button
            onClick={onNavigateRegister}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.navRegister}</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedPlan}
              onChange={e => setSelectedPlan(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-pink-500"
            >
              <option value="all">{t.filterByPlan}: {t.all}</option>
              <option value="Standard">Standard (₦3,000)</option>
              <option value="VIP">VIP (₦5,000)</option>
            </select>

            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-pink-500"
            >
              <option value="all">{t.filterByGender}: {t.all}</option>
              <option value="Namiji">{t.male}</option>
              <option value="Mace">{t.female}</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-pink-500"
            >
              <option value="all">Status: {t.all}</option>
              <option value="verified">{t.verified}</option>
              <option value="pending">{t.statusPending}</option>
              <option value="archived">{t.archived}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map(m => (
          <div
            key={m.memberId}
            onClick={() => onSelectMember(m)}
            className="bg-slate-900 border border-slate-800 hover:border-pink-500/40 rounded-2xl p-5 shadow-xl transition cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            {m.isArchived && (
              <div className="absolute top-2 right-2 bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
                {t.archived}
              </div>
            )}

            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-lg text-pink-400 group-hover:scale-105 transition shadow">
                    {m.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                      <span>{m.fullName}</span>
                    </h3>
                    <span className="font-mono text-xs text-pink-400 font-semibold">
                      {m.memberId}
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  m.membershipPlan === 'VIP'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {m.membershipPlan}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">{t.age} / {t.gender}:</span>
                  <span className="font-medium text-white">{m.age} yrs • {m.gender.split('/')[0]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">{t.state} & Gari:</span>
                  <span className="font-medium text-white">{m.state}, {m.city}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">{t.maritalStatus}:</span>
                  <span className="font-medium text-white">{m.maritalStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">{t.education}:</span>
                  <span className="font-medium text-white truncate max-w-[150px]">{m.educationLevel}</span>
                </div>
                
                {/* Genotype preview (only if authorized) */}
                <div className="flex justify-between py-1 items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Genotype:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 rounded">
                    {m.genotype || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                m.isVerified
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {m.isVerified ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>{t.verified}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>{t.statusPending}</span>
                  </>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleArchiveToggle(m, e)}
                  title={m.isArchived ? "Unarchive" : "Archive"}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onSelectMember(m)}
                  className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.viewDetails}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-sm">{t.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
};
