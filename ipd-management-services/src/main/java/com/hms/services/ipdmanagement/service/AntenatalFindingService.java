package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_AntenatalFinding;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.repository.AntenatalFindingRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AntenatalFindingService {


    private final AntenatalFindingRepository antenatalFindingRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public AntenatalFindingService(AntenatalFindingRepository antenatalFindingRepository,final ModelMapper modelMapper) {
        this.antenatalFindingRepository = antenatalFindingRepository;
        this.modelMapper = modelMapper;
    }

    public HMS_TM_AntenatalFinding createAntenatalFinding(HMS_TM_AntenatalFinding antenatalFinding) {
        antenatalFinding.setIsActive(true);
        antenatalFinding.setCreatedAt(LocalDateTime.now());
        antenatalFinding.setCreatedBy("Admin");
        return antenatalFindingRepository.save(antenatalFinding);
    }

    public List<HMS_TM_AntenatalFinding> getByIpdId(String ipdId) {
        return antenatalFindingRepository.findByIpdIdAndIsActiveTrue(ipdId);
    }

    public HMS_TM_AntenatalFinding updateAntenatalFinding(String antenatalId, HMS_TM_AntenatalFinding updatedData) {
        HMS_TM_AntenatalFinding existing = antenatalFindingRepository.findByAntenatalIdAndIsActiveTrue(antenatalId)
                .orElseThrow(() -> new CustomException("Antenatal Finding not found or inactive", HttpStatus.NOT_FOUND));
//        existing.setHistoryOfPresentPregnancy(updatedData.getHistoryOfPresentPregnancy());
//        existing.setBleeding(updatedData.getBleeding());
//        existing.setHeadache(updatedData.getHeadache());
//        existing.setPain(updatedData.getPain());
//        existing.setCondition(updatedData.getCondition());
//        existing.setRemark(updatedData.getRemark());
        modelMapper.map(updatedData, existing);
        existing.setAntenatalId(antenatalId);
        existing.setLastModifiedBy("Admin");
        existing.setIsActive(true);
        existing.setLastModifiedAt(LocalDateTime.now());
        return antenatalFindingRepository.save(existing);
    }

    public String softDeleteAntenatalFinding(String antenatalId) {
        HMS_TM_AntenatalFinding existing = antenatalFindingRepository.findByAntenatalIdAndIsActiveTrue(antenatalId)
                .orElseThrow(() -> new CustomException("Antenatal Finding not found or inactive", HttpStatus.NOT_FOUND));
        existing.setIsActive(false);
        antenatalFindingRepository.save(existing);
        return "Antenatal Finding with ID " + antenatalId + " deleted successfully.";
    }
}

