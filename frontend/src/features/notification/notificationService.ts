import api from '../../shared/services/api';

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

export interface Notification {
  id: string;
  userId?: string;
  message: string;
  type: NotificationType;
  timestamp: string;
}

const USE_MOCK = false;

// Mock data for fallback or initial development
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'N-1',
    message: 'Your request for Auditorium A has been approved for tomorrow.',
    type: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'N-2',
    message: 'Technician assigned to your IT support ticket #442.',
    type: 'INFO',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  }
];

export const notificationService = {
  getNotifications: async (userId?: string): Promise<Notification[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_NOTIFICATIONS;
    }
    const url = userId ? `/notifications?userId=${userId}` : '/notifications';
    const response = await api.get<Notification[]>(url);
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    // Currently the backend doesn't support markAsRead, but we can implement it later if needed
    // For now, we'll just simulate it or do nothing
  },

  markAllAsRead: async (): Promise<void> => {
  },

  deleteNotification: async (id: string): Promise<void> => {
    if (USE_MOCK) return;
    await api.delete(`/notifications/${id}`);
  },

  createNotification: async (notification: Partial<Notification>): Promise<Notification> => {
    if (USE_MOCK) {
      const newNotification: Notification = {
        id: `N-${Math.random().toString(36).substr(2, 9)}`,
        message: notification.message || '',
        type: notification.type || 'INFO',
        timestamp: new Date().toISOString(),
        ...notification
      };
      MOCK_NOTIFICATIONS.unshift(newNotification);
      return newNotification;
    }
    const response = await api.post<Notification>('/notifications', notification);
    return response.data;
  }
};
