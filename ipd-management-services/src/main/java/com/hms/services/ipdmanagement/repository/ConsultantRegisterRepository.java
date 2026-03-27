package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_ConsultantRegister;
import com.hms.services.ipdmanagement.entity.HMS_TM_IPDAdmissions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultantRegisterRepository extends JpaRepository<HMS_TM_ConsultantRegister, String> {


    Page<HMS_TM_ConsultantRegister> findAllByIsActiveTrue(Pageable pageable);

    List<HMS_TM_ConsultantRegister> findAllByIpdIdAndIsActiveTrue(String id);

    Optional<HMS_TM_ConsultantRegister> findByConsultantIdAndIsActiveTrue(String id);
}

