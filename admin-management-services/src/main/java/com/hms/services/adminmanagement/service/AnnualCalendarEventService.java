package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_AnnualCalendarEvent;
import com.hms.services.adminmanagement.repository.AnnualCalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnualCalendarEventService {

    @Autowired
    private AnnualCalendarEventRepository repository;

    public List<HMS_TM_AnnualCalendarEvent> getAllAnnualEvents() {
        return repository.findByDeletedFalse();
    }

    public Optional<HMS_TM_AnnualCalendarEvent> getAnnualEventById(String id) {
        return repository.findByIdAndDeletedFalse(id);
    }

    public List<HMS_TM_AnnualCalendarEvent> getEventsByType(String type) {
        return repository.findByTypeAndDeletedFalse(type);
    }

    public HMS_TM_AnnualCalendarEvent createEvent(HMS_TM_AnnualCalendarEvent event) {
        return repository.save(event);
    }

    public HMS_TM_AnnualCalendarEvent updateEvent(String id, HMS_TM_AnnualCalendarEvent updatedEvent) {
        return repository.findById(id).map(event -> {
            event.setType(updatedEvent.getType());
            event.setTitle(updatedEvent.getTitle());
            event.setFromDate(updatedEvent.getFromDate());
            event.setToDate(updatedEvent.getToDate());
            event.setDate(updatedEvent.getDate());
            event.setDescription(updatedEvent.getDescription());
            event.setDeleted(updatedEvent.getDeleted());
            return repository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
    }

    public void deleteAnnualCalendarEvent(String id) {
        HMS_TM_AnnualCalendarEvent event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setDeleted(true);
        repository.save(event);
    }

}




