package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.entity.HMS_TM_Comments;
import com.hms.services.ipdmanagement.entity.HMS_TM_NurseNotes;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.CommentsDTO;
import com.hms.services.ipdmanagement.model.NurseNotesDTO;
import com.hms.services.ipdmanagement.repository.CommentsRepository;
import com.hms.services.ipdmanagement.repository.NurseNotesRepository;
import com.hms.services.ipdmanagement.response.ApiResponse;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NurseNotesService {

    private final NurseNotesRepository nurseNotesRepository;
    private final ModelMapper modelMapper;
    private final CommentsRepository commentsRepository;

    @Autowired
    public NurseNotesService(NurseNotesRepository nurseNotesRepository, ModelMapper modelMapper, CommentsRepository commentsRepository) {
        this.nurseNotesRepository = nurseNotesRepository;
        this.modelMapper = modelMapper;
        this.commentsRepository = commentsRepository;
    }

    public ApiResponse createNurseNote(NurseNotesDTO nurseNotesDto) {
        try {

            HMS_TM_NurseNotes nurseNote = modelMapper.map(nurseNotesDto, HMS_TM_NurseNotes.class);
            nurseNote.setCreatedAt(LocalDateTime.now());
            nurseNote.setDate(nurseNotesDto.getDate());
            nurseNote.setCreatedBy("system");
            nurseNote.setActive(true);
            HMS_TM_NurseNotes savedNote = nurseNotesRepository.save(nurseNote);
            if (nurseNotesDto.getComments() != null && !nurseNotesDto.getComments().isEmpty()) {
                List<HMS_TM_Comments> comments = nurseNotesDto.getComments().stream().map(commentDto -> {
                    HMS_TM_Comments comment = modelMapper.map(commentDto, HMS_TM_Comments.class);
                    comment.setNotesId(savedNote.getNotesId());
                    comment.setCreatedAt(LocalDateTime.now());
                    comment.setCreatedBy("system");
                    comment.setActive(true);
                    return comment;
                }).collect(Collectors.toList());
                commentsRepository.saveAll(comments);
            }

            return new ApiResponse("success", "", "Nurse note created successfully with comments", null, null, null, null, null);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ApiResponse deleteNurseNoteById(String notesId) {
        // Fetch the nurse note
        HMS_TM_NurseNotes nurseNote = nurseNotesRepository.findByNotesIdAndIsActiveTrue(notesId)
                .orElseThrow(() -> new CustomException("Nurse note not found", HttpStatus.NOT_FOUND));
        List<HMS_TM_Comments> comments = commentsRepository.findByNotesIdAndIsActiveTrue(notesId);
        for (HMS_TM_Comments comment : comments) {
            comment.setActive(false);
        }
        commentsRepository.saveAll(comments);
        nurseNote.setActive(false);
        nurseNotesRepository.save(nurseNote);
        return new ApiResponse("success", "", "Nurse note and associated comments deleted successfully", null, null, null, null, null);
    }

    public List<NurseNotesDTO> getAllNurseNotes(int page, int size) {
        try {
            List<HMS_TM_NurseNotes> nurseNotes = nurseNotesRepository.findAllByIsActiveTrue(PageRequest.of(page, size)).getContent();
            return nurseNotes.stream()
                    .map(note -> modelMapper.map(note, NurseNotesDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public NurseNotesDTO getNurseNoteById(String id) {
        try {
            HMS_TM_NurseNotes nurseNote = nurseNotesRepository.findByNotesIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Nurse note not found", HttpStatus.NOT_FOUND));
            // Map NurseNote to DTO
            NurseNotesDTO nurseNotesDTO = modelMapper.map(nurseNote, NurseNotesDTO.class);

            // Fetch and Map Comments
            List<HMS_TM_Comments> comments = commentsRepository.findByNotesIdAndIsActiveTrue(id);
            List<CommentsDTO> commentDTOs = comments.stream()
                    .map(comment -> modelMapper.map(comment, CommentsDTO.class))
                    .collect(Collectors.toList());

            // Set Comments in DTO
            nurseNotesDTO.setComments(commentDTOs);

            return nurseNotesDTO;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public JSONObject updateNurseNoteById(String id,String commentsId, NurseNotesDTO nurseNotesDto) {
        try {
            HMS_TM_NurseNotes existingNote = nurseNotesRepository.findByNotesIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Nurse note not found", HttpStatus.NOT_FOUND));
            existingNote.setIpdId(nurseNotesDto.getIpdId());
            existingNote.setNurseId(nurseNotesDto.getNurseId());
            existingNote.setDate(nurseNotesDto.getDate());
            existingNote.setNote(nurseNotesDto.getNote());
            existingNote.setLastModifiedAt(LocalDateTime.now());
            existingNote.setLastModifiedBy("system");
            nurseNotesRepository.save(existingNote);
            if (nurseNotesDto.getComments() != null && !nurseNotesDto.getComments().isEmpty()) {
                List<HMS_TM_Comments> updatedComments = nurseNotesDto.getComments().stream().map(commentDto -> {
                    HMS_TM_Comments comment = commentsRepository.findByCommentIdAndIsActiveTrue(commentsId)
                            .orElseThrow(() -> new CustomException("Comment not found", HttpStatus.NOT_FOUND));
                    comment.setComment(commentDto.getComment());
                    comment.setLastModifiedAt(LocalDateTime.now());
                    comment.setLastModifiedBy("system");
                    comment.setActive(true);

                    return comment;
                }).collect(Collectors.toList());
                commentsRepository.saveAll(updatedComments);
            }
            JSONObject response = new JSONObject();
            response.put("Message", "Nurse note and comments updated successfully");
            return response;

        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public List<NurseNotesDTO> getNurseNoteByIpdId(String ipdId) {
        try {
            List<HMS_TM_NurseNotes> nurseNotes = nurseNotesRepository.findByIpdIdAndIsActiveTrue(ipdId);
            return nurseNotes.stream()
                    .map(nurseNote -> {
                        NurseNotesDTO nurseNotesDTO = modelMapper.map(nurseNote, NurseNotesDTO.class);
                            List<CommentsDTO> commentDTOs = commentsRepository.findByNotesIdAndIsActiveTrue(nurseNote.getNotesId()).stream()
                                    .map(comment -> modelMapper.map(comment, CommentsDTO.class))
                                    .collect(Collectors.toList());
                            nurseNotesDTO.setComments(commentDTOs);

                        return nurseNotesDTO;
                    })
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public ApiResponse addCommentToNote(String notesId, CommentsDTO commentDto) {
        HMS_TM_NurseNotes nurseNote = nurseNotesRepository.findByNotesIdAndIsActiveTrue(notesId)
                .orElseThrow(() -> new CustomException("Nurse note not found", HttpStatus.NOT_FOUND));
        HMS_TM_Comments comment = modelMapper.map(commentDto, HMS_TM_Comments.class);
        comment.setNotesId(nurseNote.getNotesId());
        comment.setActive(true);
        comment.setComment(commentDto.getComment());
        comment.setCreatedAt(LocalDateTime.now());
        commentsRepository.save(comment);
        return new ApiResponse("success", "", "Comment added successfully", null, null, null, null, null);
    }


    public ApiResponse deleteCommentFromNote(String commentId) {
        HMS_TM_Comments comment = commentsRepository.findByCommentIdAndIsActiveTrue(commentId)
                .orElseThrow(() -> new CustomException("Comment not found", HttpStatus.NOT_FOUND));
        comment.setActive(false);
        commentsRepository.save(comment);
        return new ApiResponse("success", "", "Comment deleted successfully", null, null, null, null, null);
    }

}
