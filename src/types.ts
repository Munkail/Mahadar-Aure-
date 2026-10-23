/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'staff' | 'member';

export type Language = 'ha' | 'en';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SpousePreferences {
  ageMin: number;
  ageMax: number;
  states: string[];
  educationLevels: string[];
  maritalStatuses: string[];
  otherNotes: string;
}

export interface MemberProfile {
  memberId: string;
  fullName: string;
  age: number;
  dateOfBirth: string;
  gender: 'Namiji / Male' | 'Mace / Female';
  state: string;
  city: string;
  preferredMarriageLocation: string;
  phoneNumber: string;
  preferredContactMethod: 'WhatsApp' | 'Kira (Call)' | 'SMS' | 'Telegram';
  educationLevel: 'Primary' | 'Secondary' | 'Diploma / NCE' | 'Bachelors / HND' | 'Masters' | 'PhD' | 'Islamic Studies';
  occupation: string;
  languagesSpoken: string[];
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed';
  numberOfChildren: number;
  genotype?: 'AA' | 'AS' | 'SS' | 'AC' | 'SC' | 'Unknown';
  religiousPreferences: string;
  spousePreferences: SpousePreferences;
  membershipPlan: 'Standard' | 'VIP';
  paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded';
  registrationDate: string;
  consentGiven: boolean;
  notesRestricted?: string;
  isVerified: boolean;
  isActive: boolean;
  isArchived: boolean;
  createdBy: string;
  updatedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  memberId: string;
  memberName: string;
  plan: 'Standard' | 'VIP';
  amountNaira: number;
  paymentReference: string;
  paymentDate: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded';
  reviewedByStaffId: string;
  verifiedAt: string;
  notes: string;
}

export interface Enquiry {
  id: string;
  memberId?: string;
  senderName: string;
  senderContact: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  assignedStaff?: string;
  staffNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MatchmakingSuggestion {
  id: string;
  candidateAId: string;
  candidateBId: string;
  candidateAName: string;
  candidateBName: string;
  candidateAGender: string;
  candidateBGender: string;
  compatibilityScore: number;
  matchingFactors: string[];
  nonMatchingFactors: string[];
  explanationHausa: string;
  explanationEnglish: string;
  staffStatus: 'pending' | 'approved' | 'rejected' | 'modified';
  reviewedByStaff?: string;
  reviewedAt?: string;
  consentA: boolean;
  consentB: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  qHausa: string;
  aHausa: string;
  qEnglish: string;
  aEnglish: string;
}

export interface AppSettings {
  id: string;
  serviceName: string;
  tagline: string;
  standardPriceNaira: number;
  vipPriceNaira: number;
  contactWhatsApp: string;
  contactTelegram: string;
  contactFacebook: string;
  contactWhatsAppChannel: string;
  privacyPolicyTextHausa: string;
  privacyPolicyTextEnglish: string;
  faqs: FAQItem[];
  registrationRequirementsHausa: string[];
  registrationRequirementsEnglish: string[];
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  performedBy: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  titleHausa: string;
  titleEnglish: string;
  messageHausa: string;
  messageEnglish: string;
  type: 'match' | 'payment' | 'system' | 'enquiry';
  timestamp: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
