package com.hms.services.frontofficemanagement.controller;

import com.hms.services.frontofficemanagement.model.PostalReceive;
import com.hms.services.frontofficemanagement.service.PostalReceiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/front-office")
public class PostalReceiveController {

    @Autowired
    private final PostalReceiveService postalReceiveService;

    public PostalReceiveController(PostalReceiveService postalReceiveService) {
        this.postalReceiveService = postalReceiveService;
    }


    @PostMapping("/postalreceive/add")
    public ResponseEntity<PostalReceive> createPostalReceive(@RequestBody PostalReceive postalReceiveDto) {
        PostalReceive postalReceive = postalReceiveService.createPostalReceive(postalReceiveDto);
        return new ResponseEntity<>(postalReceive, HttpStatus.CREATED);
    }

    @GetMapping("/postalreceives")
    public ResponseEntity<List<PostalReceive>> getAllPostalReceives() {
        List<PostalReceive> postalReceives = null;
        postalReceives = postalReceiveService.getAllPostalReceives();
        if (postalReceives != null && !postalReceives.isEmpty()) {
            return new ResponseEntity<>(postalReceives, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/postalreceive/{id}")
    public ResponseEntity<PostalReceive> getPostalReceiveById(@PathVariable UUID id) {
        PostalReceive postalReceive = null;
        postalReceive = postalReceiveService.getPostalReceiveById(id);
        if (postalReceive != null) {
            return new ResponseEntity<>(postalReceive, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PutMapping("/postalreceive/{id}")
    ResponseEntity<PostalReceive> updateComplaint(@PathVariable UUID id, @RequestBody PostalReceive postalReceiveDto) {
        PostalReceive updatedPostalReceive = postalReceiveService.updatePostalReceive(id, postalReceiveDto);
        if(updatedPostalReceive!=null) {
            return new ResponseEntity<>(updatedPostalReceive, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @DeleteMapping("/postalreceive/{id}")
    public ResponseEntity<String> deletePostalReceive(@PathVariable UUID id) {
        Boolean isDeleted = postalReceiveService.deletePostalReceiveById(id);
        if (isDeleted) {
            return ResponseEntity.ok("Complaint with ID " + id + " deleted successfully.");
        }else{
            return ResponseEntity.notFound().build();
        }

    }
}


