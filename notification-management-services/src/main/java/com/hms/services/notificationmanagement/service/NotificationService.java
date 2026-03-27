package com.hms.services.notificationmanagement.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.notificationmanagement.entity.Notifications;
import com.hms.services.notificationmanagement.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class NotificationService {


    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, final SimpMessagingTemplate messagingTemplate, final ObjectMapper objectMapper) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "patient-appointment-completed", groupId = "hms_group")
    public void patientAppointmentMessage(String message) {
        try {
            Map<String, String> event = objectMapper.readValue(message, new TypeReference<>() {});
            String doctorId = event.get("doctorId");
            String title = event.get("title");
            String reasonForVisit = event.get("reasonForVisit");
            String notificationMessage = event.get("message");
            String reportUrl = event.get("reportUrl");
            Notifications notification = new Notifications();
            notification.setEmployeeId(doctorId);
            notification.setTitle(title);
            notification.setReasonForVisit(reasonForVisit);
            notification.setMessage(notificationMessage);
            notification.setReportUrl(reportUrl);
            notification.setRead(false);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend("/topic/notifications/" + doctorId, notification);
            System.out.println("Notification Sent: " + notificationMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @KafkaListener(topics = "pathology-labreport-completed", groupId = "hms_group")
    public void patientPathologyMessage(String message) {
        try {
            Map<String, String> event = objectMapper.readValue(message, new TypeReference<>() {});
            String doctorId = event.get("doctorId");
            String ipdOrOpdId = event.get("ipdOrOpdId");
            String prescriptionNo = event.get("prescriptionNo");
            String title = event.get("title");
            String reasonForVisit = event.get("reasonForVisit");
            String notificationMessage = event.get("message");
            String reportUrl = event.get("reportUrl");
            Notifications notification = new Notifications();
            notification.setEmployeeId(doctorId);
            notification.setIpdOrOpdId(ipdOrOpdId);
            notification.setPrescriptionNo(prescriptionNo);
            notification.setTitle(title);
            notification.setReasonForVisit(reasonForVisit);
            notification.setMessage(notificationMessage);
            notification.setReportUrl(reportUrl);
            notification.setRead(false);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend("/topic/notifications/" + doctorId, notification);
            System.out.println("Notification Sent: " + notificationMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @KafkaListener(topics = "radiology-labreport-completed", groupId = "hms_group")
    public void patientRadiologyMessage(String message) {
        try {
            Map<String, String> event = objectMapper.readValue(message, new TypeReference<>() {});
            String doctorId = event.get("doctorId");
            String ipdOrOpdId = event.get("ipdOrOpdId");
            String prescriptionNo = event.get("prescriptionNo");
            String title = event.get("title");
            String reasonForVisit = event.get("reasonForVisit");
            String notificationMessage = event.get("message");
            String reportUrl = event.get("reportUrl");
            Notifications notification = new Notifications();
            notification.setEmployeeId(doctorId);
            notification.setIpdOrOpdId(ipdOrOpdId);
            notification.setPrescriptionNo(prescriptionNo);
            notification.setTitle(title);
            notification.setReasonForVisit(reasonForVisit);
            notification.setMessage(notificationMessage);
            notification.setReportUrl(reportUrl);
            notification.setRead(false);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend("/topic/notifications/" + doctorId, notification);
            System.out.println("Notification Sent: " + notificationMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @KafkaListener(topics = "leave-requests-notifications", groupId = "hms_group")
    public void employeeLeaveMessage(String message) {
        try {
            Map<String, String> event = objectMapper.readValue(message, new TypeReference<>() {});
            String doctorId = event.get("employeeId");
            String title = event.get("title");
            String notificationMessage = event.get("message");
            String reportUrl = event.get("reportUrl");
            Notifications notification = new Notifications();
            notification.setEmployeeId(doctorId);
            notification.setTitle(title);
            notification.setMessage(notificationMessage);
            notification.setReportUrl(reportUrl);
            notification.setRead(false);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend("/topic/notifications/" + doctorId, notification);
            System.out.println("Notification Sent: " + notificationMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @KafkaListener(topics = "leave-approve-notifications", groupId = "hms_group")
    public void employeeLeaveApproveMessage(String message) {
        try {
            Map<String, String> event = objectMapper.readValue(message, new TypeReference<>() {});
            String doctorId = event.get("employeeId");
            String title = event.get("title");
            String notificationMessage = event.get("message");
            String reportUrl = event.get("reportUrl");
            Notifications notification = new Notifications();
            notification.setEmployeeId(doctorId);
            notification.setTitle(title);
            notification.setMessage(notificationMessage);
            notification.setReportUrl(reportUrl);
            notification.setRead(false);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend("/topic/notifications/" + doctorId, notification);
            System.out.println("Notification Sent: " + notificationMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public List<Notifications> getUnreadNotifications(String doctorId) {
        return notificationRepository.findByEmployeeIdAndIsReadFalse(doctorId);
    }

    public ResponseEntity<Object> markNotificationAsRead(String id) {
        Optional<Notifications> notification = notificationRepository.findByIdAndIsReadFalse(id);
        if (notification.isPresent()) {
            Notifications notifier = notification.get();
            notifier.setRead(true);
            notificationRepository.save(notifier);
            return ResponseEntity.ok().build();
        }
        return null;
    }
}

