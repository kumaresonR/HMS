package com.hms.services.inventorymanagement.controller;

import com.hms.services.inventorymanagement.entity.HMS_TM_AddIssueItem;
import com.hms.services.inventorymanagement.model.ReturnRequestDto;
import com.hms.services.inventorymanagement.service.AddIssueItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/add-issue-item")
public class AddIssueItemController {

    @Autowired
    private AddIssueItemService service;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_AddIssueItem> createIssueItem(@RequestBody HMS_TM_AddIssueItem issueItem) {
        HMS_TM_AddIssueItem createdItem = service.createIssueItem(issueItem);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public List<HMS_TM_AddIssueItem> getAllIssueItems() {
        return service.getAllIssueItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AddIssueItem> getIssueItemById(@PathVariable String id) {
        return service.getIssueItemById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<HMS_TM_AddIssueItem> updateReturnStatus(
            @PathVariable String id,
            @RequestBody ReturnRequestDto returnRequest) {
        HMS_TM_AddIssueItem updatedItem = service.updateReturnStatus(id, returnRequest);
        return updatedItem != null ? ResponseEntity.ok(updatedItem) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_AddIssueItem> updateIssueItem(@PathVariable String id, @RequestBody HMS_TM_AddIssueItem updatedItem) {
        HMS_TM_AddIssueItem updated = service.updateIssueItem(id, updatedItem);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddIssueItem(@PathVariable String id) {
        try {
            service.deleteAddIssueItem(id);
            return new ResponseEntity<>("Item marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Item not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/all-search")
    public ResponseEntity<Map<String, Object>> searchAddIssueItems(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable
    ) {
        Page<HMS_TM_AddIssueItem> pageResult = service.searchAddIssueItems(timeDuration, startDate, endDate, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("data", pageResult.getContent());
        response.put("currentPage", pageResult.getNumber());
        response.put("totalItems", pageResult.getTotalElements());  // 🔥 Total records
        response.put("totalPages", pageResult.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download-issue-items")
    public ResponseEntity<Resource> downloadIssueItemsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws IOException {

        List<HMS_TM_AddIssueItem> issueItems = service.searchIssueItems(timeDuration, startDate, endDate);
        ByteArrayInputStream in = service.generateIssueItemExcel(issueItems);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=issue_items.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }


}

