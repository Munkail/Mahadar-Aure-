/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { translations } from '../i18n';
import { Language, UserRole, MemberProfile } from '../types';
import {
  X,
  ShieldCheck,
  Lock,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  CheckCircle,
  Clock,
  Printer
} from 'lucide-react';

interface MemberDetailsModalProps {
  member: MemberProfile | null;
  onClose: () => void;
  language: Language;
  currentRole: UserRole;
  onToggleVerification?: (member: MemberProfile) => void;
}

export const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  member,
  onClose,
  language,
  currentRole,
  onToggleVerification
}) => {
  if (!member) return null;
  const t = translations[language];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Title */}
        <div className="flex items-start space-x-4 pr-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-pink-600/30">
            {member.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {member.fullName}
              </h2>
              {member.isVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                {member.memberId}
              </span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{member.membershipPlan} Plan</span>
              <span>•</span>
              <span>{member.state} State</span>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">{t.maritalStatus}</span>
            <span className="font-bold text-white mt-0.5 block">{member.maritalStatus}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">{t.age} & {t.gender}</span>
            <span className="font-bold text-white mt-0.5 block">{member.age} yrs • {member.gender.split('/')[0]}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">{t.paymentStatus}</span>
            <span className={`font-bold mt-0.5 block ${member.paymentStatus === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {member.paymentStatus.toUpperCase()}
            </span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">{t.verified}</span>
            <span className={`font-bold mt-0.5 block ${member.isVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
              {member.isVerified ? 'Tabbatacce' : 'Jiran Bita'}
            </span>
          </div>
        </div>

        {/* Bio-data Details */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
          <h3 className="font-bold text-pink-400 uppercase tracking-wider text-[11px]">
            {language === 'ha' ? 'Cikakken Bayanin Memba' : 'Candidate Bio-Data'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-slate-500 block">{t.dob}:</span>
              <span className="font-medium text-white">{member.dateOfBirth || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.education}:</span>
              <span className="font-medium text-white">{member.educationLevel}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.occupation}:</span>
              <span className="font-medium text-white">{member.occupation}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.childrenCount}:</span>
              <span className="font-medium text-white">{member.numberOfChildren}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.languages}:</span>
              <span className="font-medium text-white">{member.languagesSpoken.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.prefMarriageLocation}:</span>
              <span className="font-medium text-white">{member.preferredMarriageLocation}</span>
            </div>
          </div>
        </div>

        {/* Restricted Genotype & Contact Details (ABAC Shield) */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'ha' ? 'Bayanin Genotype & Sadarwa (Sirri)' : 'Restricted Medical & Contact Data'}</span>
            </h4>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
              Role: {currentRole.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/20">
              <span className="text-slate-400 block text-[11px]">{t.genotype}:</span>
              <span className="text-base font-bold text-amber-300 font-mono">
                {member.genotype || 'Unknown'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 italic">
                {member.genotype === 'AA' ? 'Babu hadarin sickle-cell' : 'Yana bukatar abokin zama mai AA'}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/20">
              <span className="text-slate-400 block text-[11px]">{t.phone} ({member.preferredContactMethod}):</span>
              <span className="text-base font-bold text-white font-mono flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-pink-400" />
                {member.phoneNumber}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {language === 'ha' ? 'Ba a bayyana wa kowa ba sai da izini' : 'Strictly confidential, shared only with mutual consent'}
              </span>
            </div>
          </div>
        </div>

        {/* Spouse Preferences */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 text-xs">
          <h4 className="font-bold text-pink-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>{t.spousePrefs}</span>
          </h4>
          <div className="text-slate-300 space-y-1">
            <p>
              <span className="text-slate-500">Shekaru (Age):</span> {member.spousePreferences.ageMin} - {member.spousePreferences.ageMax} years
            </p>
            <p>
              <span className="text-slate-500">Jihohin da ake so:</span> {member.spousePreferences.states?.join(', ') || 'Ko\'ina'}
            </p>
            <p>
              <span className="text-slate-500">Ilimi:</span> {member.spousePreferences.educationLevels?.join(', ') || 'Duka'}
            </p>
            {member.spousePreferences.otherNotes && (
              <p className="italic text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800 mt-1">
                "{member.spousePreferences.otherNotes}"
              </p>
            )}
          </div>
        </div>

        {/* Staff Internal Notes (if present) */}
        {member.notesRestricted && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 block font-semibold text-[10px] uppercase">
              {t.staffNotes}:
            </span>
            <p className="text-slate-300 mt-1">{member.notesRestricted}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'ha' ? 'Buga Takarda (Print)' : 'Print Profile'}</span>
          </button>

          {onToggleVerification && (currentRole === 'admin' || currentRole === 'staff') && (
            <button
              onClick={() => onToggleVerification(member)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                member.isVerified
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {member.isVerified
                  ? (language === 'ha' ? 'Soke Tantancewa' : 'Revoke Verification')
                  : (language === 'ha' ? 'Tantance Memba Yanzu' : 'Verify Member Profile')}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
