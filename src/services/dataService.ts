/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  MemberProfile,
  PaymentRecord,
  Enquiry,
  MatchmakingSuggestion,
  AppSettings,
  AuditLog,
  AppNotification
} from '../types';
import {
  initialSettings,
  sampleMembers,
  samplePayments,
  sampleEnquiries,
  sampleSuggestions,
  sampleNotifications,
  sampleAuditLogs
} from './initialData';

const STORAGE_KEYS = {
  MEMBERS: 'mahadar_members_v1',
  PAYMENTS: 'mahadar_payments_v1',
  ENQUIRIES: 'mahadar_enquiries_v1',
  SUGGESTIONS: 'mahadar_suggestions_v1',
  SETTINGS: 'mahadar_settings_v1',
  AUDIT: 'mahadar_audit_v1',
  NOTIFS: 'mahadar_notifs_v1'
};

class DataService {
  private isOnline = true;

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(sampleMembers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(samplePayments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(sampleEnquiries));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUGGESTIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(sampleSuggestions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(sampleNotifications));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(sampleAuditLogs));
    }
  }

  // Settings
  async getSettings(): Promise<AppSettings> {
    try {
      const snap = await getDocs(collection(db, 'appSettings'));
      if (!snap.empty) {
        const data = snap.docs[0].data() as AppSettings;
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'appSettings');
    }
    const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return local ? JSON.parse(local) : initialSettings;
  }

  async updateSettings(settings: AppSettings, actor: string): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    try {
      await setDoc(doc(db, 'appSettings', settings.id || 'general'), settings);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'appSettings');
    }
    await this.addAuditLog(actor, 'UPDATE_SETTINGS', 'appSettings', settings.id, 'Saitunan farashi da lambobin sadarwa an sabunta su.');
  }

  // Members
  async getMembers(): Promise<MemberProfile[]> {
    try {
      const snap = await getDocs(collection(db, 'memberProfiles'));
      if (!snap.empty) {
        const list: MemberProfile[] = [];
        snap.forEach(d => list.push(d.data() as MemberProfile));
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(list));
        return list;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'memberProfiles');
    }
    const local = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return local ? JSON.parse(local) : sampleMembers;
  }

  async addMember(profile: MemberProfile, actor: string): Promise<void> {
    const list = await this.getMembers();
    if (list.some(m => m.memberId.toLowerCase() === profile.memberId.toLowerCase())) {
      throw new Error('DUPLICATE_MEMBER_ID');
    }
    const updated = [profile, ...list];
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'memberProfiles', profile.memberId), profile);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `memberProfiles/${profile.memberId}`);
    }

    await this.addAuditLog(
      actor,
      'REGISTER_MEMBER',
      'memberProfiles',
      profile.memberId,
      `Rijistar sabon memba: ${profile.fullName} (${profile.membershipPlan})`
    );

    await this.addNotification({
      id: `notif-${Date.now()}`,
      titleHausa: `Sabuwar Rijista: ${profile.fullName}`,
      titleEnglish: `New Member Registered: ${profile.fullName}`,
      messageHausa: `An yi nasarar rijistar ${profile.fullName} daga jihar ${profile.state}.`,
      messageEnglish: `Successfully registered ${profile.fullName} from ${profile.state} state.`,
      type: 'system',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false
    });
  }

  async updateMember(profile: MemberProfile, actor: string): Promise<void> {
    const list = await this.getMembers();
    const updated = list.map(m => (m.memberId === profile.memberId ? profile : m));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'memberProfiles', profile.memberId), profile, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `memberProfiles/${profile.memberId}`);
    }

    await this.addAuditLog(actor, 'UPDATE_MEMBER', 'memberProfiles', profile.memberId, `An sabunta bayanan memba: ${profile.fullName}`);
  }

  // Payments
  async getPayments(): Promise<PaymentRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'paymentRecords'));
      if (!snap.empty) {
        const list: PaymentRecord[] = [];
        snap.forEach(d => list.push(d.data() as PaymentRecord));
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
        return list;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'paymentRecords');
    }
    const local = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return local ? JSON.parse(local) : samplePayments;
  }

  async recordPayment(payment: PaymentRecord, actor: string): Promise<void> {
    const list = await this.getPayments();
    const updated = [payment, ...list];
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'paymentRecords', payment.paymentId), payment);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `paymentRecords/${payment.paymentId}`);
    }

    // Also update member's payment status if confirmed
    if (payment.paymentStatus === 'confirmed') {
      const members = await this.getMembers();
      const target = members.find(m => m.memberId === payment.memberId);
      if (target) {
        target.paymentStatus = 'confirmed';
        target.isVerified = true;
        await this.updateMember(target, actor);
      }
    }

    await this.addAuditLog(
      actor,
      'RECORD_PAYMENT',
      'paymentRecords',
      payment.paymentId,
      `Biyan kudi ₦${payment.amountNaira.toLocaleString()} na ${payment.memberName} (${payment.paymentStatus})`
    );
  }

  async confirmPayment(paymentId: string, actor: string): Promise<void> {
    const list = await this.getPayments();
    const item = list.find(p => p.paymentId === paymentId);
    if (!item) return;

    item.paymentStatus = 'confirmed';
    item.reviewedByStaffId = actor;
    item.verifiedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));

    try {
      await setDoc(doc(db, 'paymentRecords', paymentId), item, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `paymentRecords/${paymentId}`);
    }

    // Update member
    const members = await this.getMembers();
    const target = members.find(m => m.memberId === item.memberId);
    if (target) {
      target.paymentStatus = 'confirmed';
      target.isVerified = true;
      await this.updateMember(target, actor);
    }

    await this.addAuditLog(actor, 'CONFIRM_PAYMENT', 'paymentRecords', paymentId, `An tabbatar da biyan ₦${item.amountNaira} na ${item.memberName}`);
  }

  // Enquiries
  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const snap = await getDocs(collection(db, 'enquiries'));
      if (!snap.empty) {
        const list: Enquiry[] = [];
        snap.forEach(d => list.push(d.data() as Enquiry));
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(list));
        return list;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'enquiries');
    }
    const local = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return local ? JSON.parse(local) : sampleEnquiries;
  }

  async createEnquiry(enquiry: Enquiry): Promise<void> {
    const list = await this.getEnquiries();
    const updated = [enquiry, ...list];
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'enquiries', enquiry.id), enquiry);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `enquiries/${enquiry.id}`);
    }
  }

  async updateEnquiryStatus(id: string, status: 'open' | 'in_progress' | 'resolved', notes: string, actor: string): Promise<void> {
    const list = await this.getEnquiries();
    const item = list.find(e => e.id === id);
    if (!item) return;

    item.status = status;
    item.assignedStaff = actor;
    if (notes) item.staffNotes = notes;
    item.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(list));

    try {
      await setDoc(doc(db, 'enquiries', id), item, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `enquiries/${id}`);
    }
    await this.addAuditLog(actor, 'UPDATE_ENQUIRY', 'enquiries', id, `Matsayin koke ya koma ${status}`);
  }

  // Matchmaking suggestions
  async getMatchSuggestions(): Promise<MatchmakingSuggestion[]> {
    try {
      const snap = await getDocs(collection(db, 'matchmakingSuggestions'));
      if (!snap.empty) {
        const list: MatchmakingSuggestion[] = [];
        snap.forEach(d => list.push(d.data() as MatchmakingSuggestion));
        localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(list));
        return list;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'matchmakingSuggestions');
    }
    const local = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
    return local ? JSON.parse(local) : sampleSuggestions;
  }

  async addMatchSuggestion(sug: MatchmakingSuggestion, actor: string): Promise<void> {
    const list = await this.getMatchSuggestions();
    const updated = [sug, ...list];
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'matchmakingSuggestions', sug.id), sug);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `matchmakingSuggestions/${sug.id}`);
    }
    await this.addAuditLog(actor, 'CREATE_MATCH_SUGGESTION', 'matchmakingSuggestions', sug.id, `An samar da shawara tsakanin ${sug.candidateAName} da ${sug.candidateBName}`);
  }

  async updateMatchStatus(id: string, status: 'approved' | 'rejected' | 'modified', actor: string): Promise<void> {
    const list = await this.getMatchSuggestions();
    const item = list.find(s => s.id === id);
    if (!item) return;
    item.staffStatus = status;
    item.reviewedByStaff = actor;
    item.reviewedAt = new Date().toISOString().substring(0, 10);
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(list));

    try {
      await setDoc(doc(db, 'matchmakingSuggestions', id), item, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matchmakingSuggestions/${id}`);
    }
    await this.addAuditLog(actor, 'EVALUATE_MATCH', 'matchmakingSuggestions', id, `Matsayin sasanta aure ya zama: ${status}`);
  }

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    const local = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return local ? JSON.parse(local) : sampleNotifications;
  }

  async addNotification(notif: AppNotification): Promise<void> {
    const list = await this.getNotifications();
    const updated = [notif, ...list];
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(updated));
  }

  async markAllNotificationsRead(): Promise<void> {
    const list = await this.getNotifications();
    const updated = list.map(n => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(updated));
  }

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const snap = await getDocs(collection(db, 'auditLogs'));
      if (!snap.empty) {
        const list: AuditLog[] = [];
        snap.forEach(d => list.push(d.data() as AuditLog));
        list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
        localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(list));
        return list;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'auditLogs');
    }
    const local = localStorage.getItem(STORAGE_KEYS.AUDIT);
    const list: AuditLog[] = local ? JSON.parse(local) : sampleAuditLogs;
    return list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
  }

  async addAuditLog(performedBy: string, action: string, targetEntity: string, targetId: string, details: string): Promise<void> {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      performedBy,
      action,
      targetEntity,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    const list = await this.getAuditLogs();
    const updated = [newLog, ...list];
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'auditLogs', newLog.id), newLog);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `auditLogs/${newLog.id}`);
    }
  }

  // Compute live statistics directly from database records
  async computeDashboardStats() {
    const [members, payments, enquiries, suggestions] = await Promise.all([
      this.getMembers(),
      this.getPayments(),
      this.getEnquiries(),
      this.getMatchSuggestions()
    ]);

    const totalMembers = members.length;
    const verifiedProfiles = members.filter(m => m.isVerified).length;
    const pendingApplications = members.filter(m => !m.isVerified && !m.isArchived).length;
    const activeMembers = members.filter(m => m.isActive && !m.isArchived).length;
    const inactiveMembers = members.filter(m => !m.isActive || m.isArchived).length;
    const standardPlanCount = members.filter(m => m.membershipPlan === 'Standard').length;
    const vipPlanCount = members.filter(m => m.membershipPlan === 'VIP').length;

    // New registrations in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newRegistrations = members.filter(m => new Date(m.registrationDate) >= thirtyDaysAgo).length;

    const pendingMatches = suggestions.filter(s => s.staffStatus === 'pending').length;
    const unansweredEnquiries = enquiries.filter(e => e.status === 'open').length;

    const totalConfirmedFunds = payments
      .filter(p => p.paymentStatus === 'confirmed')
      .reduce((sum, p) => sum + (p.amountNaira || 0), 0);

    return {
      totalMembers,
      newRegistrations,
      pendingApplications,
      verifiedProfiles,
      activeMembers,
      inactiveMembers,
      standardPlanCount,
      vipPlanCount,
      pendingMatches,
      unansweredEnquiries,
      totalConfirmedFunds
    };
  }

  // Compatibility Engine
  calculateCompatibility(candA: MemberProfile, candB: MemberProfile): MatchmakingSuggestion {
    let score = 50;
    const matchingFactors: string[] = [];
    const nonMatchingFactors: string[] = [];

    // Gender check
    const isHetero = candA.gender !== candB.gender;
    if (isHetero) {
      score += 15;
      matchingFactors.push('Jinsi ya Halal: Namiji da Mace masu neman aure.');
    } else {
      nonMatchingFactors.push('Jinsi iri daya (Dole ne ya zama Namiji da Mace a shari\'ance).');
      score -= 40;
    }

    // Age check
    const aPrefs = candA.spousePreferences;
    const bPrefs = candB.spousePreferences;

    const aAgeOkForB = !bPrefs.ageMin || (candA.age >= bPrefs.ageMin && candA.age <= bPrefs.ageMax);
    const bAgeOkForA = !aPrefs.ageMin || (candB.age >= aPrefs.ageMin && candB.age <= aPrefs.ageMax);

    if (aAgeOkForB && bAgeOkForA) {
      score += 15;
      matchingFactors.push(`Matsayin Shekaru ya dace: ${candA.fullName} (${candA.age}) da ${candB.fullName} (${candB.age}).`);
    } else {
      nonMatchingFactors.push(`Bambancin shekaru bai cika bukatun da aka zaba ba.`);
      score -= 10;
    }

    // State / Location
    const stateMatch = candA.state.toLowerCase() === candB.state.toLowerCase() ||
      (aPrefs.states && aPrefs.states.some(s => s.toLowerCase().includes(candB.state.toLowerCase()))) ||
      (bPrefs.states && bPrefs.states.some(s => s.toLowerCase().includes(candA.state.toLowerCase())));

    if (stateMatch) {
      score += 15;
      matchingFactors.push(`Wurin zama ya dace: ${candA.state} da ${candB.state} suna da saukin haduwa.`);
    } else {
      nonMatchingFactors.push(`Jihohi sun sha bamban: ${candA.state} da ${candB.state} (yana bukatar amincewar tafiya ko kaura).`);
    }

    // Marital Status
    const aStatusOk = !bPrefs.maritalStatuses || bPrefs.maritalStatuses.length === 0 || bPrefs.maritalStatuses.includes(candA.maritalStatus);
    const bStatusOk = !aPrefs.maritalStatuses || aPrefs.maritalStatuses.length === 0 || aPrefs.maritalStatuses.includes(candB.maritalStatus);

    if (aStatusOk && bStatusOk) {
      score += 10;
      matchingFactors.push(`Matsayin aure ya dace: ${candA.maritalStatus} da ${candB.maritalStatus}.`);
    } else {
      nonMatchingFactors.push(`Wani bangare ya zabi matsayin aure na daban.`);
    }

    // Languages overlap
    const langOverlap = candA.languagesSpoken.filter(l => candB.languagesSpoken.includes(l));
    if (langOverlap.length > 0) {
      score += 10;
      matchingFactors.push(`Harsunan magana sun hadu: ${langOverlap.join(', ')}.`);
    } else {
      nonMatchingFactors.push(`Babu harshen magana guda da aka hada.`);
    }

    // Genotype medical compatibility check
    const gA = candA.genotype || 'Unknown';
    const gB = candB.genotype || 'Unknown';

    if (gA !== 'Unknown' && gB !== 'Unknown') {
      const isSickleCarrierA = gA === 'AS' || gA === 'AC' || gA === 'SS';
      const isSickleCarrierB = gB === 'AS' || gB === 'AC' || gB === 'SS';

      if (isSickleCarrierA && isSickleCarrierB) {
        nonMatchingFactors.push(`GARGADI NA GENOTYPE: ${candA.fullName} (${gA}) da ${candB.fullName} (${gB}) suna da hadarin haifar da yaro mai cutar Sickle Cell (SS). Dole ne a yi musu karin bayanin likita kafin aure.`);
        score -= 25;
      } else {
        score += 10;
        matchingFactors.push(`Genotype ya dace a kimiyyance: ${gA} da ${gB} babu hadarin sickle-cell ga zuriya.`);
      }
    }

    // Cap score 0 - 98 (never 100% because final outcome is up to Allah and human consent)
    const finalScore = Math.max(15, Math.min(96, score));

    const explanationHausa = `Binciken tsarin ya nuna daidaituwa ta kashi ${finalScore}%. ${
      matchingFactors.length > 0 ? `Abubuwan da suka dace sun hada da: ${matchingFactors.slice(0, 2).join('; ')}.` : ''
    } ${nonMatchingFactors.length > 0 ? `Bambance-bambance: ${nonMatchingFactors.slice(0, 2).join('; ')}.` : ''} Jami'in aiki zai bincika amincewar iyaye da waliyyai kafin kowace gabatarwa.`;

    const explanationEnglish = `Calculated compatibility score is ${finalScore}%. Factors matched: ${matchingFactors.slice(0, 2).join('; ')}. Differences: ${nonMatchingFactors.slice(0, 2).join('; ')}. Human review and wali/guardian consent are mandatory.`;

    return {
      id: `SUG-${Date.now()}`,
      candidateAId: candA.memberId,
      candidateBId: candB.memberId,
      candidateAName: candA.fullName,
      candidateBName: candB.fullName,
      candidateAGender: candA.gender,
      candidateBGender: candB.gender,
      compatibilityScore: finalScore,
      matchingFactors,
      nonMatchingFactors,
      explanationHausa,
      explanationEnglish,
      staffStatus: 'pending',
      reviewedByStaff: 'Pending Staff Review',
      reviewedAt: '-',
      consentA: false,
      consentB: false,
      createdAt: new Date().toISOString()
    };
  }

  // Export CSV (Safe fields only, excluding genotype and staff internal notes)
  async exportMembersCsv(actor: string): Promise<string> {
    const members = await this.getMembers();
    const headers = [
      'Member ID',
      'Full Name',
      'Age',
      'Gender',
      'State',
      'City',
      'Education',
      'Occupation',
      'Marital Status',
      'Children',
      'Plan',
      'Payment Status',
      'Verified',
      'Registration Date'
    ];

    const rows = members.map(m => [
      `"${m.memberId}"`,
      `"${m.fullName}"`,
      m.age,
      `"${m.gender}"`,
      `"${m.state}"`,
      `"${m.city}"`,
      `"${m.educationLevel}"`,
      `"${m.occupation}"`,
      `"${m.maritalStatus}"`,
      m.numberOfChildren,
      `"${m.membershipPlan}"`,
      `"${m.paymentStatus}"`,
      m.isVerified ? 'Yes' : 'No',
      `"${m.registrationDate.substring(0, 10)}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    await this.addAuditLog(
      actor,
      'EXPORT_MEMBERS_CSV',
      'memberProfiles',
      'all',
      `An fitar da bayanan membobi zuwa CSV (an kiyaye sirrin genotype da bayanin waya).`
    );

    return csvContent;
  }
}

export const dataService = new DataService();
