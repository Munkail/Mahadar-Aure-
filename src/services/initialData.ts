/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemberProfile, PaymentRecord, Enquiry, MatchmakingSuggestion, AppSettings, AuditLog, AppNotification } from '../types';

export const initialSettings: AppSettings = {
  id: 'general',
  serviceName: 'Mahadar Aure',
  tagline: 'Haɗa Zuciya, Gina Gida, Gina Al’umma',
  standardPriceNaira: 3000,
  vipPriceNaira: 5000,
  contactWhatsApp: '09165006713',
  contactTelegram: 'https://t.me/Mahadaraure',
  contactFacebook: 'https://www.facebook.com/mahadaraure',
  contactWhatsAppChannel: 'https://whatsapp.com/channel/0029VbCDhJrHrDZb9cyYdu08',
  privacyPolicyTextHausa: 'Mahadar Aure tana kare bayanan sirrin membobi bisa tsarin dokar Najeriya ta NDPR da koyarwar Musulunci. Ba a bayyana bayanan waya ko genotype ga jama\'a.',
  privacyPolicyTextEnglish: 'Mahadar Aure respects your privacy under the Nigeria Data Protection Regulation (NDPR) and Islamic jurisprudence. Genotype and phone records are kept strictly confidential.',
  faqs: [
    {
      id: 'faq-1',
      qHausa: 'Menene Mahadar Aure?',
      aHausa: 'Mahadar Aure sabis ne na musamman da aka kafa a Najeriya don taimakawa manya (18+) samun abokan zama nagari bisa tsarin shari\'ar Musulunci da al\'adun Hausa.',
      qEnglish: 'What is Mahadar Aure?',
      aEnglish: 'Mahadar Aure is an Islamic and cultural matchmaking agency in Nigeria helping consenting adults (18+) find righteous spouses through verified procedures.'
    },
    {
      id: 'faq-2',
      qHausa: 'Yaya ake rajista?',
      aHausa: 'Ana cike bayanan memba ta hanyar amincewa, tantance shekaru (18+), zabar tsarin Standard (₦3,000) ko VIP (₦5,000), da gabatar da shaidar biya ga jami\'i.',
      qEnglish: 'How do I register?',
      aEnglish: 'Complete the registration form with consent, 18+ age verification, select Standard (₦3,000) or VIP (₦5,000) plan, and submit payment confirmation.'
    },
    {
      id: 'faq-3',
      qHausa: 'Shin ana bayyana lambar waya da genotype?',
      aHausa: 'A\'a, asirin genotype yana hannun jami\'an da aka ba izini kawai domin shawarwarin kariya daga sickle-cell. Haka kuma lambobin waya sai da izinin bangarorin biyu.',
      qEnglish: 'Are phone numbers and genotype made public?',
      aEnglish: 'No. Genotype records are strictly restricted to authorized staff for sickle-cell counseling. Contact details are never shared without explicit mutual consent.'
    }
  ],
  registrationRequirementsHausa: [
    'Dole ne mutum ya kai shekaru 18 ko sama da haka (Baligi).',
    'Yin biyayya ga ka\'idojin addinin Musulunci da girmama iyaye/waliyyai.',
    'Biyan kudin rajista: Standard (₦3,000) ko VIP (₦5,000).',
    'Bayyana gaskiya game da matsayin aure (Never Married, Divorced, Widowed).'
  ],
  registrationRequirementsEnglish: [
    'Must be a consenting adult aged 18 and above.',
    'Adherence to Islamic marriage values and guardian (Wali) involvement.',
    'Payment of subscription fee: Standard (₦3,000) or VIP (₦5,000).',
    'Honest disclosure of marital history (Never Married, Divorced, Widowed).'
  ],
  updatedAt: new Date().toISOString()
};

