import { create } from 'zustand';

interface NotificationState {
  notifications: import('@/types').Notification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: import('@/types').Notification[]) => void;
  addNotification: (notification: import('@/types').Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setLoading: (loading: boolean) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: !notification.isRead ? state.unreadCount + 1 : state.unreadCount,
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    unreadCount: 0,
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));