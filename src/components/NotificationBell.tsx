import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  contentId: number;
  contentType: 'movie' | 'tv';
}

// Mock notifications with contentId and contentType
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Nuovo Arrivo',
    message: 'È appena stato aggiunto "Dune: Parte Due"',
    timestamp: new Date(),
    isRead: false,
    contentId: 693134, // Dune: Part Two TMDB ID
    contentType: 'movie'
  },
  {
    id: '2',
    title: 'Serie TV Aggiunta',
    message: 'Non perderti la nuova stagione di "The Last of Us"',
    timestamp: new Date(Date.now() - 86400000),
    isRead: false,
    contentId: 100088, // The Last of Us TMDB ID
    contentType: 'tv'
  }
];

export default function NotificationBell() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notification: Notification) => {
    setNotifications(current =>
      current.map(n =>
        n.id === notification.id
          ? { ...n, isRead: true }
          : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(current =>
      current.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification);
    setShowNotifications(false);
    
    // Navigate to the appropriate content page
    if (notification.contentType === 'movie') {
      navigate(`/watch/${notification.contentId}`);
    } else {
      navigate(`/watch/tv/${notification.contentId}`);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}g fa`;
    if (hours > 0) return `${hours}h fa`;
    return `${minutes}m fa`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-gray-300 hover:text-white focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notifiche</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Segna tutte come lette
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors ${
                    !notification.isRead ? 'bg-zinc-800/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white hover:text-red-500">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1 hover:text-gray-300">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                Nessuna notifica
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}