export const sampleMembers: MemberProfile[] = [
  {
    memberId: 'MA-2026-1001',
    fullName: 'Ibrahim Usman Danladi',
    age: 31,
    dateOfBirth: '1995-04-12',
    gender: 'Namiji / Male',
    state: 'Kano',
    city: 'Kano Municipal',
    preferredMarriageLocation: 'Kano ko Kaduna',
    phoneNumber: '08031234567',
    preferredContactMethod: 'WhatsApp',
    educationLevel: 'Bachelors / HND',
    occupation: 'Malami & Dan Kasuwa',
    languagesSpoken: ['Hausa', 'English', 'Arabic'],
    maritalStatus: 'Never Married',
    numberOfChildren: 0,
    genotype: 'AA',
    religiousPreferences: 'Mai kiyaye sallah biyar da son zaman lafiya a kan sunnah.',
    spousePreferences: {
      ageMin: 20,
      ageMax: 27,
      states: ['Kano', 'Kaduna', 'Jigawa'],
      educationLevels: ['Secondary', 'Diploma / NCE', 'Bachelors / HND'],
      maritalStatuses: ['Never Married'],
      otherNotes: 'Mace mai nutsuwa da kiyaye mutuncin gida.'
    },
    membershipPlan: 'VIP',
    paymentStatus: 'confirmed',
    registrationDate: '2026-03-01T10:00:00Z',
    consentGiven: true,
    notesRestricted: 'An bincika shaidar zama a Kano, an tabbatar da asusun banki.',
    isVerified: true,
    isActive: true,
    isArchived: false,
    createdBy: 'admin-system',
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    memberId: 'MA-2026-1002',
    fullName: 'Fatima Amina Bello',
    age: 24,
    dateOfBirth: '2002-08-19',
    gender: 'Mace / Female',
    state: 'Kaduna',
    city: 'Kaduna North',
    preferredMarriageLocation: 'Kaduna, Kano ko Abuja',
    phoneNumber: '08129876543',
    preferredContactMethod: 'WhatsApp',
    educationLevel: 'Bachelors / HND',
    occupation: 'Ma\'aikaciyar Asibiti (Nurse)',
    languagesSpoken: ['Hausa', 'English'],
    maritalStatus: 'Never Married',
    numberOfChildren: 0,
    genotype: 'AS',
    religiousPreferences: 'Mai tsoron Allah, mai aiki da ilimi.',
    spousePreferences: {
      ageMin: 28,
      ageMax: 35,
      states: ['Kaduna', 'Kano', 'Abuja'],
      educationLevels: ['Bachelors / HND', 'Masters'],
      maritalStatuses: ['Never Married', 'Divorced'],
      otherNotes: 'Namiji mai sana\'a tsayayyiya kuma mai genotype AA.'
    },
    membershipPlan: 'VIP',
    paymentStatus: 'confirmed',
    registrationDate: '2026-03-05T14:30:00Z',
    consentGiven: true,
    notesRestricted: 'Iyayenta suna da masaniya kuma an gana da waliyyi.',
    isVerified: true,
    isActive: true,
    isArchived: false,
    createdBy: 'staff-zainab',
    updatedAt: '2026-03-05T14:30:00Z'
  },
  {
    memberId: 'MA-2026-1003',
    fullName: 'Abubakar Saddiq Gwandu',
    age: 36,
    dateOfBirth: '1990-01-15',
    gender: 'Namiji / Male',
    state: 'Sokoto',
    city: 'Sokoto South',
    preferredMarriageLocation: 'Sokoto, Kebbi ko Zamfara',
    phoneNumber: '08065544332',
    preferredContactMethod: 'Kira (Call)',
    educationLevel: 'Masters',
    occupation: 'Babban Akanta a Ma\'aikata',
    languagesSpoken: ['Hausa', 'English', 'Fulfulde'],
    maritalStatus: 'Widowed',
    numberOfChildren: 2,
    genotype: 'AA',
    religiousPreferences: 'Mai sanin ya kamata kuma mai tausayin marayu.',
    spousePreferences: {
      ageMin: 25,
      ageMax: 33,
      states: ['Sokoto', 'Kebbi', 'Zamfara', 'Kano'],
      educationLevels: ['Diploma / NCE', 'Bachelors / HND'],
      maritalStatuses: ['Never Married', 'Divorced', 'Widowed'],
      otherNotes: 'Mai kaunatar yara da son addini.'
    },
    membershipPlan: 'Standard',
    paymentStatus: 'confirmed',
    registrationDate: '2026-03-10T09:15:00Z',
    consentGiven: true,
    notesRestricted: 'Matarsa ta rasu shekaru 3 da suka wuce.',
    isVerified: true,
    isActive: true,
    isArchived: false,
    createdBy: 'staff-zainab',
    updatedAt: '2026-03-10T09:15:00Z'
  },
  {
    memberId: 'MA-2026-1004',
    fullName: 'Zainab Kabir Aliyu',
    age: 28,
    dateOfBirth: '1998-11-22',
    gender: 'Mace / Female',
    state: 'Kano',
    city: 'Nassarawa',
    preferredMarriageLocation: 'Kano ko Abuja',
    phoneNumber: '07038899001',
    preferredContactMethod: 'Telegram',
    educationLevel: 'Diploma / NCE',
    occupation: 'Dinki & Kwalliyar Gida',
    languagesSpoken: ['Hausa', 'English'],
    maritalStatus: 'Divorced',
    numberOfChildren: 1,
    genotype: 'AA',
    religiousPreferences: 'Mai salla a kan kari da rikon amana.',
    spousePreferences: {
      ageMin: 32,
      ageMax: 42,
      states: ['Kano', 'Kaduna', 'Abuja', 'Sokoto'],
      educationLevels: ['Diploma / NCE', 'Bachelors / HND', 'Masters'],
      maritalStatuses: ['Divorced', 'Widowed', 'Never Married'],
      otherNotes: 'Wanda zai rike ta da danta da mutunci.'
    },
    membershipPlan: 'Standard',
    paymentStatus: 'pending',
    registrationDate: '2026-03-12T16:20:00Z',
    consentGiven: true,
    notesRestricted: 'Tana jiran tabbatar da biyan kudin rijista na Naira 3,000.',
    isVerified: false,
    isActive: true,
    isArchived: false,
    createdBy: 'self-registration',
    updatedAt: '2026-03-12T16:20:00Z'
  },
  {
    memberId: 'MA-2026-1005',
    fullName: 'Mustapha Lawan Katsina',
    age: 29,
    dateOfBirth: '1997-06-03',
    gender: 'Namiji / Male',
    state: 'Katsina',
    city: 'Katsina City',
    preferredMarriageLocation: 'Katsina ko Kano',
    phoneNumber: '08144223311',
    preferredContactMethod: 'WhatsApp',
    educationLevel: 'Bachelors / HND',
    occupation: 'Injiniyan Fasahar Sadarwa (IT)',
    languagesSpoken: ['Hausa', 'English'],
    maritalStatus: 'Never Married',
    numberOfChildren: 0,
    genotype: 'AA',
    religiousPreferences: 'Mai son karatu da bin tafarkin Ahlussunnah.',
    spousePreferences: {
      ageMin: 20,
      ageMax: 26,
      states: ['Katsina', 'Kano', 'Kaduna'],
      educationLevels: ['Secondary', 'Diploma / NCE', 'Bachelors / HND'],
      maritalStatuses: ['Never Married'],
      otherNotes: 'Mace mai ilimin addini da son ci gaba.'
    },
    membershipPlan: 'VIP',
    paymentStatus: 'confirmed',
    registrationDate: '2026-03-14T11:45:00Z',
    consentGiven: true,
    notesRestricted: 'Yana aiki a kamfanin sadarwa a Katsina.',
    isVerified: true,
    isActive: true,
    isArchived: false,
    createdBy: 'staff-ahmed',
    updatedAt: '2026-03-14T11:45:00Z'
  }
];

