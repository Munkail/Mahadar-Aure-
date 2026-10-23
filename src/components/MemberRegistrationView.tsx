/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, MemberProfile } from '../types';
import { dataService } from '../services/dataService';
import {
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Lock,
  Sparkles,
  Heart,
  Save,
  RotateCcw
} from 'lucide-react';

interface MemberRegistrationViewProps {
  language: Language;
  currentRole: UserRole;
  actorEmail: string;
  onSuccessNavigate?: () => void;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

export const MemberRegistrationView: React.FC<MemberRegistrationViewProps> = ({
  language,
  currentRole,
  actorEmail,
  onSuccessNavigate
}) => {
  const t = translations[language];

  // Helper to generate unique safe member ID: MA-2026-XXXX
  const generateNewMemberId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `MA-2026-${random}`;
  };

  const [formData, setFormData] = useState({
    memberId: generateNewMemberId(),
    fullName: '',
    age: 25,
    dateOfBirth: '2001-01-01',
    gender: 'Namiji / Male' as 'Namiji / Male' | 'Mace / Female',
    state: 'Kano',
    city: '',
    preferredMarriageLocation: '',
    phoneNumber: '',
    preferredContactMethod: 'WhatsApp' as 'WhatsApp' | 'Kira (Call)' | 'SMS' | 'Telegram',
    educationLevel: 'Bachelors / HND' as const,
    occupation: '',
    languagesSpoken: ['Hausa', 'English'],
    maritalStatus: 'Never Married' as 'Never Married' | 'Divorced' | 'Widowed',
    numberOfChildren: 0,
    genotype: 'AA' as 'AA' | 'AS' | 'SS' | 'AC' | 'SC' | 'Unknown',
    religiousPreferences: '',
    spouseAgeMin: 20,
    spouseAgeMax: 30,
    spouseStates: ['Kano', 'Kaduna'],
    spouseEducation: ['Secondary', 'Diploma / NCE', 'Bachelors / HND'],
    spouseMaritalStatus: ['Never Married'],
    spouseOtherNotes: '',
    membershipPlan: 'Standard' as 'Standard' | 'VIP',
    paymentStatus: 'pending' as 'pending' | 'confirmed' | 'failed' | 'refunded',
    consentGiven: false,
    notesRestricted: ''
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation 1: Consent
    if (!formData.consentGiven) {
      setErrorMsg(language === 'ha'
        ? 'Dole ne a amince da sharuddan bayar da bayanai kafin a ci gaba.'
        : 'You must consent to data collection and processing terms.');
      return;
    }

    // Validation 2: Age (18+ only)
    if (formData.age < 18) {
      setErrorMsg(t.underageErr);
      return;
    }

    // Validation 3: Required Name & Phone
    if (!formData.fullName.trim()) {
      setErrorMsg(language === 'ha' ? 'Don Allah rubuta cikakken suna.' : 'Please provide full name.');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setErrorMsg(language === 'ha' ? 'Don Allah rubuta lambar waya.' : 'Please provide phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newProfile: MemberProfile = {
        memberId: formData.memberId.trim().toUpperCase(),
        fullName: formData.fullName.trim(),
        age: Number(formData.age),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        state: formData.state,
        city: formData.city.trim() || formData.state,
        preferredMarriageLocation: formData.preferredMarriageLocation.trim() || formData.state,
        phoneNumber: formData.phoneNumber.trim(),
        preferredContactMethod: formData.preferredContactMethod,
        educationLevel: formData.educationLevel,
        occupation: formData.occupation.trim() || 'Dan Kasuwa / Sana\'a',
        languagesSpoken: formData.languagesSpoken,
        maritalStatus: formData.maritalStatus,
        numberOfChildren: Number(formData.numberOfChildren),
        genotype: formData.genotype,
        religiousPreferences: formData.religiousPreferences.trim() || 'Ahlussunnah / Mai bin addini',
        spousePreferences: {
          ageMin: Number(formData.spouseAgeMin),
          ageMax: Number(formData.spouseAgeMax),
          states: formData.spouseStates,
          educationLevels: formData.spouseEducation,
          maritalStatuses: formData.spouseMaritalStatus,
          otherNotes: formData.spouseOtherNotes.trim()
        },
        membershipPlan: formData.membershipPlan,
        paymentStatus: formData.paymentStatus,
        registrationDate: new Date().toISOString(),
        consentGiven: true,
        notesRestricted: formData.notesRestricted.trim(),
        isVerified: formData.paymentStatus === 'confirmed',
        isActive: true,
        isArchived: false,
        createdBy: actorEmail || 'staff-admin',
        updatedAt: new Date().toISOString()
      };

      await dataService.addMember(newProfile, actorEmail || 'staff-admin');
      setSuccessMsg(t.saveSuccess);

      // Reset form with new safe ID
      setTimeout(() => {
        setFormData({
          ...formData,
          memberId: generateNewMemberId(),
          fullName: '',
          city: '',
          phoneNumber: '',
          occupation: '',
          religiousPreferences: '',
          spouseOtherNotes: '',
          notesRestricted: '',
          consentGiven: false
        });
        if (onSuccessNavigate) {
          onSuccessNavigate();
        }
      }, 1500);

    } catch (err: any) {
      if (err.message === 'DUPLICATE_MEMBER_ID') {
        setErrorMsg(t.duplicateIdErr);
      } else {
        setErrorMsg(err.message || 'Error saving member');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400">
            <Heart className="w-6 h-6 fill-pink-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t.memberRegTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {t.memberRegSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        
        {/* Section 1: Member Identification */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <span>1. Bayanin Shaida & Lambar Memba</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.memberId} <span className="text-rose-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.memberId}
                  onChange={e => setFormData({ ...formData, memberId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-pink-400 font-mono text-sm focus:outline-none focus:border-pink-500 font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, memberId: generateNewMemberId() })}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 border border-slate-700"
                  title="Generate Unique ID"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.fullName} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Misali: Ibrahim Usman Danladi"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.age} <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="18"
                max="90"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.dob}
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.gender} <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Namiji / Male">Namiji / Male</option>
                <option value="Mace / Female">Mace / Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Contact */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <span>2. Wurin Zama & Lambobin Sadarwa</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.state} (Jiha) <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                {NIGERIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.city} (Gari / LGA)
              </label>
              <input
                type="text"
                placeholder="Misali: Kano Municipal, Kaduna North"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.prefMarriageLocation}
              </label>
              <input
                type="text"
                placeholder="Misali: Kano, Abuja, ko ko'ina"
                value={formData.preferredMarriageLocation}
                onChange={e => setFormData({ ...formData, preferredMarriageLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.phone} <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="Misali: 08031234567 ko +234..."
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.contactMethod}
              </label>
              <select
                value={formData.preferredContactMethod}
                onChange={e => setFormData({ ...formData, preferredContactMethod: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Kira (Call)">Kira (Call)</option>
                <option value="SMS">SMS</option>
                <option value="Telegram">Telegram</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Socio-demographic & Medical/Genotype Confidential */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <span>3. Ilimi, Sana'a & Matsayin Aure</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.education}
              </label>
              <select
                value={formData.educationLevel}
                onChange={e => setFormData({ ...formData, educationLevel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Diploma / NCE">Diploma / NCE</option>
                <option value="Bachelors / HND">Bachelors / HND</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
                <option value="Islamic Studies">Islamic Studies / Alaramma</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.occupation}
              </label>
              <input
                type="text"
                placeholder="Misali: Malami, Dan Kasuwa, Nurse"
                value={formData.occupation}
                onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.maritalStatus}
              </label>
              <select
                value={formData.maritalStatus}
                onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Never Married">Bai taɓa aure ba (Never Married)</option>
                <option value="Divorced">Bazawara / Bazawari (Divorced)</option>
                <option value="Widowed">Mai takaba (Widowed)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.childrenCount}
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.numberOfChildren}
                onChange={e => setFormData({ ...formData, numberOfChildren: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Genotype with Confidentiality Badge */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.genotype}</span>
                </label>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                  Restricted Staff Only
                </span>
              </div>
              <select
                value={formData.genotype}
                onChange={e => setFormData({ ...formData, genotype: e.target.value as any })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="AA">AA (Safe for all)</option>
                <option value="AS">AS (Carrier - Needs AA Partner)</option>
                <option value="SS">SS (Sickle Cell - Needs AA Partner)</option>
                <option value="AC">AC (Carrier)</option>
                <option value="SC">SC (Sickle Carrier)</option>
                <option value="Unknown">Unknown / Ba a sani ba</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                {t.genotypeNotice}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Desired Spouse Preferences */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <span>4. Bukatun Abokin Zama (Spouse Criteria)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.minAge} — {t.maxAge}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={formData.spouseAgeMin}
                  onChange={e => setFormData({ ...formData, spouseAgeMin: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="Min"
                />
                <span className="text-slate-500">-</span>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={formData.spouseAgeMax}
                  onChange={e => setFormData({ ...formData, spouseAgeMax: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.religiousPrefs}
              </label>
              <input
                type="text"
                placeholder="Misali: Mai sallah a kan lokaci, mai son zaman lafiya"
                value={formData.religiousPreferences}
                onChange={e => setFormData({ ...formData, religiousPreferences: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Karin Bayani kan Abokin Aure da ake nema
            </label>
            <textarea
              rows={2}
              placeholder="Bayyana dabi'u, halaye, da bukatun musamman..."
              value={formData.spouseOtherNotes}
              onChange={e => setFormData({ ...formData, spouseOtherNotes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Section 5: Plan, Payment & Consent */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <span>5. Tsarin Membanci, Biyan Kuɗi & Yarjejeniya</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.plan}
              </label>
              <select
                value={formData.membershipPlan}
                onChange={e => setFormData({ ...formData, membershipPlan: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Standard">{t.standard}</option>
                <option value="VIP">{t.vip}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.paymentStatus}
              </label>
              <select
                value={formData.paymentStatus}
                onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="pending">{t.statusPending} (Jiran Tabbatarwa)</option>
                <option value="confirmed">{t.statusConfirmed} (An Tabbatar)</option>
              </select>
            </div>
          </div>

          {/* Staff notes (authorized) */}
          {(currentRole === 'admin' || currentRole === 'staff') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                <span>{t.staffNotes} (Restricted)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Bayanai na musamman na ofishin jami'ai..."
                value={formData.notesRestricted}
                onChange={e => setFormData({ ...formData, notesRestricted: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
          )}

          {/* Mandatory Consent Checkbox */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-pink-500/30 flex items-start space-x-3">
            <input
              type="checkbox"
              id="consentCheck"
              checked={formData.consentGiven}
              onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
              className="mt-1 w-4 h-4 text-pink-600 rounded bg-slate-900 border-slate-700 focus:ring-pink-500 cursor-pointer"
              required
            />
            <label htmlFor="consentCheck" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              <span className="font-bold text-white block mb-0.5">{t.consentTitle}:</span>
              {t.consentText}
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? t.loading : t.saveMember}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
