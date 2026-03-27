package com.hms.services.laboratorymanagement.service;

import com.hms.services.laboratorymanagement.controller.PathologyController;
import com.hms.services.laboratorymanagement.entity.HMS_TM_RadiologyTestParameters;
import com.hms.services.laboratorymanagement.entity.HMS_TM_RadiologyTests;
import com.hms.services.laboratorymanagement.exceptionhandler.CustomException;
import com.hms.services.laboratorymanagement.exceptionhandler.RadiologyException;
import com.hms.services.laboratorymanagement.model.RadiologyTestDetailsDTO;
import com.hms.services.laboratorymanagement.model.RadiologyTestParameterDTO;
import com.hms.services.laboratorymanagement.repository.RadiologyTestParametersRepository;
import com.hms.services.laboratorymanagement.repository.RadiologyTestsRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RadiologyService {

    @Autowired
    private RadiologyTestsRepository radiologyTestsRepository;

    @Autowired
    private RadiologyTestParametersRepository radiologyTestParametersRepository;

    private static final Logger log = LoggerFactory.getLogger(PathologyController.class);

    public RadiologyTestDetailsDTO createRadiologyTest(RadiologyTestDetailsDTO testDetailsDTO) {
        log.info("Creating radiology test with details: {}", testDetailsDTO);

        try {
            HMS_TM_RadiologyTests test = new HMS_TM_RadiologyTests();
            test.setTestName(testDetailsDTO.getTestName());
            test.setShortName(testDetailsDTO.getShortName());
            test.setTestType(testDetailsDTO.getTestType());
            test.setCategoryName(testDetailsDTO.getCategoryName());
            test.setSubCategory(testDetailsDTO.getSubCategory());
            test.setReportDays(testDetailsDTO.getReportDays());
            test.setChargeCategory(testDetailsDTO.getChargeCategory());
            test.setChargeName(testDetailsDTO.getChargeName());
            test.setTaxPercentage(testDetailsDTO.getTaxPercentage());
            test.setStandardCharge(testDetailsDTO.getStandardCharge());
            test.setAmount(testDetailsDTO.getAmount());

            HMS_TM_RadiologyTests savedTest = radiologyTestsRepository.save(test);
            String radiologyTestId = savedTest.getRadiologyTestId();

            List<HMS_TM_RadiologyTestParameters> parametersList = null;
            if (testDetailsDTO.getTestParameters() != null && !testDetailsDTO.getTestParameters().isEmpty()) {
                parametersList = testDetailsDTO.getTestParameters().stream()
                        .map(testParameterDTO -> {
                            HMS_TM_RadiologyTestParameters parameter = new HMS_TM_RadiologyTestParameters();
                            parameter.setParameterName(testParameterDTO.getParameterName());
                            parameter.setNormalRange(testParameterDTO.getNormalRange());
                            parameter.setUnit(testParameterDTO.getUnit());
                            parameter.setRadiologyTestId(radiologyTestId);
                            return parameter;
                        })
                        .collect(Collectors.toList());

                radiologyTestParametersRepository.saveAll(parametersList);
            }

            RadiologyTestDetailsDTO responseDTO = new RadiologyTestDetailsDTO();
            responseDTO.setRadiologyTestId(savedTest.getRadiologyTestId());
            responseDTO.setTestName(savedTest.getTestName());
            responseDTO.setShortName(savedTest.getShortName());
            responseDTO.setTestType(savedTest.getTestType());
            responseDTO.setCategoryName(savedTest.getCategoryName());
            responseDTO.setSubCategory(savedTest.getSubCategory());
            responseDTO.setReportDays(savedTest.getReportDays());
            responseDTO.setChargeCategory(savedTest.getChargeCategory());
            responseDTO.setChargeName(savedTest.getChargeName());
            responseDTO.setTaxPercentage(savedTest.getTaxPercentage());
            responseDTO.setStandardCharge(savedTest.getStandardCharge());
            responseDTO.setAmount(savedTest.getAmount());

            if (parametersList != null) {
                List<RadiologyTestParameterDTO> responseParameters = parametersList.stream()
                        .map(param -> {
                            RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setRadiologyTestId(param.getRadiologyTestId());
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        })
                        .collect(Collectors.toList());
                responseDTO.setTestParameters(responseParameters);
            }

            log.info("Radiology test created successfully with ID: {}", savedTest.getRadiologyTestId());
            return responseDTO;

        } catch (Exception e) {
            log.error("Error creating radiology test: {}", e.getMessage());
            throw new RadiologyException("Failed to create radiology test", "ERR_CREATE_RADIOLOGY_TEST", e);
        }
    }

    public List<RadiologyTestDetailsDTO> getAllRadiologyTests() {
        log.info("Fetching all radiology tests");

        try {
            List<HMS_TM_RadiologyTests> tests = radiologyTestsRepository.findAllByDeletedFalse();
            log.debug("Fetched {} radiology tests", tests.size());

            return tests.stream().map(test -> {
                RadiologyTestDetailsDTO dto = new RadiologyTestDetailsDTO();
                dto.setRadiologyTestId(test.getRadiologyTestId());
                dto.setTestName(test.getTestName());
                dto.setShortName(test.getShortName());
                dto.setTestType(test.getTestType());
                dto.setCategoryName(test.getCategoryName());
                dto.setSubCategory(test.getSubCategory());
                dto.setReportDays(test.getReportDays());
                dto.setChargeCategory(test.getChargeCategory());
                dto.setChargeName(test.getChargeName());
                dto.setTaxPercentage(test.getTaxPercentage());
                dto.setStandardCharge(test.getStandardCharge());
                dto.setAmount(test.getAmount());

                List<RadiologyTestParameterDTO> responseParameters = radiologyTestParametersRepository.findByRadiologyTestId(test.getRadiologyTestId()).stream()
                        .map(param -> {
                            RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setRadiologyTestId(param.getRadiologyTestId());
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        }).collect(Collectors.toList());

                dto.setTestParameters(responseParameters);
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching all radiology tests: {}", e.getMessage());
            throw new RadiologyException("Failed to fetch radiology tests", "ERR_FETCH_ALL_RADIOLOGY_TESTS", e);
        }
    }

    public RadiologyTestDetailsDTO getRadiologyTestById(String testId) {
        log.info("Fetching radiology test with ID: {}", testId);
        HMS_TM_RadiologyTests test = radiologyTestsRepository.findByRadiologyTestIdAndDeletedFalse(testId)
                .orElseThrow(() -> {
                    log.error("Radiology test not found with ID: {}", testId);
                    return new CustomException("Radiology test not found with ID: " + testId);
                });

        RadiologyTestDetailsDTO dto = new RadiologyTestDetailsDTO();
        dto.setRadiologyTestId(test.getRadiologyTestId());
        dto.setTestName(test.getTestName());
        dto.setShortName(test.getShortName());
        dto.setTestType(test.getTestType());
        dto.setCategoryName(test.getCategoryName());
        dto.setSubCategory(test.getSubCategory());
        dto.setReportDays(test.getReportDays());
        dto.setChargeCategory(test.getChargeCategory());
        dto.setChargeName(test.getChargeName());
        dto.setTaxPercentage(test.getTaxPercentage());
        dto.setStandardCharge(test.getStandardCharge());
        dto.setAmount(test.getAmount());

        List<RadiologyTestParameterDTO> responseParameters = radiologyTestParametersRepository.findByRadiologyTestId(test.getRadiologyTestId()).stream()
                .map(param -> {
                    RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
                    responseParam.setParameterName(param.getParameterName());
                    responseParam.setParameterId(param.getParameterId());
                    responseParam.setRadiologyTestId(param.getRadiologyTestId());
                    responseParam.setNormalRange(param.getNormalRange());
                    responseParam.setUnit(param.getUnit());
                    return responseParam;
                }).collect(Collectors.toList());

        dto.setTestParameters(responseParameters);
        return dto;
    }

    @Transactional
    public RadiologyTestDetailsDTO updateRadiologyTest(String testId, RadiologyTestDetailsDTO testDetailsDTO) {
        log.info("Updating radiology test with ID: {}", testId);
        HMS_TM_RadiologyTests test = radiologyTestsRepository.findById(testId)
                .orElseThrow(() -> {
                    log.error("Radiology test not found with ID: {}", testId);
                    return new CustomException("Radiology test not found with ID: " + testId);
                });

        test.setRadiologyTestId(testDetailsDTO.getRadiologyTestId());
        test.setTestName(testDetailsDTO.getTestName());
        test.setShortName(testDetailsDTO.getShortName());
        test.setTestType(testDetailsDTO.getTestType());
        test.setCategoryName(testDetailsDTO.getCategoryName());
        test.setSubCategory(testDetailsDTO.getSubCategory());
        test.setReportDays(testDetailsDTO.getReportDays());
        test.setChargeCategory(testDetailsDTO.getChargeCategory());
        test.setChargeName(testDetailsDTO.getChargeName());
        test.setTaxPercentage(testDetailsDTO.getTaxPercentage());
        test.setStandardCharge(testDetailsDTO.getStandardCharge());
        test.setAmount(testDetailsDTO.getAmount());

        if (testDetailsDTO.getTestParameters() != null && !testDetailsDTO.getTestParameters().isEmpty()) {
            log.info("Updating parameters for radiology test with ID: {}", testId);
            radiologyTestParametersRepository.deleteAllByRadiologyTestId(testId);

            List<HMS_TM_RadiologyTestParameters> parametersList = testDetailsDTO.getTestParameters().stream()
                    .map(testParameterDTO -> {
                        HMS_TM_RadiologyTestParameters parameter = new HMS_TM_RadiologyTestParameters();
                        parameter.setParameterId(testParameterDTO.getParameterId());
                        parameter.setParameterName(testParameterDTO.getParameterName());
                        parameter.setNormalRange(testParameterDTO.getNormalRange());
                        parameter.setUnit(testParameterDTO.getUnit());
                        parameter.setRadiologyTestId(testId);
                        return parameter;
                    })
                    .collect(Collectors.toList());

            radiologyTestParametersRepository.saveAll(parametersList);
        }

        radiologyTestsRepository.save(test);

        log.info("Radiology test updated successfully with ID: {}", testId);

        RadiologyTestDetailsDTO responseDTO = new RadiologyTestDetailsDTO();
        responseDTO.setRadiologyTestId(test.getRadiologyTestId());
        responseDTO.setTestName(test.getTestName());
        responseDTO.setShortName(test.getShortName());
        responseDTO.setTestType(test.getTestType());
        responseDTO.setCategoryName(test.getCategoryName());
        responseDTO.setSubCategory(test.getSubCategory());
        responseDTO.setReportDays(test.getReportDays());
        responseDTO.setChargeCategory(test.getChargeCategory());
        responseDTO.setChargeName(test.getChargeName());
        responseDTO.setTaxPercentage(test.getTaxPercentage());
        responseDTO.setStandardCharge(test.getStandardCharge());
        responseDTO.setAmount(test.getAmount());

        if (testDetailsDTO.getTestParameters() != null) {
            List<RadiologyTestParameterDTO> responseParameters = testDetailsDTO.getTestParameters().stream()
                    .map(param -> {
                        RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
                        responseParam.setRadiologyTestId(param.getRadiologyTestId());
                        responseParam.setParameterId(param.getParameterId());
                        responseParam.setParameterName(param.getParameterName());
                        responseParam.setNormalRange(param.getNormalRange());
                        responseParam.setUnit(param.getUnit());
                        return responseParam;
                    })
                    .collect(Collectors.toList());
            responseDTO.setTestParameters(responseParameters);
        }

        return responseDTO;
    }

    public void deleteRadiologyTest(String testId) {
        log.info("Deleting radiology test with ID: {}", testId);
        Optional<HMS_TM_RadiologyTests> testOptional = radiologyTestsRepository.findById(testId);
        if (testOptional.isPresent()) {
            HMS_TM_RadiologyTests radiologyTest = testOptional.get();
            radiologyTest.setDeleted(true);
            radiologyTestsRepository.save(radiologyTest);
            log.info("Radiology test with ID: {} marked as deleted", testId);
        } else {
            log.error("Radiology test not found with ID: {}", testId);
            throw new CustomException("Radiology test not found with ID: " + testId);
        }
    }

    public List<RadiologyTestDetailsDTO> getRadiologyTestsByIds(List<String> testIds) {
        log.info("Fetching radiology tests for IDs: {}", testIds);
        List<HMS_TM_RadiologyTests> tests = radiologyTestsRepository.findByRadiologyTestIdIn(testIds);

        if (tests.isEmpty()) {
            log.error("No radiology tests found for the provided IDs: {}", testIds);
            throw new CustomException("No radiology tests found for the provided IDs: " + testIds);
        }

        return tests.stream().map(test -> {
            RadiologyTestDetailsDTO dto = new RadiologyTestDetailsDTO();
            dto.setRadiologyTestId(test.getRadiologyTestId());
            dto.setTestName(test.getTestName());
            dto.setShortName(test.getShortName());
            dto.setTestType(test.getTestType());
            dto.setCategoryName(test.getCategoryName());
            dto.setSubCategory(test.getSubCategory());
            dto.setReportDays(test.getReportDays());
            dto.setChargeCategory(test.getChargeCategory());
            dto.setChargeName(test.getChargeName());
            dto.setTaxPercentage(test.getTaxPercentage());
            dto.setStandardCharge(test.getStandardCharge());
            dto.setAmount(test.getAmount());

            List<RadiologyTestParameterDTO> responseParameters = radiologyTestParametersRepository
                    .findByRadiologyTestId(test.getRadiologyTestId()).stream()
                    .map(param -> {
                        RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
                        responseParam.setParameterName(param.getParameterName());
                        responseParam.setParameterId(param.getParameterId());
                        responseParam.setRadiologyTestId(param.getRadiologyTestId());
                        responseParam.setNormalRange(param.getNormalRange());
                        responseParam.setUnit(param.getUnit());
                        return responseParam;
                    }).collect(Collectors.toList());

            dto.setTestParameters(responseParameters);
            return dto;
        }).collect(Collectors.toList());
    }
}