export const samplePayments: PaymentRecord[] = [
  {
    paymentId: 'PAY-2026-01',
    memberId: 'MA-2026-1001',
    memberName: 'Ibrahim Usman Danladi',
    plan: 'VIP',
    amountNaira: 5000,
    paymentReference: 'TRX-NIG-894721',
    paymentDate: '2026-03-01',
    paymentStatus: 'confirmed',
    reviewedByStaffId: 'staff-admin',
    verifiedAt: '2026-03-01 11:15',
    notes: 'An tabbatar da tura kudin ta GTBank zuwa asusun Mahadar Aure.'
  },
  {
    paymentId: 'PAY-2026-02',
    memberId: 'MA-2026-1002',
    memberName: 'Fatima Amina Bello',
    plan: 'VIP',
    amountNaira: 5000,
    paymentReference: 'TRX-NIG-903124',
    paymentDate: '2026-03-05',
    paymentStatus: 'confirmed',
    reviewedByStaffId: 'staff-zainab',
    verifiedAt: '2026-03-05 15:00',
    notes: 'Kudin rijistar VIP an tabbatar da shaidar asusun First Bank.'
  },
  {
    paymentId: 'PAY-2026-03',
    memberId: 'MA-2026-1003',
    memberName: 'Abubakar Saddiq Gwandu',
    plan: 'Standard',
    amountNaira: 3000,
    paymentReference: 'TRX-NIG-772910',
    paymentDate: '2026-03-10',
    paymentStatus: 'confirmed',
    reviewedByStaffId: 'staff-zainab',
    verifiedAt: '2026-03-10 10:20',
    notes: 'Kudin Standard an karba a asusun Jaiz Bank.'
  },
  {
    paymentId: 'PAY-2026-04',
    memberId: 'MA-2026-1004',
    memberName: 'Zainab Kabir Aliyu',
    plan: 'Standard',
    amountNaira: 3000,
    paymentReference: 'TRX-NIG-998822',
    paymentDate: '2026-03-12',
    paymentStatus: 'pending',
    reviewedByStaffId: 'staff-pending',
    verifiedAt: '-',
    notes: 'Memba ta aika shaidar biya ta WhatsApp, jami\'i na kan dubawa.'
  }
];

