package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Timeline;
import com.hms.services.adminmanagement.repository.TimelineRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class TimelineService {

    @Autowired
    private TimelineRepository timelineRepository;

    @Transactional
    public List<HMS_TM_Timeline> getAllTimelines() {
        return timelineRepository.findByDeletedFalse();
    }

    @Transactional
    public Optional<HMS_TM_Timeline> getTimelineById(String id) {
        return timelineRepository.findByTimelineIdAndDeletedFalse(id);
    }

    public HMS_TM_Timeline saveTimelineWithDocument(HMS_TM_Timeline timeline, MultipartFile documentFile) throws IOException {
        if (documentFile != null) {
            byte[] documentBytes = documentFile.getBytes();
            String encodedDocument = Base64.getEncoder().encodeToString(documentBytes);
            timeline.setDocument(encodedDocument);
        }
        return timelineRepository.save(timeline);
    }

    public HMS_TM_Timeline updateTimeline(String id, HMS_TM_Timeline timeline, MultipartFile documentFile) throws IOException {
        Optional<HMS_TM_Timeline> existingTimeline = timelineRepository.findById(id);
        if (existingTimeline.isPresent()) {
            if (documentFile != null) {
                byte[] documentBytes = documentFile.getBytes();
                String encodedDocument = Base64.getEncoder().encodeToString(documentBytes);
                timeline.setDocument(encodedDocument);
            }
            timeline.setTimelineId(id);
            return timelineRepository.save(timeline);
        }
        return null;
    }

    public boolean softDeleteTimeline(String id) {
        Optional<HMS_TM_Timeline> existingTimelineOpt = timelineRepository.findById(id);

        if (existingTimelineOpt.isPresent()) {
            HMS_TM_Timeline existingTimeline = existingTimelineOpt.get();
            existingTimeline.setDeleted(true);
            timelineRepository.save(existingTimeline);
            return true;
        }
        return false;
    }
}



