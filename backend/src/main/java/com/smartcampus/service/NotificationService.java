package com.smartcampus.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartcampus.model.Auth.User;
import com.smartcampus.model.Notification;
import com.smartcampus.model.NotificationType;
import com.smartcampus.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification create(User recipient, NotificationType type, String title, String message, String referenceType,
            Long referenceId) {
        if (recipient == null || recipient.getId() == null) {
            throw new IllegalArgumentException("Notification recipient is required");
        }
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setTitle(requireText(title, "Notification title is required"));
        notification.setMessage(requireText(message, "Notification message is required"));
        notification.setReferenceType(requireText(referenceType, "Notification reference type is required"));
        notification.setReferenceId(referenceId);
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long unreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public Notification markRead(Long id, Long userId) {
        Notification notification = notificationRepository.findByIdAndRecipientId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!notification.isRead()) {
            notification.setRead(true);
            notification = notificationRepository.save(notification);
        }
        return notification;
    }

    @Transactional
    public int markAllRead(Long userId) {
        return notificationRepository.markAllAsRead(userId);
    }

    public NotificationPayload toPayload(Notification notification) {
        return new NotificationPayload(
                notification.getId(),
                notification.getType().name(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getReferenceType(),
                notification.getReferenceId(),
                notification.isRead(),
                notification.getCreatedAt());
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    public record NotificationPayload(
            Long id,
            String type,
            String title,
            String message,
            String referenceType,
            Long referenceId,
            boolean isRead,
            java.time.LocalDateTime createdAt) {
    }
}
