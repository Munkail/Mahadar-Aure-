/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, Enquiry } from '../types';
import { dataService } from '../services/dataService';
import {
  HelpCircle,
  CheckCircle,
  Clock,
  Plus,
  Send,
  User,
  Phone,
  FileText
} from 'lucide-react';

interface EnquiriesViewProps {
  language: Language;
  currentRole: UserRole;
  actorEmail: string;
}

export const EnquiriesView: React.FC<EnquiriesViewProps> = ({
  language,
  currentRole,
  actorEmail
}) => {
  const t = translations[language];

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusVal, setStatusVal] = useState<'open' | 'in_progress' | 'resolved'>('in_progress');
  const [notice, setNotice] = useState<string | null>(null);

  // New enquiry form
  const [form, setForm] = useState({
    senderName: '',
    senderContact: '',
    subject: '',
    message: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getEnquiries();
      setEnquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.senderName.trim() || !form.message.trim()) return;

    const newEnq: Enquiry = {
      id: `ENQ-${Date.now()}`,
      senderName: form.senderName.trim(),
      senderContact: form.senderContact.trim() || 'WhatsApp',
      subject: form.subject.trim() || 'Tambaya kan Mahadar Aure',
      message: form.message.trim(),
      status: 'open',
      createdAt: new Date().toISOString()
    };

    await dataService.createEnquiry(newEnq);
    setNotice(language === 'ha' ? 'An tura kokonku cikin nasara! Jami\'i zai duba.' : 'Enquiry ticket submitted successfully!');
    setTimeout(() => setNotice(null), 3000);
    setIsCreating(false);
    setForm({ senderName: '', senderContact: '', subject: '', message: '' });
    await loadData();
  };

  const handleUpdateStatus = async () => {
    if (!selectedEnquiry) return;
    await dataService.updateEnquiryStatus(
      selectedEnquiry.id,
      statusVal,
      replyText.trim(),
      actorEmail || 'staff'
    );
    setNotice(language === 'ha' ? 'An sabunta koke!' : 'Enquiry updated successfully!');
    setTimeout(() => setNotice(null), 3000);
    setSelectedEnquiry(null);
    setReplyText('');
    await loadData();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-pink-500" />
            <span>{t.enquiriesTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.enquiriesSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newEnquiry}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* New Enquiry Form */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="bg-slate-900 border-2 border-pink-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
          <h3 className="font-bold text-base text-white border-b border-slate-800 pb-2">
            {language === 'ha' ? 'Rubuta Sabon Koke ko Tambaya' : 'Submit Support or Matchmaking Query'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.sender} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={form.senderName}
                onChange={e => setForm({ ...form, senderName: e.target.value })}
                placeholder="Misali: Malam Garba Zaria"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lambar Waya / WhatsApp
              </label>
              <input
                type="text"
                value={form.senderContact}
                onChange={e => setForm({ ...form, senderContact: e.target.value })}
                placeholder="080..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.subject}
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Kanshin magana..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.message} <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Cikakken bayanin koke..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
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

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enquiries.map(enq => (
          <div
            key={enq.id}
            onClick={() => setSelectedEnquiry(enq)}
            className="bg-slate-900 border border-slate-800 hover:border-pink-500/40 rounded-2xl p-5 shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {enq.subject}
                  </h4>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    <span>{enq.senderName}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{enq.senderContact}</span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  enq.status === 'resolved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : enq.status === 'in_progress'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {enq.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-3 line-clamp-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                "{enq.message}"
              </p>

              {enq.staffNotes && (
                <div className="mt-2 text-[11px] text-pink-300 bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
                  <span className="font-bold">{language === 'ha' ? 'Amsar Jami\'i:' : 'Staff Note:'}</span> {enq.staffNotes}
                </div>
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{enq.createdAt.substring(0, 10)}</span>
              <span className="text-pink-400 font-semibold">{t.viewDetails} →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail / Response Modal for Staff */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              {selectedEnquiry.subject}
            </h3>

            <div className="text-xs text-slate-300 space-y-1">
              <div><span className="text-slate-500">Daga (From):</span> {selectedEnquiry.senderName} ({selectedEnquiry.senderContact})</div>
              <div><span className="text-slate-500">Ranar Aiko:</span> {selectedEnquiry.createdAt}</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mt-2 text-slate-200">
                "{selectedEnquiry.message}"
              </div>
            </div>

            {(currentRole === 'admin' || currentRole === 'staff') && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Matsayin Koke (Status)
                  </label>
                  <select
                    value={statusVal}
                    onChange={e => setStatusVal(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  >
                    <option value="open">{t.statusOpen}</option>
                    <option value="in_progress">{t.statusInProgress}</option>
                    <option value="resolved">{t.statusResolved}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.replyStaff}
                  </label>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Rubuta bayanin da jami'i ya dauka..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                {t.cancel}
              </button>
              {(currentRole === 'admin' || currentRole === 'staff') && (
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs"
                >
                  {t.confirm}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
