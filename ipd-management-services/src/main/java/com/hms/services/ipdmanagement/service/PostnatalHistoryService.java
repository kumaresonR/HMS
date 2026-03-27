package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_PostnatalHistory;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.repository.CommentsRepository;
import com.hms.services.ipdmanagement.repository.NurseNotesRepository;
import com.hms.services.ipdmanagement.repository.PostnatalHistoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostnatalHistoryService {

    private final PostnatalHistoryRepository postnatalHistoryRepository;

    @Autowired
    public PostnatalHistoryService(final PostnatalHistoryRepository postnatalHistoryRepository) {
        this.postnatalHistoryRepository = postnatalHistoryRepository;
    }

    public HMS_TM_PostnatalHistory createPostnatalHistory(HMS_TM_PostnatalHistory postnatalHistory) {
        try {
            postnatalHistory.setActive(true);
            postnatalHistory.setCreatedAt(LocalDateTime.now());
            postnatalHistory.setCreatedBy("Admin");
            return postnatalHistoryRepository.save(postnatalHistory);
        }catch (Exception ex){

            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }


    public List<HMS_TM_PostnatalHistory> getByIpdId(String ipdId) {
        return postnatalHistoryRepository.findByIpdIdAndIsActiveTrue(ipdId);
    }



    public HMS_TM_PostnatalHistory updatePostnatalHistory(String postnatalId, HMS_TM_PostnatalHistory updatedData) {
        HMS_TM_PostnatalHistory existing=postnatalHistoryRepository.findByPostnatalIdAndIsActiveTrue(postnatalId)
                .orElseThrow(() -> new CustomException("Postnatal History not found or inactive", HttpStatus.NOT_FOUND));
        existing.setLaborTime(updatedData.getLaborTime());
        existing.setDeliveryTime(updatedData.getDeliveryTime());
        existing.setRoutineQuestion(updatedData.getRoutineQuestion());
        existing.setGeneralRemark(updatedData.getGeneralRemark());
        existing.setLastModifiedBy("Admin");
        existing.setLastModifiedAt(LocalDateTime.now());
        return postnatalHistoryRepository.save(existing);
    }


    public String softDeletePostnatalHistory(String postnatalId) {
        HMS_TM_PostnatalHistory existing=postnatalHistoryRepository.findByPostnatalIdAndIsActiveTrue(postnatalId)
                .orElseThrow(() -> new CustomException("Postnatal History not found or inactive", HttpStatus.NOT_FOUND));
        existing.setActive(false);
        return "Postnatal History with ID " + postnatalId + " deleted successfully.";

    }





}

