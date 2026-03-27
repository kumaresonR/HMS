package com.hms.services.laboratorymanagement.service;

import com.hms.services.laboratorymanagement.entity.HMS_TM_LabPathologyTests;
import com.hms.services.laboratorymanagement.entity.HMS_TM_PathologyTestParameters;
import com.hms.services.laboratorymanagement.exceptionhandler.CustomException;
import com.hms.services.laboratorymanagement.exceptionhandler.PathologyException;
import com.hms.services.laboratorymanagement.model.PathologyTestDetailsDTO;
import com.hms.services.laboratorymanagement.model.PathologyTestParameterDTO;
import com.hms.services.laboratorymanagement.repository.LabPathologyTestsRepository;
import com.hms.services.laboratorymanagement.repository.PathologyTestParametersRepository;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PathologyService {

    private static final Logger log = LoggerFactory.getLogger(PathologyService.class);

    @Autowired
    private LabPathologyTestsRepository pathologyTestsRepository;

    @Autowired
    private PathologyTestParametersRepository testParametersRepository;

    public PathologyTestDetailsDTO createLabTest(PathologyTestDetailsDTO testDetailsDTO) {
        log.info("Creating lab test with details: {}", testDetailsDTO);

        try {
            HMS_TM_LabPathologyTests test = new HMS_TM_LabPathologyTests();
            test.setTestName(testDetailsDTO.getTestName());
            test.setShortName(testDetailsDTO.getShortName());
            test.setTestType(testDetailsDTO.getTestType());
            test.setCategoryName(testDetailsDTO.getCategoryName());
            test.setSubCategory(testDetailsDTO.getSubCategory());
            test.setMethod(testDetailsDTO.getMethod());
            test.setReportDays(testDetailsDTO.getReportDays());
            test.setChargeCategory(testDetailsDTO.getChargeCategory());
            test.setChargeName(testDetailsDTO.getChargeName());
            test.setTaxPercentage(testDetailsDTO.getTaxPercentage());
            test.setStandardCharge(testDetailsDTO.getStandardCharge());
            test.setAmount(testDetailsDTO.getAmount());

            HMS_TM_LabPathologyTests savedTest = pathologyTestsRepository.save(test);
            String pathologyTestId = savedTest.getPathologyTestId();

            List<HMS_TM_PathologyTestParameters> parametersList = null;
            if (testDetailsDTO.getTestParameters() != null && !testDetailsDTO.getTestParameters().isEmpty()) {
                parametersList = testDetailsDTO.getTestParameters().stream()
                        .map(testParameterDTO -> {
                            HMS_TM_PathologyTestParameters parameter = new HMS_TM_PathologyTestParameters();
                            parameter.setParameterName(testParameterDTO.getParameterName());
                            parameter.setNormalRange(testParameterDTO.getNormalRange());
                            parameter.setUnit(testParameterDTO.getUnit());
                            parameter.setPathologyTestId(pathologyTestId);
                            return parameter;
                        })
                        .collect(Collectors.toList());

                testParametersRepository.saveAll(parametersList);
            }

            PathologyTestDetailsDTO responseDTO = new PathologyTestDetailsDTO();
            responseDTO.setPathologyTestId(savedTest.getPathologyTestId());
            responseDTO.setTestName(savedTest.getTestName());
            responseDTO.setShortName(savedTest.getShortName());
            responseDTO.setTestType(savedTest.getTestType());
            responseDTO.setCategoryName(savedTest.getCategoryName());
            responseDTO.setSubCategory(savedTest.getSubCategory());
            responseDTO.setMethod(savedTest.getMethod());
            responseDTO.setReportDays(savedTest.getReportDays());
            responseDTO.setChargeCategory(savedTest.getChargeCategory());
            responseDTO.setChargeName(savedTest.getChargeName());
            responseDTO.setTaxPercentage(savedTest.getTaxPercentage());
            responseDTO.setStandardCharge(savedTest.getStandardCharge());
            responseDTO.setAmount(savedTest.getAmount());

            if (parametersList != null) {
                List<PathologyTestParameterDTO> responseParameters = parametersList.stream()
                        .map(param -> {
                            PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setPathologyTestId(param.getPathologyTestId());
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        })
                        .collect(Collectors.toList());
                responseDTO.setTestParameters(responseParameters);
            }

            log.info("Lab test created successfully with ID: {}", savedTest.getPathologyTestId());
            return responseDTO;

        } catch (Exception e) {
            log.error("Error creating lab test: {}", e.getMessage());
            throw new PathologyException("Failed to create lab test", "ERR_CREATE_LAB_TEST", e);
        }
    }

    public List<PathologyTestDetailsDTO> getAllLabTests() {
        log.info("Fetching all lab tests");

        try {
            List<HMS_TM_LabPathologyTests> tests = pathologyTestsRepository.findAllByDeletedFalse();
            log.debug("Fetched {} lab tests", tests.size());

            return tests.stream().map(test -> {
                PathologyTestDetailsDTO dto = new PathologyTestDetailsDTO();
                dto.setPathologyTestId(test.getPathologyTestId());
                dto.setTestName(test.getTestName());
                dto.setShortName(test.getShortName());
                dto.setTestType(test.getTestType());
                dto.setCategoryName(test.getCategoryName());
                dto.setSubCategory(test.getSubCategory());
                dto.setMethod(test.getMethod());
                dto.setReportDays(test.getReportDays());
                dto.setChargeCategory(test.getChargeCategory());
                dto.setChargeName(test.getChargeName());
                dto.setTaxPercentage(test.getTaxPercentage());
                dto.setStandardCharge(test.getStandardCharge());
                dto.setAmount(test.getAmount());

                List<PathologyTestParameterDTO> responseParameters = testParametersRepository.findByPathologyTestId(test.getPathologyTestId()).stream()
                        .map(param -> {
                            PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setPathologyTestId(param.getPathologyTestId());
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        }).collect(Collectors.toList());

                dto.setTestParameters(responseParameters);
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching all lab tests: {}", e.getMessage());
            throw new PathologyException("Failed to fetch lab tests", "ERR_FETCH_ALL_LAB_TESTS", e);
        }
    }

    public PathologyTestDetailsDTO getLabTestById(String testId) {
        log.info("Fetching lab test with ID: {}", testId);

        try {
            HMS_TM_LabPathologyTests test = pathologyTestsRepository.findByPathologyTestIdAndDeletedFalse(testId)
                    .orElseThrow(() -> new PathologyException("Lab test not found with ID: " + testId, "ERR_LAB_TEST_NOT_FOUND", null));

            PathologyTestDetailsDTO dto = new PathologyTestDetailsDTO();
            dto.setPathologyTestId(test.getPathologyTestId());
            dto.setTestName(test.getTestName());
            dto.setShortName(test.getShortName());
            dto.setTestType(test.getTestType());
            dto.setCategoryName(test.getCategoryName());
            dto.setSubCategory(test.getSubCategory());
            dto.setMethod(test.getMethod());
            dto.setReportDays(test.getReportDays());
            dto.setChargeCategory(test.getChargeCategory());
            dto.setChargeName(test.getChargeName());
            dto.setTaxPercentage(test.getTaxPercentage());
            dto.setStandardCharge(test.getStandardCharge());
            dto.setAmount(test.getAmount());

            List<PathologyTestParameterDTO> responseParameters = testParametersRepository.findByPathologyTestId(test.getPathologyTestId()).stream()
                    .map(param -> {
                        PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
                        responseParam.setParameterId(param.getParameterId());
                        responseParam.setPathologyTestId(param.getPathologyTestId());
                        responseParam.setParameterName(param.getParameterName());
                        responseParam.setNormalRange(param.getNormalRange());
                        responseParam.setUnit(param.getUnit());
                        return responseParam;
                    }).collect(Collectors.toList());

            dto.setTestParameters(responseParameters);
            return dto;

        } catch (Exception e) {
            log.error("Error fetching lab test with ID {}: {}", testId, e.getMessage());
            throw new PathologyException("Error fetching lab test", "ERR_FETCH_LAB_TEST_BY_ID", e);
        }
    }

    @Transactional
    public PathologyTestDetailsDTO updateLabTest(String testId, PathologyTestDetailsDTO testDetailsDTO) {
        log.info("Entering updateLabTest method with testId: {} and testDetailsDTO: {}", testId, testDetailsDTO);

        try {
            HMS_TM_LabPathologyTests test = pathologyTestsRepository.findById(testId)
                    .orElseThrow(() -> new CustomException("Lab test not found with ID: " + testId));

            test.setPathologyTestId(testDetailsDTO.getPathologyTestId());
            test.setTestName(testDetailsDTO.getTestName());
            test.setShortName(testDetailsDTO.getShortName());
            test.setTestType(testDetailsDTO.getTestType());
            test.setCategoryName(testDetailsDTO.getCategoryName());
            test.setSubCategory(testDetailsDTO.getSubCategory());
            test.setMethod(testDetailsDTO.getMethod());
            test.setReportDays(testDetailsDTO.getReportDays());
            test.setChargeCategory(testDetailsDTO.getChargeCategory());
            test.setChargeName(testDetailsDTO.getChargeName());
            test.setTaxPercentage(testDetailsDTO.getTaxPercentage());
            test.setStandardCharge(testDetailsDTO.getStandardCharge());
            test.setAmount(testDetailsDTO.getAmount());

            if (testDetailsDTO.getTestParameters() != null && !testDetailsDTO.getTestParameters().isEmpty()) {
                testParametersRepository.deleteAllByPathologyTestId(testId);

                List<HMS_TM_PathologyTestParameters> parametersList = testDetailsDTO.getTestParameters().stream()
                        .map(testParameterDTO -> {
                            HMS_TM_PathologyTestParameters parameter = new HMS_TM_PathologyTestParameters();
                            parameter.setPathologyTestId(testParameterDTO.getPathologyTestId());
                            parameter.setParameterId(testParameterDTO.getParameterId());
                            parameter.setParameterName(testParameterDTO.getParameterName());
                            parameter.setNormalRange(testParameterDTO.getNormalRange());
                            parameter.setUnit(testParameterDTO.getUnit());
                            return parameter;
                        })
                        .collect(Collectors.toList());

                testParametersRepository.saveAll(parametersList);
            }

            pathologyTestsRepository.save(test);

            PathologyTestDetailsDTO responseDTO = new PathologyTestDetailsDTO();
            responseDTO.setPathologyTestId(test.getPathologyTestId());
            responseDTO.setTestName(test.getTestName());
            responseDTO.setShortName(test.getShortName());
            responseDTO.setTestType(test.getTestType());
            responseDTO.setCategoryName(test.getCategoryName());
            responseDTO.setSubCategory(test.getSubCategory());
            responseDTO.setMethod(test.getMethod());
            responseDTO.setReportDays(test.getReportDays());
            responseDTO.setChargeCategory(test.getChargeCategory());
            responseDTO.setChargeName(test.getChargeName());
            responseDTO.setTaxPercentage(test.getTaxPercentage());
            responseDTO.setStandardCharge(test.getStandardCharge());
            responseDTO.setAmount(test.getAmount());

            if (testDetailsDTO.getTestParameters() != null) {
                List<PathologyTestParameterDTO> responseParameters = testDetailsDTO.getTestParameters().stream()
                        .map(param -> {
                            PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setPathologyTestId(param.getPathologyTestId());
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        })
                        .collect(Collectors.toList());
                responseDTO.setTestParameters(responseParameters);
            }

            log.info("Lab test updated successfully with ID: {}", test.getPathologyTestId());
            return responseDTO;

        } catch (Exception e) {
            log.error("Error occurred while updating lab test with ID: {}: {}", testId, e.getMessage());
            throw new CustomException("Failed to update Lab Test", e);
        }
    }

    public void deleteLabTest(String testId) {
        log.info("Entering deleteLabTest method with testId: {}", testId);

        try {
            Optional<HMS_TM_LabPathologyTests> testOptional = pathologyTestsRepository.findById(testId);
            if (testOptional.isPresent()) {
                HMS_TM_LabPathologyTests labTest = testOptional.get();
                labTest.setDeleted(true);
                pathologyTestsRepository.save(labTest);
                log.info("Lab test with ID: {} marked as deleted", testId);
            } else {
                log.warn("Lab test not found with ID: {}", testId);
                throw new CustomException("Lab test not found with ID: " + testId);
            }

        } catch (Exception e) {
            log.error("Error occurred while deleting lab test with ID: {}: {}", testId, e.getMessage());
            throw new CustomException("Failed to delete Lab Test", e);
        }
    }

    public List<PathologyTestDetailsDTO> getPathologyTestsByIds(List<String> testIds) {
        log.info("Entering getPathologyTestsByIds method with testIds: {}", testIds);

        try {
            List<HMS_TM_LabPathologyTests> tests = pathologyTestsRepository.findByPathologyTestIdIn(testIds);

            if (tests.isEmpty()) {
                log.warn("No pathology tests found for the provided IDs: {}", testIds);
                throw new CustomException("No pathology tests found for the provided IDs: " + testIds);
            }

            return tests.stream().map(test -> {
                PathologyTestDetailsDTO dto = new PathologyTestDetailsDTO();
                dto.setPathologyTestId(test.getPathologyTestId());
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

                List<PathologyTestParameterDTO> responseParameters = testParametersRepository
                        .findByPathologyTestId(test.getPathologyTestId()).stream()
                        .map(param -> {
                            PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setPathologyTestId(param.getPathologyTestId());
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        })
                        .collect(Collectors.toList());
                dto.setTestParameters(responseParameters);

                return dto;
            }).collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error occurred while fetching pathology tests for IDs: {}: {}", testIds, e.getMessage());
            throw new CustomException("Failed to retrieve Pathology Tests", e);
        }
    }

}


