package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_TimeLine;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.repository.TimeLineRepository;
import com.hms.services.ipdmanagement.repository.VitalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TimeLineService {

    private final TimeLineRepository timeLineRepository;


    @Autowired
    public TimeLineService(final TimeLineRepository timeLineRepository) {
        this.timeLineRepository = timeLineRepository;
    }



    // Create a new timeline
    public HMS_TM_TimeLine addTimeLine(HMS_TM_TimeLine timeLine, MultipartFile attachment) throws IOException {
        if (attachment != null && !attachment.isEmpty()) {
            String encodedAttachment = Base64.getEncoder().encodeToString(attachment.getBytes());
            timeLine.setAttachment(encodedAttachment);
        }
        timeLine.setActive(true);
        timeLine.setCreatedAt(LocalDateTime.now());
        timeLine.setCreatedBy("createdBy");
        timeLine.setLastModifiedBy("createdBy");
        timeLine.setLastModifiedAt(LocalDateTime.now());
        return timeLineRepository.save(timeLine);
    }

    public HMS_TM_TimeLine updateTimeLine(String timeLineId, HMS_TM_TimeLine updatedTimeLine, MultipartFile attachment) throws IOException {
        HMS_TM_TimeLine existingTimeLine = timeLineRepository.findById(timeLineId)
                .orElseThrow(() -> new RuntimeException("Timeline not found"));

        existingTimeLine.setIpdId(updatedTimeLine.getIpdId());
        existingTimeLine.setDate(updatedTimeLine.getDate());
        existingTimeLine.setDescription(updatedTimeLine.getDescription());
        existingTimeLine.setTitle(updatedTimeLine.getTitle());
        existingTimeLine.setLastModifiedBy("modifiedBy");
        existingTimeLine.setLastModifiedAt(LocalDateTime.now());

        if (attachment != null && !attachment.isEmpty()) {
            String encodedAttachment = Base64.getEncoder().encodeToString(attachment.getBytes());
            existingTimeLine.setAttachment(encodedAttachment);
        }
        return timeLineRepository.save(existingTimeLine);
    }

    public void deleteTimeLine(String timeLineId) {
        HMS_TM_TimeLine timeLine = timeLineRepository.findByTimeLineIdAndIsActiveTrue(timeLineId)
                .orElseThrow(() -> new CustomException("Timeline not found with ID: " + timeLineId, HttpStatus.BAD_REQUEST));
        timeLine.setActive(false);
        timeLineRepository.save(timeLine);
    }

    // Get timeline by ID
    public HMS_TM_TimeLine getTimeLineById(String timeLineId) {
        return timeLineRepository.findByTimeLineIdAndIsActiveTrue(timeLineId)
                .orElseThrow(() -> new CustomException("Timeline not found with ID: " + timeLineId, HttpStatus.BAD_REQUEST));
    }

    // Get all timelines
    public List<HMS_TM_TimeLine> getAllTimeLines() {
        return timeLineRepository.findAll();
    }

    public List<HMS_TM_TimeLine> getTimeLinesByIpdId(String ipdId) {
        return Optional.ofNullable(timeLineRepository.findByIpdIdAndIsActiveTrue(ipdId))
                .filter(list -> !list.isEmpty())
                .orElse(Collections.emptyList());
    }



}

