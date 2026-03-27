package com.hms.services.frontofficemanagement.controller;

import com.hms.services.frontofficemanagement.model.PostalDispatch;
import com.hms.services.frontofficemanagement.service.PostalDispatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/front-office")
public class PostalDispatchController {

    @Autowired
    private final PostalDispatchService postalDispatchService;

    public PostalDispatchController(PostalDispatchService postalDispatchService) {
        this.postalDispatchService = postalDispatchService;
    }


    @PostMapping("/postaldispatch/add")
    public ResponseEntity<PostalDispatch> createPostalDispatch(@RequestBody PostalDispatch postalDispatchDto) {
        PostalDispatch postalDispatch = postalDispatchService.createPostalDispatch(postalDispatchDto);
        return new ResponseEntity<>(postalDispatch, HttpStatus.CREATED);
    }

    @GetMapping("/postaldispatchs")
    public ResponseEntity<List<PostalDispatch>> getAllComplaints() {
        List<PostalDispatch> postalDispatchs = null;
        postalDispatchs = postalDispatchService.getAllPostalDispatchs();
        if (postalDispatchs != null && !postalDispatchs.isEmpty()) {
            return new ResponseEntity<>(postalDispatchs, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/postaldispatch/{id}")
    public ResponseEntity<PostalDispatch> getPostalDispatchById(@PathVariable UUID id) {
        PostalDispatch postalDispatch = null;
        postalDispatch = postalDispatchService.getPostalDispatchById(id);
        if (postalDispatch != null) {
            return new ResponseEntity<>(postalDispatch, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PutMapping("/postaldispatch/{id}")
    ResponseEntity<PostalDispatch> updatePostalDispatch(@PathVariable UUID id, @RequestBody PostalDispatch postalDispatchDto) {
        PostalDispatch updatedPostalDispatch = postalDispatchService.updatePostalDispatch(id, postalDispatchDto);
        if(updatedPostalDispatch!=null) {
            return new ResponseEntity<>(updatedPostalDispatch, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @DeleteMapping("/postaldispatch/{id}")
    public ResponseEntity<String> deletePostalDispatch(@PathVariable UUID id) {
        Boolean isDeleted = postalDispatchService.deletePostalDispatchById(id);
        if (isDeleted) {
            return ResponseEntity.ok("Complaint with ID " + id + " deleted successfully.");
        }else{
            return ResponseEntity.notFound().build();
        }

    }
}


