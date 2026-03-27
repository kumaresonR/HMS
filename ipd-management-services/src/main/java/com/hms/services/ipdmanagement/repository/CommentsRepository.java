package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_Comments;
import com.hms.services.ipdmanagement.entity.HMS_TM_NurseNotes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentsRepository extends JpaRepository<HMS_TM_Comments, String> {


    Optional<HMS_TM_Comments> findByCommentIdAndIsActiveTrue(String commentId);

//    List<HMS_TM_Comments> findByNurseNoteNotesIdAndIsActiveTrue(String notesId);

    List<HMS_TM_Comments> findByNotesIdAndIsActiveTrue(String notesId);
}

