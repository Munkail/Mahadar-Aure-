package com.mahadaraure.app.data.model

import com.google.firebase.Timestamp

data class MemberProfile(
    val memberId: String = "",
    val fullName: String = "",
    val age: Int = 18,
    val dateOfBirth: String = "",
    val gender: String = "Namiji / Male",
    val state: String = "Kano",
    val city: String = "",
    val preferredMarriageLocation: String = "",
    val phoneNumber: String = "",
    val preferredContactMethod: String = "WhatsApp",
    val educationLevel: String = "Secondary",
    val occupation: String = "",
    val languagesSpoken: List<String> = emptyList(),
    val maritalStatus: String = "Never Married",
    val numberOfChildren: Int = 0,
    val genotype: String = "Unknown",
    val religiousPreferences: String = "",
    val spousePreferences: Map<String, Any> = emptyMap(),
    val membershipPlan: String = "Standard",
    val paymentStatus: String = "pending",
    val registrationDate: String = "",
    val consentGiven: Boolean = true,
    val notesRestricted: String = "",
    val isVerified: Boolean = false,
    val isActive: Boolean = true,
    val isArchived: Boolean = false,
    val createdBy: String = ""
)

data class PaymentRecord(
    val paymentId: String = "",
    val memberId: String = "",
    val memberName: String = "",
    val plan: String = "Standard",
    val amountNaira: Double = 3000.0,
    val paymentReference: String = "",
    val paymentDate: String = "",
    val paymentStatus: String = "pending",
    val reviewedByStaffId: String = "",
    val verifiedAt: String = "",
    val notes: String = ""
)

data class Enquiry(
    val id: String = "",
    val memberId: String? = null,
    val senderName: String = "",
    val senderContact: String = "",
    val subject: String = "",
    val message: String = "",
    val status: String = "open",
    val assignedStaff: String? = null,
    val staffNotes: String? = null,
    val createdAt: String = ""
)

data class MatchmakingSuggestion(
    val id: String = "",
    val candidateAId: String = "",
    val candidateBId: String = "",
    val candidateAName: String = "",
    val candidateBName: String = "",
    val candidateAGender: String = "",
    val candidateBGender: String = "",
    val compatibilityScore: Int = 0,
    val matchingFactors: List<String> = emptyList(),
    val nonMatchingFactors: List<String> = emptyList(),
    val explanationHausa: String = "",
    val explanationEnglish: String = "",
    val staffStatus: String = "pending",
    val reviewedByStaff: String = "",
    val reviewedAt: String = "",
    val consentA: Boolean = false,
    val consentB: Boolean = false,
    val createdAt: String = ""
)

data class AppSettings(
    val id: String = "general",
    val serviceName: String = "Mahadar Aure",
    val tagline: String = "Haɗa Zuciya, Gina Gida, Gina Al’umma",
    val standardPriceNaira: Double = 3000.0,
    val vipPriceNaira: Double = 5000.0,
    val contactWhatsApp: String = "09165006713",
    val contactTelegram: String = "https://t.me/Mahadaraure",
    val contactFacebook: String = "https://www.facebook.com/mahadaraure",
    val contactWhatsAppChannel: String = "https://whatsapp.com/channel/0029VbCDhJrHrDZb9cyYdu08"
)

data class ChatMessage(
    val id: String,
    val sender: String, // "user" or "assistant"
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)
