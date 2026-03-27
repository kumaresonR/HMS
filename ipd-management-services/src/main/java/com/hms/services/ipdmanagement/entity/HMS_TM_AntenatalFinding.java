package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_ANTENATAL_FINDING", schema = "ipd")
public class HMS_TM_AntenatalFinding {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ANTENATAL_ID")
    private String antenatalId;

    @Column(name = "IPD_ID")
    private String ipdId;

    @Column(name = "BLEEDING")
    private String bleeding;

    @Column(name = "HEADACHE")
    private String headache;

    @Column(name = "PAIN")
    private String pain;

    @Column(name = "CONSTIPATION")
    private String constipation;

    @Column(name = "URINARY_SYMPTOMS")
    private String urinarySymptoms;

    @Column(name = "VOMITING")
    private String vomiting;

    @Column(name = "COUGH")
    private String cough;

    @Column(name = "DISCHARGE")
    private String discharge;

    @Column(name = "VAGINAL")
    private String vaginal;

    @Column(name = "HEIGHT")
    private String height;

    @Column(name = "OEDEMA")
    private String oedema;

    @Column(name = "HAEMOROIDS")
    private String haemoroids;

    @Column(name = "WEIGHT")
    private Double weight;

    @Column(name = "DATE")
    private Date date;

    @Lob
    @Column(name = "CONDITION", columnDefinition = "text")
    private String condition;

    @Lob
    @Column(name = "SPECIAL_FINDINGS_REMARK", columnDefinition = "text")
    private String specialFindingsAndRemark;

    @Lob
    @Column(name = "PELVIC_EXAMINATION", columnDefinition = "text")
    private String pelvicExamination;

    @Column(name = "SP")
    private String sp;

    @Lob
    @Column(name = "ANTENATAL_EXAMINATION", columnDefinition = "text")
    private String antenatalExamination;

    @Column(name = "UTER_SIZE")
    private String uterSize;

    @Column(name = "UTERUS_SIZE")
    private String uterusSize;

    @Column(name = "PRESENTATION_POSITION")
    private String presentationPosition;

    @Column(name = "PRESENTING_PART_TO_BRIM")
    private String presentingPartToBrim;

    @Column(name = "FOETAL_HEART")
    private String foetalHeart;

    @Column(name = "BLOOD_PRESSURE")
    private String bloodPressure;

    @Column(name = "ANTENATAL_OEDEMA")
    private String antenatalOedema;

    @Column(name = "URINE_SUGAR")
    private String urineSugar;

    @Column(name = "URINE_ALBUMEN")
    private String urineAlbumen;

    @Column(name = "ANTENATAL_WEIGHT")
    private Double antenatalWeight;

    @Lob
    @Column(name = "REMARK", columnDefinition = "text")
    private String remark;

    @Column(name = "NEXT_VISIT")
    private Date nextVisit;

    @Lob
    @Column(name = "PREVIOUS_ANTENATAL_DETAILS", columnDefinition = "text")
    private String previousAntenatalDetails;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;



}

