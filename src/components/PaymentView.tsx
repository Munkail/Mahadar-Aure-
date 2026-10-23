/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, PaymentRecord, MemberProfile } from '../types';
import { dataService } from '../services/dataService';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  Receipt,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface PaymentViewProps {
  language: Language;
  currentRole: UserRole;
  actorEmail: string;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  language,
  currentRole,
  actorEmail
}) => {
  const t = translations[language];

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form state
  const [newPay, setNewPay] = useState({
    memberId: '',
    memberName: '',
    plan: 'Standard' as 'Standard' | 'VIP',
    amountNaira: 3000,
    paymentReference: '',
    paymentStatus: 'pending' as 'pending' | 'confirmed' | 'failed' | 'refunded',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [allPayments, allMembers] = await Promise.all([
        dataService.getPayments(),
        dataService.getMembers()
      ]);
      setPayments(allPayments);
      setMembers(allMembers);
      if (allMembers.length > 0 && !newPay.memberId) {
        setNewPay(prev => ({
          ...prev,
          memberId: allMembers[0].memberId,
          memberName: allMembers[0].fullName
        }));
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

  const handleMemberSelect = (mId: string) => {
    const mem = members.find(m => m.memberId === mId);
    if (mem) {
      setNewPay({
        ...newPay,
        memberId: mem.memberId,
        memberName: mem.fullName,
        plan: mem.membershipPlan,
        amountNaira: mem.membershipPlan === 'VIP' ? 5000 : 3000
      });
    }
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPay.paymentReference.trim()) {
      alert(language === 'ha' ? 'Don Allah shigar da lambar shaidar biya (Reference).' : 'Please enter payment reference.');
      return;
    }

    const rec: PaymentRecord = {
      paymentId: `PAY-${Date.now()}`,
      memberId: newPay.memberId,
      memberName: newPay.memberName,
      plan: newPay.plan,
      amountNaira: Number(newPay.amountNaira),
      paymentReference: newPay.paymentReference.trim().toUpperCase(),
      paymentDate: new Date().toISOString().substring(0, 10),
      paymentStatus: newPay.paymentStatus,
      reviewedByStaffId: actorEmail || 'staff-admin',
      verifiedAt: newPay.paymentStatus === 'confirmed' ? new Date().toISOString().substring(0, 16) : '-',
      notes: newPay.notes.trim()
    };

    await dataService.recordPayment(rec, actorEmail || 'staff-admin');
    setNotice(language === 'ha' ? 'An yi nasarar adana rikodin biyan kuɗi!' : 'Payment recorded successfully!');
    setTimeout(() => setNotice(null), 3000);
    setIsRecording(false);
    setNewPay(prev => ({ ...prev, paymentReference: '', notes: '' }));
    await loadData();
  };

  const handleConfirmAction = async (paymentId: string) => {
    await dataService.confirmPayment(paymentId, actorEmail || 'staff-admin');
    setNotice(language === 'ha' ? 'An tabbatar da biyan kuɗi cikin nasara!' : 'Payment verified and confirmed!');
    setTimeout(() => setNotice(null), 3000);
    await loadData();
  };

  const totalConfirmed = payments
    .filter(p => p.paymentStatus === 'confirmed')
    .reduce((sum, p) => sum + p.amountNaira, 0);

  const pendingCount = payments.filter(p => p.paymentStatus === 'pending').length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-pink-500" />
            <span>{t.paymentsTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.paymentsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{t.totalCollected}</span>
            <span className="text-lg font-extrabold text-amber-400 font-mono">
              ₦{totalConfirmed.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.recordPayment}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Record Payment Form Modal / Card */}
      {isRecording && (
        <form onSubmit={handleRecordSubmit} className="bg-slate-900 border-2 border-pink-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Receipt className="w-5 h-5 text-pink-400" />
            <span>{language === 'ha' ? 'Shigar da Sabon Rikodin Biyan Kuɗi' : 'Record Verified Payment Entry'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'ha' ? 'Zaɓi Memba' : 'Select Member'}
              </label>
              <select
                value={newPay.memberId}
                onChange={e => handleMemberSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
              >
                {members.map(m => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.fullName} ({m.memberId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.plan}
              </label>
              <select
                value={newPay.plan}
                onChange={e => {
                  const plan = e.target.value as any;
                  setNewPay({
                    ...newPay,
                    plan,
                    amountNaira: plan === 'VIP' ? 5000 : 3000
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
              >
                <option value="Standard">Standard (₦3,000)</option>
                <option value="VIP">VIP (₦5,000)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.amount}
              </label>
              <input
                type="number"
                value={newPay.amountNaira}
                onChange={e => setNewPay({ ...newPay, amountNaira: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.paymentRef} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Misali: TRX-GTB-893021"
                value={newPay.paymentReference}
                onChange={e => setNewPay({ ...newPay, paymentReference: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.paymentStatus}
              </label>
              <select
                value={newPay.paymentStatus}
                onChange={e => setNewPay({ ...newPay, paymentStatus: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm"
              >
                <option value="pending">{t.statusPending}</option>
                <option value="confirmed">{t.statusConfirmed}</option>
                <option value="failed">{t.statusFailed}</option>
                <option value="refunded">{t.statusRefunded}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ha' ? 'Karin Bayani / Shaidar Asusu' : 'Verification Notes'}
            </label>
            <input
              type="text"
              placeholder="Misali: An karba ta asusun Jaiz Bank / GTBank"
              value={newPay.notes}
              onChange={e => setNewPay({ ...newPay, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRecording(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs"
            >
              {t.confirm}
            </button>
          </div>
        </form>
      )}

      {/* Payment Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">
            {language === 'ha' ? 'Jerin Kuɗaɗen Rajista' : 'Subscription Records List'}
          </h3>
          <span className="text-xs text-amber-400 font-mono">
            {pendingCount} {language === 'ha' ? 'na jiran bita' : 'pending verification'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member ID & Name</th>
                <th className="py-3 px-4">{t.plan}</th>
                <th className="py-3 px-4">{t.amount}</th>
                <th className="py-3 px-4">{t.paymentRef}</th>
                <th className="py-3 px-4">{t.paymentDate}</th>
                <th className="py-3 px-4">{t.paymentStatus}</th>
                <th className="py-3 px-4">{t.reviewedBy}</th>
                <th className="py-3 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map(p => (
                <tr key={p.paymentId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{p.memberName}</div>
                    <div className="text-[11px] font-mono text-pink-400">{p.memberId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      p.plan === 'VIP'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {p.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400 text-sm">
                    ₦{p.amountNaira.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {p.paymentReference}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {p.paymentDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                      p.paymentStatus === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : p.paymentStatus === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {p.paymentStatus === 'confirmed' ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>{t.statusConfirmed}</span>
                        </>
                      ) : p.paymentStatus === 'pending' ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>{t.statusPending}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>{p.paymentStatus}</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    <div>{p.reviewedByStaffId}</div>
                    <div className="text-[10px] text-slate-500">{p.verifiedAt}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {p.paymentStatus === 'pending' && (
                      <button
                        onClick={() => handleConfirmAction(p.paymentId)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition shadow"
                      >
                        {t.confirmPaymentAction}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
