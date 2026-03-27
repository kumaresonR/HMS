package com.hms.services.notificationmanagement.controller;



import com.hms.services.notificationmanagement.entity.Notifications;
import com.hms.services.notificationmanagement.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{doctorId}/unread")
    public List<Notifications> getUnreadNotifications(@PathVariable String doctorId) {
        return notificationService.getUnreadNotifications(doctorId);
    }

    @GetMapping("/{id}/mark-read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable String id) {
        ResponseEntity<Object> notification=notificationService.markNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }
}
