package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.model.CommentsDTO;
import com.hms.services.ipdmanagement.model.NurseNotesDTO;
import com.hms.services.ipdmanagement.response.ApiResponse;
import com.hms.services.ipdmanagement.service.NurseNotesService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ipd_nurse-notes")
public class    IPDNurseNotesController {

    private final NurseNotesService nurseNotesService;

    @Autowired
    public IPDNurseNotesController(final NurseNotesService nurseNotesService) {
        this.nurseNotesService = nurseNotesService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createNurseNote(@RequestBody NurseNotesDTO nurseNotesDto) {
        ApiResponse createdNote = nurseNotesService.createNurseNote(nurseNotesDto);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteNurseNoteById(@PathVariable("id") String notesId) {
        ApiResponse response = nurseNotesService.deleteNurseNoteById(notesId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<NurseNotesDTO>> getAllNurseNotes(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<NurseNotesDTO> nurseNotes = nurseNotesService.getAllNurseNotes(page, size);
        return ResponseEntity.ok(nurseNotes);
    }

    @GetMapping("/{notesId}")
    public ResponseEntity<NurseNotesDTO> getNurseNoteById(@PathVariable("notesId") String id) {
        NurseNotesDTO nurseNoteDTO = nurseNotesService.getNurseNoteById(id);
        return ResponseEntity.ok(nurseNoteDTO);
    }

    @PutMapping("/update/{notesId}/{commentsId}")
    public ResponseEntity<JSONObject> updateNurseNoteById(@PathVariable String notesId,@PathVariable String commentsId, @RequestBody NurseNotesDTO nurseNotesDto) {
        JSONObject updatedNoteDTO = nurseNotesService.updateNurseNoteById(notesId,commentsId,nurseNotesDto);
        return ResponseEntity.ok(updatedNoteDTO);
    }

    @GetMapping("ipd/{ipdId}")
    public ResponseEntity<List<NurseNotesDTO>> getNurseNoteByIpdId(@PathVariable("ipdId") String id) {
        List<NurseNotesDTO> nurseNoteDTO = nurseNotesService.getNurseNoteByIpdId(id);
        return ResponseEntity.ok(nurseNoteDTO);
    }

    @PostMapping("/{notesId}/comments")
    public ResponseEntity<ApiResponse> addComment(@PathVariable String notesId, @RequestBody CommentsDTO commentDto) {
        ApiResponse response = nurseNotesService.addCommentToNote(notesId, commentDto);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse> deleteComment(@PathVariable String commentId) {
        ApiResponse response = nurseNotesService.deleteCommentFromNote(commentId);
        return ResponseEntity.ok(response);
    }

}

