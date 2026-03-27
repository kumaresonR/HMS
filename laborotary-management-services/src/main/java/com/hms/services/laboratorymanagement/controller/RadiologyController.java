package com.hms.services.laboratorymanagement.controller;

import com.hms.services.laboratorymanagement.exceptionhandler.RadiologyException;
import com.hms.services.laboratorymanagement.model.RadiologyTestDetailsDTO;
import com.hms.services.laboratorymanagement.service.RadiologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/radiology-tests")
public class RadiologyController {

    private static final Logger log = LoggerFactory.getLogger(RadiologyController.class);

    @Autowired
    private RadiologyService radiologyService;

    @PostMapping("/create")
    public ResponseEntity<RadiologyTestDetailsDTO> createRadiologyTest(@Valid @RequestBody RadiologyTestDetailsDTO testDetailsDTO) {
        try {
            log.info("Creating a new radiology test: {}", testDetailsDTO);
            RadiologyTestDetailsDTO createdTest = radiologyService.createRadiologyTest(testDetailsDTO);
            log.debug("Radiology test created successfully: {}", createdTest);
            return ResponseEntity.ok(createdTest);
        } catch (Exception e) {
            log.error("Error creating radiology test: {}", e.getMessage());
            throw new RadiologyException("Error creating radiology test", "ERR_CREATE_TEST", e);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<RadiologyTestDetailsDTO>> getAllRadiologyTests() {
        try {
            log.info("Fetching all radiology tests");
            List<RadiologyTestDetailsDTO> radiologyTests = radiologyService.getAllRadiologyTests();
            log.debug("Fetched {} radiology tests", radiologyTests.size());
            return new ResponseEntity<>(radiologyTests, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching all radiology tests: {}", e.getMessage());
            throw new RadiologyException("Error fetching all radiology tests", "ERR_FETCH_ALL_TESTS", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RadiologyTestDetailsDTO> getRadiologyTestById(@PathVariable String id) {
        try {
            log.info("Fetching radiology test with ID: {}", id);
            RadiologyTestDetailsDTO radiologyTest = radiologyService.getRadiologyTestById(id);
            log.debug("Fetched radiology test: {}", radiologyTest);
            return new ResponseEntity<>(radiologyTest, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching radiology test with ID {}: {}", id, e.getMessage());
            throw new RadiologyException("Error fetching radiology test", "ERR_FETCH_TEST", e);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RadiologyTestDetailsDTO> updateRadiologyTest(@PathVariable String id,
                                                                       @Valid @RequestBody RadiologyTestDetailsDTO testDetailsDTO) {
        try {
            log.info("Updating radiology test with ID: {}", id);
            RadiologyTestDetailsDTO updatedTest = radiologyService.updateRadiologyTest(id, testDetailsDTO);
            log.debug("Updated radiology test: {}", updatedTest);
            return new ResponseEntity<>(updatedTest, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error updating radiology test with ID {}: {}", id, e.getMessage());
            throw new RadiologyException("Error updating radiology test", "ERR_UPDATE_TEST", e);
        }
    }

    @DeleteMapping("/remove/{testId}")
    public ResponseEntity<String> deleteRadiologyTest(@PathVariable String testId) {
        try {
            log.info("Deleting radiology test with ID: {}", testId);
            radiologyService.deleteRadiologyTest(testId);
            log.info("Radiology test with ID {} marked as deleted", testId);
            return new ResponseEntity<>("Radiology test marked as deleted.", HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error deleting radiology test with ID {}: {}", testId, e.getMessage());
            throw new RadiologyException("Error deleting radiology test", "ERR_DEL_TEST", e);
        }
    }

    @GetMapping
    public ResponseEntity<List<RadiologyTestDetailsDTO>> getRadiologyTestsByIds(@RequestParam List<String> ids) {
        try {
            log.info("Fetching radiology tests with IDs: {}", ids);
            List<RadiologyTestDetailsDTO> radiologyTests = radiologyService.getRadiologyTestsByIds(ids);
            log.debug("Fetched radiology tests: {}", radiologyTests);
            return new ResponseEntity<>(radiologyTests, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching radiology tests by IDs: {}", e.getMessage());
            throw new RadiologyException("Error fetching radiology tests", "ERR_FETCH_BY_IDS", e);
        }
    }
}


