/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, MemberProfile, MatchmakingSuggestion } from '../types';
import { dataService } from '../services/dataService';
import {
  HeartHandshake,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  ShieldCheck,
  Lock,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface MatchmakingViewProps {
  language: Language;
  currentRole: UserRole;
  actorEmail: string;
}

export const MatchmakingView: React.FC<MatchmakingViewProps> = ({
  language,
  currentRole,
  actorEmail
}) => {
  const t = translations[language];

  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [suggestions, setSuggestions] = useState<MatchmakingSuggestion[]>([]);
  const [selectedCandidateA, setSelectedCandidateA] = useState<string>('');
  const [selectedCandidateB, setSelectedCandidateB] = useState<string>('');
  const [activeAnalysis, setActiveAnalysis] = useState<MatchmakingSuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allMembers, allSuggestions] = await Promise.all([
        dataService.getMembers(),
        dataService.getMatchSuggestions()
      ]);
      setMembers(allMembers.filter(m => !m.isArchived));
      setSuggestions(allSuggestions);

      // Pre-select complimentary candidates if available
      const males = allMembers.filter(m => m.gender.includes('Namiji'));
      const females = allMembers.filter(m => m.gender.includes('Mace'));
      if (males.length > 0 && females.length > 0) {
        setSelectedCandidateA(males[0].memberId);
        setSelectedCandidateB(females[0].memberId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunCompatibility = () => {
    const candA = members.find(m => m.memberId === selectedCandidateA);
    const candB = members.find(m => m.memberId === selectedCandidateB);

    if (!candA || !candB) {
      alert(language === 'ha' ? 'Don Allah a zaɓi membobi biyu don aunawa.' : 'Please select both candidate A and B.');
      return;
    }

    if (candA.memberId === candB.memberId) {
      alert(language === 'ha' ? 'Ba a iya kwatanta mutum da kansa.' : 'Cannot compare candidate with themselves.');
      return;
    }

    const result = dataService.calculateCompatibility(candA, candB);
    setActiveAnalysis(result);
  };

  const handleSaveSuggestion = async () => {
    if (!activeAnalysis) return;
    await dataService.addMatchSuggestion(activeAnalysis, actorEmail || 'staff');
    setActionNotice(language === 'ha' ? 'An adana shawarar sasanta aure cikin nasara!' : 'Match suggestion recorded successfully!');
    setTimeout(() => setActionNotice(null), 3000);
    await loadData();
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'modified') => {
    await dataService.updateMatchStatus(id, status, actorEmail || 'staff');
    setActionNotice(
      language === 'ha'
        ? `Matsayin shawara ya koma: ${status.toUpperCase()}`
        : `Suggestion marked as: ${status.toUpperCase()}`
    );
    setTimeout(() => setActionNotice(null), 3000);
    await loadData();
  };

  const males = members.filter(m => m.gender.includes('Namiji'));
  const females = members.filter(m => m.gender.includes('Mace'));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-pink-500" />
            <span>{t.matchmakingTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.matchmakingSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-xl border border-pink-500/20 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ha' ? 'Bita ta Jami\'ai Kadai' : 'Staff Moderated Only'}</span>
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Candidate Selector Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Filter className="w-4 h-4 text-pink-400" />
          <span>{language === 'ha' ? 'Zaɓi Membobi don Gwada Daidaituwa' : 'Select Candidates for Compatibility Analysis'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Candidate A (Male) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>{t.selectCandidateA} ({t.male})</span>
              <span className="text-[10px] text-pink-400 font-mono">POOL: {males.length}</span>
            </label>
            <select
              value={selectedCandidateA}
              onChange={e => setSelectedCandidateA(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-pink-500"
            >
              {males.map(m => (
                <option key={m.memberId} value={m.memberId}>
                  {m.fullName} ({m.age} yrs • {m.state} • Genotype: {m.genotype})
                </option>
              ))}
            </select>
          </div>

          {/* Candidate B (Female) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>{t.selectCandidateB} ({t.female})</span>
              <span className="text-[10px] text-pink-400 font-mono">POOL: {females.length}</span>
            </label>
            <select
              value={selectedCandidateB}
              onChange={e => setSelectedCandidateB(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-pink-500"
            >
              {females.map(m => (
                <option key={m.memberId} value={m.memberId}>
                  {m.fullName} ({m.age} yrs • {m.state} • Genotype: {m.genotype})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunCompatibility}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ha' ? 'Bincika Daidaituwa Yanzu' : 'Analyze Compatibility'}</span>
          </button>
        </div>
      </div>

      {/* Active Compatibility Result Card */}
      {activeAnalysis && (
        <div className="bg-slate-900 border-2 border-pink-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-pink-400 font-bold block mb-1">
                {language === 'ha' ? 'Sakamakon Binciken Daidaituwa' : 'Compatibility Evaluation Output'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {activeAnalysis.candidateAName} & {activeAnalysis.candidateBName}
              </h3>
            </div>

            {/* Score Ring */}
            <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">{t.compatibilityScore}:</span>
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                activeAnalysis.compatibilityScore >= 80
                  ? 'text-emerald-400'
                  : activeAnalysis.compatibilityScore >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {activeAnalysis.compatibilityScore}%
              </span>
            </div>
          </div>

          {/* Explainable Matching Factors & Divergence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{t.matchingCriteria}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeAnalysis.matchingFactors.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-matched / Warnings */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{t.nonMatchingCriteria}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeAnalysis.nonMatchingFactors.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
                {activeAnalysis.nonMatchingFactors.length === 0 && (
                  <li className="text-slate-400 italic">Babu wani babban bambanci da aka gano.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Summary Text */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-1">{t.aiAnalysis}:</span>
            {language === 'ha' ? activeAnalysis.explanationHausa : activeAnalysis.explanationEnglish}
          </div>

          {/* Legal / Islamic Notice */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            {t.mutualConsentRequired}
          </div>

          {/* Staff Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={handleSaveSuggestion}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'ha' ? 'Ajiye a Jerin Shawarwari' : 'Record Proposal in Registry'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Historical Staff Match Suggestions Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>{language === 'ha' ? 'Jerin Shawarwarin da Jami\'ai ke Bita' : 'Pending & Reviewed Match Registry'}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {suggestions.length}
          </span>
        </h3>

        <div className="divide-y divide-slate-800">
          {suggestions.map(s => (
            <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">
                    {s.candidateAName} <span className="text-pink-400">♥</span> {s.candidateBName}
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {s.compatibilityScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {language === 'ha' ? s.explanationHausa : s.explanationEnglish}
                </p>
                <div className="text-[10px] text-slate-500 mt-1">
                  {language === 'ha' ? 'Jami\'i' : 'Reviewer'}: {s.reviewedByStaff} • Status: <span className="uppercase font-semibold text-pink-400">{s.staffStatus}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(s.id, 'approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                    s.staffStatus === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-emerald-950 text-slate-300 border border-slate-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.approveIntroduction}</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(s.id, 'rejected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                    s.staffStatus === 'rejected'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 hover:bg-rose-950 text-slate-300 border border-slate-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.rejectIntroduction}</span>
                </button>
              </div>
            </div>
          ))}

          {suggestions.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              {t.noData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
