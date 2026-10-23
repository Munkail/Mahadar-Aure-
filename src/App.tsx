/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { MemberRegistrationView } from './components/MemberRegistrationView';
import { MemberListView } from './components/MemberListView';
import { MemberDetailsModal } from './components/MemberDetailsModal';
import { AiSecretaryView } from './components/AiSecretaryView';
import { MatchmakingView } from './components/MatchmakingView';
import { PaymentView } from './components/PaymentView';
import { EnquiriesView } from './components/EnquiriesView';
import { AuditLogView } from './components/AuditLogView';
import { SettingsView } from './components/SettingsView';
import { AndroidExporterView } from './components/AndroidExporterView';
import { AuthModal } from './components/AuthModal';
import { NotificationModal } from './components/NotificationModal';
import { SplashScreen } from './components/SplashScreen';
import { Language, UserRole, MemberProfile, AppSettings } from './types';
import { dataService } from './services/dataService';
import { testConnection } from './firebase';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { translations } from './i18n';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [language, setLanguage] = useState<Language>('ha');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentUserEmail, setCurrentUserEmail] = useState('aliahmedmunkaila@gmail.com');
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');
  const [isDeviceFrame, setIsDeviceFrame] = useState(false);

  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(2);
  const [appSettings, setAppSettings] = useState<AppSettings | undefined>(undefined);

  useEffect(() => {
    // Validate Firestore connection on boot
    testConnection().then(connected => {
      console.log('Firebase Firestore connection state:', connected ? 'Connected' : 'Offline Mode');
    });

    dataService.getSettings().then(setAppSettings);
    dataService.getNotifications().then(notifs => {
      setUnreadNotifs(notifs.filter(n => !n.isRead).length);
    });
  }, []);

  const t = translations[language];

  // Access check for tab
  const tabRolesMap: Record<TabKey, UserRole[]> = {
    dashboard: ['admin', 'staff', 'member'],
    members: ['admin', 'staff'],
    register: ['admin', 'staff', 'member'],
    secretary: ['admin', 'staff', 'member'],
    matchmaking: ['admin', 'staff'],
    payments: ['admin', 'staff'],
    enquiries: ['admin', 'staff', 'member'],
    audit: ['admin', 'staff'],
    settings: ['admin'],
    android: ['admin', 'staff', 'member']
  };

  const isAccessAllowed = tabRolesMap[currentTab]?.includes(currentRole);

  const handleToggleVerification = async (member: MemberProfile) => {
    const updated = {
      ...member,
      isVerified: !member.isVerified,
      paymentStatus: (!member.isVerified ? 'confirmed' : member.paymentStatus) as any
    };
    await dataService.updateMember(updated, currentUserEmail);
    setSelectedMember(updated);
  };

  const renderActiveTab = () => {
    if (!isAccessAllowed) {
      return (
        <div className="p-8 text-center max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {language === 'ha' ? 'Ba Ku da Izinin Shiga Wannan Sashin' : 'Access Restricted'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'ha'
              ? `Wannan sashin na ${tabRolesMap[currentTab]?.join(' ko ')} ne kadai. Matsayinku na yanzu shine: ${currentRole.toUpperCase()}.`
              : `This module requires ${tabRolesMap[currentTab]?.join(' or ')} permission. Your current role is: ${currentRole.toUpperCase()}.`}
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ha' ? 'Koma Dandali' : 'Return to Dashboard'}</span>
            </button>
            <button
              onClick={() => setCurrentRole('admin')}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition"
            >
              {language === 'ha' ? 'Koma Admin' : 'Switch to Admin'}
            </button>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            language={language}
            currentRole={currentRole}
            onNavigate={setCurrentTab}
            onSelectMember={setSelectedMember}
          />
        );
      case 'members':
        return (
          <MemberListView
            language={language}
            currentRole={currentRole}
            actorEmail={currentUserEmail}
            onSelectMember={setSelectedMember}
            onNavigateRegister={() => setCurrentTab('register')}
          />
        );
      case 'register':
        return (
          <MemberRegistrationView
            language={language}
            currentRole={currentRole}
            actorEmail={currentUserEmail}
            onSuccessNavigate={() => setCurrentTab('members')}
          />
        );
      case 'secretary':
        return (
          <AiSecretaryView
            language={language}
            currentRole={currentRole}
            settings={appSettings}
          />
        );
      case 'matchmaking':
        return (
          <MatchmakingView
            language={language}
            currentRole={currentRole}
            actorEmail={currentUserEmail}
          />
        );
      case 'payments':
        return (
          <PaymentView
            language={language}
            currentRole={currentRole}
            actorEmail={currentUserEmail}
          />
        );
      case 'enquiries':
        return (
          <EnquiriesView
            language={language}
            currentRole={currentRole}
            actorEmail={currentUserEmail}
          />
        );
      case 'audit':
        return (
          <AuditLogView
            language={language}
            currentRole={currentRole}
          />
        );
      case 'settings':
        return (
          <SettingsView
            language={language}
            currentRole={currentRole}
            actorEmail={currentUserEmail}
            onSettingsUpdated={setAppSettings}
          />
        );
      case 'android':
        return (
          <AndroidExporterView
            language={language}
            currentRole={currentRole}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-pink-600 selection:text-white">
      {/* Splash Screen on boot */}
      {showSplash && (
        <SplashScreen
          language={language}
          onDismiss={() => setShowSplash(false)}
        />
      )}

      {/* Main Container: can be Android Device Frame or Desktop Full Canvas */}
      {isDeviceFrame ? (
        <div className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-slate-950">
          {/* Android Mobile Frame Simulation (390 x 844 px) */}
          <div className="w-full max-w-[420px] h-[92vh] max-h-[890px] bg-slate-900 border-4 sm:border-8 border-slate-800 rounded-[44px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-slate-700/50">
            {/* Camera Punchhole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 pointer-events-none ring-1 ring-slate-800"></div>

            <Header
              language={language}
              setLanguage={setLanguage}
              currentRole={currentRole}
              setCurrentRole={setCurrentRole}
              currentUserEmail={currentUserEmail}
              isDeviceFrame={isDeviceFrame}
              setIsDeviceFrame={setIsDeviceFrame}
              unreadCount={unreadNotifs}
              onOpenNotifications={() => setIsNotifOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
            />

            <main className="flex-1 overflow-y-auto bg-slate-950">
              {renderActiveTab()}
            </main>

            <Navigation
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              language={language}
              currentRole={currentRole}
              isDeviceFrame={isDeviceFrame}
            />

            {/* Android Gesture Bar */}
            <div className="bg-slate-900 py-1.5 flex justify-center items-center">
              <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop / Tablet Web Application */
        <div className="flex-1 flex flex-col min-h-screen">
          <Header
            language={language}
            setLanguage={setLanguage}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            currentUserEmail={currentUserEmail}
            isDeviceFrame={isDeviceFrame}
            setIsDeviceFrame={setIsDeviceFrame}
            unreadCount={unreadNotifs}
            onOpenNotifications={() => setIsNotifOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />

          <div className="flex-1 flex overflow-hidden">
            <Navigation
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              language={language}
              currentRole={currentRole}
              isDeviceFrame={isDeviceFrame}
            />

            <main className="flex-1 overflow-y-auto bg-slate-950">
              {renderActiveTab()}
            </main>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <MemberDetailsModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        language={language}
        currentRole={currentRole}
        onToggleVerification={handleToggleVerification}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        language={language}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentUserEmail={currentUserEmail}
        setCurrentUserEmail={setCurrentUserEmail}
      />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        language={language}
      />
    </div>
  );
}
