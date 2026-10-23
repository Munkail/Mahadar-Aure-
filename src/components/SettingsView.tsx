/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, AppSettings } from '../types';
import { dataService } from '../services/dataService';
import {
  Settings,
  Save,
  CheckCircle,
  Phone,
  Link,
  DollarSign,
  HelpCircle,
  Shield,
  FileText
} from 'lucide-react';

interface SettingsViewProps {
  language: Language;
  currentRole: UserRole;
  actorEmail: string;
  onSettingsUpdated?: (settings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  currentRole,
  actorEmail,
  onSettingsUpdated
}) => {
  const t = translations[language];

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const s = await dataService.getSettings();
        setSettings(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    if (currentRole !== 'admin') {
      alert(language === 'ha' ? 'Masu gudanarwa (Admin) ne kawai ke da ikon gyara saituna.' : 'Only administrators can update settings.');
      return;
    }

    await dataService.updateSettings(settings, actorEmail || 'admin');
    if (onSettingsUpdated) {
      onSettingsUpdated(settings);
    }
    setNotice(language === 'ha' ? 'An sabunta saitunan Mahadar Aure cikin nasara!' : 'Settings updated and saved successfully!');
    setTimeout(() => setNotice(null), 3500);
  };

  if (!settings) return null;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-pink-500" />
            <span>{t.settingsTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.settingsSubtitle}
          </p>
        </div>

        <span className="text-xs bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-xl border border-pink-500/20 font-mono font-bold">
          ADMIN ACCESS ONLY
        </span>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        
        {/* Brand identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Sunan Hukuma & Taken Aiki (Tagline)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sunan Sabis
              </label>
              <input
                type="text"
                value={settings.serviceName}
                onChange={e => setSettings({ ...settings, serviceName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Taken Sabis (Brand Tagline)
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm italic"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing Configuration in NGN */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Farashin Membanci a Naira (₦ NGN)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.stdPriceLabel}
              </label>
              <input
                type="number"
                value={settings.standardPriceNaira}
                onChange={e => setSettings({ ...settings, standardPriceNaira: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-sm"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                {language === 'ha' ? 'Taimakon binciken daidaituwa na asali' : 'Basic matchmaking support'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.vipPriceLabel}
              </label>
              <input
                type="number"
                value={settings.vipPriceNaira}
                onChange={e => setSettings({ ...settings, vipPriceNaira: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-sm"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                {language === 'ha' ? 'Keɓantaccen bincike da shawarwarin sirri' : 'Priority matching & counseling'}
              </span>
            </div>
          </div>
        </div>

        {/* Official Channels & Links */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            3. Lambobin Sadarwa & Tashoshin Yanar Gizo (Official Links)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.waContact}
              </label>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={e => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.tgContact}
              </label>
              <input
                type="text"
                value={settings.contactTelegram}
                onChange={e => setSettings({ ...settings, contactTelegram: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.fbContact}
              </label>
              <input
                type="text"
                value={settings.contactFacebook}
                onChange={e => setSettings({ ...settings, contactFacebook: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.chContact}
              </label>
              <input
                type="text"
                value={settings.contactWhatsAppChannel}
                onChange={e => setSettings({ ...settings, contactWhatsAppChannel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Privacy Policy & Consent Notice */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            4. Dokokin Sirri & Yarjejeniya (NDPR & Islamic Guidelines)
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bayanin Sirri na Hausa
            </label>
            <textarea
              rows={3}
              value={settings.privacyPolicyTextHausa}
              onChange={e => setSettings({ ...settings, privacyPolicyTextHausa: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              English Privacy & Data Processing Statement
            </label>
            <textarea
              rows={3}
              value={settings.privacyPolicyTextEnglish}
              onChange={e => setSettings({ ...settings, privacyPolicyTextEnglish: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveSettings}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
