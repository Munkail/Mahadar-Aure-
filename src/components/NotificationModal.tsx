/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { translations } from '../i18n';
import { Language, AppNotification } from '../types';
import { dataService } from '../services/dataService';
import { X, Bell, CheckCircle, Info, HeartHandshake, CreditCard } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    dataService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkAll = async () => {
    await dataService.markAllNotificationsRead();
    const updated = await dataService.getNotifications();
    setNotifications(updated);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-slate-800 pb-3 pr-10">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-base text-white">{t.notifications}</h3>
          </div>
          <button
            onClick={handleMarkAll}
            className="text-xs text-pink-400 hover:text-pink-300 font-semibold"
          >
            Mark all read
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-1 transition ${
                n.isRead
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  : 'bg-slate-950 border-pink-500/30 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="text-white text-xs">
                  {language === 'ha' ? n.titleHausa : n.titleEnglish}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {language === 'ha' ? n.messageHausa : n.messageEnglish}
              </p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              {t.noData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