export const sampleEnquiries: Enquiry[] = [
  {
    id: 'ENQ-01',
    memberId: 'MA-2026-1004',
    senderName: 'Zainab Kabir Aliyu',
    senderContact: '07038899001',
    subject: 'Tambaya game da tabbatar da biyan kudin Standard',
    message: 'Salamu alaikum, na tura kudin ₦3,000 na Standard a ranar 12 ga wata, ina so in san yaushe asusuna zai zama verified?',
    status: 'open',
    assignedStaff: 'Staff Zainab',
    staffNotes: 'Za a duba asusun Jaiz banki da zarar an shiga ofis.',
    createdAt: '2026-03-12T17:00:00Z'
  },
  {
    id: 'ENQ-02',
    senderName: 'Malam Dahiru Zaria',
    senderContact: '08023456789',
    subject: 'Yadda ake neman shawara kafin a fara gabatarwa',
    message: 'Ina son sanin ko kuna da malaman da ke ba da shawarwarin fahimtar juna kafin auren farko?',
    status: 'in_progress',
    assignedStaff: 'Ustaz Lawal',
    staffNotes: 'An kira shi an yi masa bayanin shirin Pre-marital Counseling.',
    createdAt: '2026-03-13T11:20:00Z'
  }
];

export const sampleSuggestions: MatchmakingSuggestion[] = [
  {
    id: 'SUG-01',
    candidateAId: 'MA-2026-1001',
    candidateBId: 'MA-2026-1002',
    candidateAName: 'Ibrahim Usman Danladi',
    candidateBName: 'Fatima Amina Bello',
    candidateAGender: 'Namiji / Male',
    candidateBGender: 'Mace / Female',
    compatibilityScore: 92,
    matchingFactors: [
      'Jihohi da aka fi so: Kano da Kaduna suna makwabtaka da saukin ziyarar waliyyi',
      'Matsayin Shekaru: Ibrahim (31) yana cikin kewayon da Fatima take bukata (28-35)',
      'Matakin Karatu: Dukansu suna da digiri/HND',
      'Genotype: Ibrahim (AA) da Fatima (AS) sun dace bisa ka\'idar kariya daga cutar sickle cell (Babu hadarin SS)'
    ],
    nonMatchingFactors: [
      'Gari: Ibrahim yana Kano, Fatima tana Kaduna (yana buƙatar amincewar wurin zama)'
    ],
    explanationHausa: 'Daidaituwar ta kai kashi 92%. Dukkan bangarorin biyu suna da ilimi mai zurfi, shekarunsu sun dace, kuma babu matsalar genotype domin AA da AS na iya aure lafiya.',
    explanationEnglish: 'Strong compatibility of 92%. Suitable age ranges, matching tertiary education, and medically compatible genotypes (AA and AS, safe from sickle-cell anemia).',
    staffStatus: 'pending',
    reviewedByStaff: 'Staff Zainab',
    reviewedAt: '2026-03-15',
    consentA: true,
    consentB: false,
    createdAt: '2026-03-15T09:00:00Z'
  }
];

export const sampleNotifications: AppNotification[] = [
  {
    id: 'NOTIF-1',
    titleHausa: 'Sabuwar Rijista a Tsarin VIP',
    titleEnglish: 'New VIP Member Registered',
    messageHausa: 'An yi nasarar rijistar Mustapha Lawan Katsina a matsayin VIP.',
    messageEnglish: 'Mustapha Lawan Katsina has successfully registered as a VIP member.',
    type: 'system',
    timestamp: '2026-03-14 11:45',
    isRead: false
  },
  {
    id: 'NOTIF-2',
    titleHausa: 'Sabon Neman Daidaituwa na Jira',
    titleEnglish: 'New Compatibility Match Review',
    messageHausa: 'Jami\'i ya kirkiro shawara tsakanin Ibrahim (Kano) da Fatima (Kaduna).',
    messageEnglish: 'Staff generated an introduction proposal between Ibrahim (Kano) and Fatima (Kaduna).',
    type: 'match',
    timestamp: '2026-03-15 09:00',
    isRead: false
  }
];

export const sampleAuditLogs: AuditLog[] = [
  {
    id: 'AUDIT-001',
    performedBy: 'admin-bootstrap (aliahmedmunkaila@gmail.com)',
    action: 'SYSTEM_INITIALIZATION',
    targetEntity: 'appSettings',
    targetId: 'general',
    details: 'An kafa tsarin Mahadar Aure AI Secretary tare da saitunan farashi da dokoki.',
    timestamp: '2026-03-01T08:00:00Z'
  },
  {
    id: 'AUDIT-002',
    performedBy: 'staff-admin',
    action: 'PAYMENT_VERIFICATION',
    targetEntity: 'paymentRecords',
    targetId: 'PAY-2026-01',
    details: 'An tabbatar da biyan ₦5,000 na Ibrahim Usman Danladi (MA-2026-1001).',
    timestamp: '2026-03-01T11:15:00Z'
  }
];
