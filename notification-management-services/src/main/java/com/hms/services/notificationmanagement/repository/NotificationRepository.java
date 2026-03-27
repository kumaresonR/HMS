package com.hms.services.notificationmanagement.repository;


import com.hms.services.notificationmanagement.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, String> {

    List<Notifications> findByEmployeeIdAndIsReadFalse(String doctorId);

    Optional<Notifications> findByIdAndIsReadFalse(String id);
}

