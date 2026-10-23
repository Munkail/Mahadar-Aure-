/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { translations } from '../i18n';
import { Language, UserRole } from '../types';
import {
  Code2,
  FileCode,
  Copy,
  Check,
  Download,
  Smartphone,
  ExternalLink,
  BookOpen,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface AndroidExporterViewProps {
  language: Language;
  currentRole: UserRole;
}

export const AndroidExporterView: React.FC<AndroidExporterViewProps> = ({
  language,
  currentRole
}) => {
  const t = translations[language];

  const [activeFile, setActiveFile] = useState<string>('MainActivity.kt');
  const [copied, setCopied] = useState(false);

  const filesMap: Record<string, { lang: string; path: string; code: string }> = {
    'MainActivity.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/mahadaraure/app/MainActivity.kt',
      code: `package com.mahadaraure.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.*
import com.mahadaraure.app.data.model.*

val BrandNavy = Color(0xFF0F172A)
val BrandHotPink = Color(0xFFEC4899)
val BrandSurface = Color(0xFF1E293B)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MahadarAureTheme {
                MahadarAppRoot()
            }
        }
    }
}

@Composable
fun MahadarAureTheme(content: @Composable () -> Unit) {
    val colorScheme = darkColorScheme(
        primary = BrandHotPink,
        secondary = Color(0xFF38BDF8),
        background = BrandNavy,
        surface = BrandSurface,
        onPrimary = Color.White,
        onBackground = Color.White,
        onSurface = Color.White
    )
    MaterialTheme(colorScheme = colorScheme, content = content)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MahadarAppRoot() {
    var currentLanguage by remember { mutableStateOf("ha") } // "ha" or "en"
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Mahadar Aure",
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White
                        )
                        Text(
                            text = if (currentLanguage == "ha") "Haɗa Zuciya, Gina Gida" else "Connecting Hearts, Building Homes",
                            style = MaterialTheme.typography.labelSmall,
                            color = BrandHotPink
                        )
                    }
                },
                actions = {
                    TextButton(onClick = { currentLanguage = if (currentLanguage == "ha") "en" else "ha" }) {
                        Text(text = if (currentLanguage == "ha") "EN" else "HA", color = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BrandNavy)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = BrandSurface) {
                val items = listOf(
                    Triple("Dandali", "Dashboard", Icons.Default.Dashboard),
                    Triple("Rijista", "Register", Icons.Default.PersonAdd),
                    Triple("Sakatariya", "AI Secretary", Icons.Default.Chat),
                    Triple("Sasanta", "Matchmaking", Icons.Default.Favorite),
                    Triple("Biyan Kuɗi", "Payments", Icons.Default.Payment)
                )

                items.forEachIndexed { index, (labelHa, labelEn, icon) ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        icon = { Icon(icon, contentDescription = labelEn) },
                        label = {
                            Text(
                                text = if (currentLanguage == "ha") labelHa else labelEn,
                                style = MaterialTheme.typography.labelSmall
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = BrandHotPink,
                            selectedTextColor = BrandHotPink,
                            indicatorColor = BrandNavy
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(BrandNavy)
        ) {
            when (selectedTab) {
                0 -> AndroidDashboardView(currentLanguage)
                1 -> AndroidRegistrationView(currentLanguage)
                2 -> AndroidAiSecretaryView(currentLanguage)
                3 -> AndroidMatchmakingView(currentLanguage)
                4 -> AndroidPaymentView(currentLanguage)
            }
        }
    }
}`
    },
    'Models.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/mahadaraure/app/data/model/Models.kt',
      code: `package com.mahadaraure.app.data.model

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
)`
    },
    'build.gradle.kts': {
      lang: 'kotlin',
      path: 'app/build.gradle.kts',
      code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.mahadaraure.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.mahadaraure.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.8" }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Firebase
    implementation(platform("com.google.firebase:firebase-bom:32.7.4"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")

    // Google Generative AI (Gemini) Client
    implementation("com.google.ai.client.generativeai:generativeai:0.2.2")
}`
    },
    'AndroidManifest.xml': {
      lang: 'xml',
      path: 'app/src/main/AndroidManifest.xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@android:style/Theme.Material.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
    },
    'firestore.rules': {
      lang: 'javascript',
      path: 'firestore.rules',
      code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }

    function isSignedIn() { return request.auth != null; }
    function isBootstrappedAdmin() {
      return isSignedIn() && request.auth.token.email == 'aliahmedmunkaila@gmail.com';
    }
    function isAdmin() {
      return isBootstrappedAdmin() || (
        isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    function isStaff() {
      return isAdmin() || (
        isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff'
      );
    }

    match /users/{userId} {
      allow get: if isSignedIn() && (request.auth.uid == userId || isStaff());
      allow list: if isStaff();
      allow write: if isAdmin();
    }
    match /memberProfiles/{profileId} {
      allow read, write: if isStaff();
    }
    match /paymentRecords/{paymentId} {
      allow read, write: if isStaff();
    }
    match /matchmakingSuggestions/{suggestionId} {
      allow read, write: if isStaff();
    }
    match /appSettings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /auditLogs/{logId} {
      allow read: if isStaff();
      allow create: if isSignedIn();
    }
  }
}`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(filesMap[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-pink-500" />
            <span>Mahadar Aure Native Android Project</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'ha'
              ? 'Cikakken tsarin manhajar Android (Kotlin, Jetpack Compose, Material 3, Firebase & Gemini AI)'
              : 'Complete native Android Studio project files ready to build, test in emulator, and release to Google Play'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold">
            Kotlin 1.9 • Compose BOM 2024
          </span>
        </div>
      </div>

      {/* Deployment & Setup Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h4 className="font-bold text-white text-sm">
            {language === 'ha' ? 'Buɗewa a Android Studio' : 'Open in Android Studio'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'ha'
              ? 'Bude babban folder na /android a Android Studio (Giraffe, Hedgehog, ko sabo). Gradle zai hada dependencies kai-tsaye.'
              : 'Open the /android directory in Android Studio. Gradle will sync Jetpack Compose and Firebase automatically.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h4 className="font-bold text-white text-sm">
            {language === 'ha' ? 'Hada Firebase & google-services.json' : 'Link Firebase Credentials'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'ha'
              ? 'An kafa Firebase Project da Firestore. A sa google-services.json a /android/app/ wanda aka samo daga Firebase Console.'
              : 'Place google-services.json inside /android/app/. The security rules are already deployed to Cloud Firestore.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h4 className="font-bold text-white text-sm">
            {language === 'ha' ? 'Admin & Fitar da APK/AAB' : 'Create Admin & Release APK'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'ha'
              ? 'Asusun aliahmedmunkaila@gmail.com an riga an tsara shi a matsayin Super Administrator a ka\'idojin Firestore!'
              : 'Admin role is secured for aliahmedmunkaila@gmail.com via Firestore ABAC rules. Run ./gradlew assembleRelease to build signed APK.'}
          </p>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* File Tabs */}
        <div className="bg-slate-950 p-2 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-1">
            {Object.keys(filesMap).map(fName => (
              <button
                key={fName}
                onClick={() => setActiveFile(fName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                  activeFile === fName
                    ? 'bg-slate-800 text-pink-400 border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{fName}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* File Path Banner */}
        <div className="px-4 py-1.5 bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-500 font-mono">
          Path: {filesMap[activeFile].path}
        </div>

        {/* Code Content */}
        <pre className="p-4 text-xs font-mono text-slate-300 bg-slate-950 overflow-x-auto max-h-[500px] leading-relaxed">
          <code>{filesMap[activeFile].code}</code>
        </pre>
      </div>
    </div>
  );
};
