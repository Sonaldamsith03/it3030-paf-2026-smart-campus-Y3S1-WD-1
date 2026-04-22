package com.campus.hub.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            return notificationRepository.findByUserIdIsNullOrderByTimestampDesc();
        }
        return notificationRepository.findByUserIdOrUserIdIsNullOrderByTimestampDesc(userId);
    }

    public Notification createNotification(Notification notification) {
        if (notification.getTimestamp() == null) {
            notification.setTimestamp(LocalDateTime.now());
        }
        return notificationRepository.save(notification);
    }

    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }
}
