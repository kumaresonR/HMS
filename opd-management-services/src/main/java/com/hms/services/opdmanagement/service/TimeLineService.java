package com.hms.services.opdmanagement.service;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDTimeLine;
import com.hms.services.opdmanagement.exception.CustomException;
import com.hms.services.opdmanagement.repository.TimeLineRepository;
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
    public HMS_TM_OPDTimeLine addTimeLine(HMS_TM_OPDTimeLine timeLine, MultipartFile attachment) throws IOException {
        try {
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
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public HMS_TM_OPDTimeLine updateTimeLine(String timeLineId, HMS_TM_OPDTimeLine updatedTimeLine, MultipartFile attachment) throws IOException {
        try {
            HMS_TM_OPDTimeLine existingTimeLine = timeLineRepository.findById(timeLineId)
                    .orElseThrow(() -> new RuntimeException("Timeline not found"));

            existingTimeLine.setOpdId(updatedTimeLine.getOpdId());
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
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    public void deleteTimeLine(String timeLineId) {
        HMS_TM_OPDTimeLine timeLine = timeLineRepository.findByTimeLineIdAndIsActiveTrue(timeLineId)
                .orElseThrow(() -> new CustomException("Timeline not found with ID: " + timeLineId, HttpStatus.BAD_REQUEST));
        timeLine.setActive(false);
        timeLineRepository.save(timeLine);
    }

    // Get timeline by ID
    public HMS_TM_OPDTimeLine getTimeLineById(String timeLineId) {
        return timeLineRepository.findByTimeLineIdAndIsActiveTrue(timeLineId)
                .orElseThrow(() -> new CustomException("Timeline not found with ID: " + timeLineId, HttpStatus.BAD_REQUEST));
    }

    // Get all timelines
    public List<HMS_TM_OPDTimeLine> getAllTimeLines() {
        return timeLineRepository.findAllByIsActiveTrue();
    }

    public List<HMS_TM_OPDTimeLine> getTimeLinesByIpdId(String ipdId) {
        return Optional.ofNullable(timeLineRepository.findByOpdIdAndIsActiveTrue(ipdId))
                .filter(list -> !list.isEmpty())
                .orElse(Collections.emptyList());
    }



}

