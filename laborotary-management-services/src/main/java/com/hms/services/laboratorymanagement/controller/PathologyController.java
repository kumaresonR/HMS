package com.hms.services.laboratorymanagement.controller;

import com.hms.services.laboratorymanagement.exceptionhandler.PathologyException;
import com.hms.services.laboratorymanagement.model.PathologyTestDetailsDTO;
import com.hms.services.laboratorymanagement.service.PathologyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/pathology-tests")
public class PathologyController {

    private static final Logger log = LoggerFactory.getLogger(PathologyController.class);

    @Autowired
    private PathologyService labTestService;

    @PostMapping("/create")
    public ResponseEntity<PathologyTestDetailsDTO> createLabTest(@RequestBody PathologyTestDetailsDTO testDetailsDTO) {
        log.info("Creating a new lab test: {}", testDetailsDTO);
        PathologyTestDetailsDTO createdTest = labTestService.createLabTest(testDetailsDTO);
        log.debug("Lab test created successfully: {}", createdTest);
        return ResponseEntity.ok(createdTest);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PathologyTestDetailsDTO>> getAllLabTests() {
        log.info("Fetching all lab tests");
        List<PathologyTestDetailsDTO> labTests = labTestService.getAllLabTests();
        log.debug("Fetched {} lab tests", labTests.size());
        return new ResponseEntity<>(labTests, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PathologyTestDetailsDTO> getLabTestById(@PathVariable String id) {
        log.info("Fetching lab test with ID: {}", id);
        PathologyTestDetailsDTO labTest = labTestService.getLabTestById(id);
        log.debug("Fetched lab test: {}", labTest);
        return new ResponseEntity<>(labTest, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PathologyTestDetailsDTO> updateLabTest(@PathVariable String id,
                                                                 @RequestBody PathologyTestDetailsDTO testDetailsDTO) {
        log.info("Updating lab test with ID: {}", id);
        PathologyTestDetailsDTO updatedTest = labTestService.updateLabTest(id, testDetailsDTO);
        log.debug("Updated lab test: {}", updatedTest);
        return new ResponseEntity<>(updatedTest, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{testId}")
    public ResponseEntity<String> deleteLabTest(@PathVariable String testId) {
        log.info("Deleting lab test with ID: {}", testId);
        try {
            labTestService.deleteLabTest(testId);
            log.info("Lab test with ID {} marked as deleted", testId);
            return new ResponseEntity<>("Lab test marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            log.error("Error deleting lab test with ID {}: {}", testId, e.getMessage());
            throw new PathologyException("Error deleting lab test", "ERR_DEL_TEST", e);
        }
    }

    @GetMapping
    public ResponseEntity<List<PathologyTestDetailsDTO>> getPathologyTestsByIds(@RequestParam List<String> ids) {
        log.info("Fetching pathology tests with IDs: {}", ids);
        List<PathologyTestDetailsDTO> pathologyTests = labTestService.getPathologyTestsByIds(ids);
        log.debug("Fetched pathology tests: {}", pathologyTests);
        return new ResponseEntity<>(pathologyTests, HttpStatus.OK);
    }
}




