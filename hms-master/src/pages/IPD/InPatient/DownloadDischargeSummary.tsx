import React, { useEffect, useRef, useState } from "react";
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service";
import { Col, Container, Row } from "reactstrap";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./DischargeCard.css";
import logo from "../../../assets/images/Logo_medic.jpg";

const DownloadDischargeSummary = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const [data, setData] = useState<any>();

    const getAllIpd = async () => {
        try {
            let url = props.data;
            let data = await iPDApiService.getIPDById(url);
            setData(data || {});
        } catch (error) {
            console.log(error);
            setData({});
        }
    };
    useEffect(() => {
        getAllIpd();
    }, []);

    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        const input = cardRef.current;
        if (!input) {
            console.error("Could not find the card element to download.");
            return;
        }

        try {
            const fullCanvas = await html2canvas(input, {
                useCORS: true,
                // @ts-ignore
                scale: 1.5,
                scrollY: -window.scrollY,
            });

            const fullWidth = fullCanvas.width;
            const fullHeight = fullCanvas.height;

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;

            const scale = (pdfWidth - margin * 2) / fullWidth;
            const pageHeightPx = (pdfHeight - margin * 2) / scale;

            const totalPages = Math.ceil(fullHeight / pageHeightPx);

            for (let page = 0; page < totalPages; page++) {
                const pageCanvas = document.createElement("canvas");
                const pageContext = pageCanvas.getContext("2d");

                const pageY = page * pageHeightPx;
                const pageHeightActual = Math.min(pageHeightPx, fullHeight - pageY);

                pageCanvas.width = fullWidth;
                pageCanvas.height = pageHeightActual;
                pageContext?.drawImage(
                    fullCanvas,
                    0,
                    pageY,
                    fullWidth,
                    pageHeightActual,
                    0,
                    0,
                    fullWidth,
                    pageHeightActual
                );

                const imgData = pageCanvas.toDataURL("image/png");

                if (page > 0) pdf.addPage();

                pdf.addImage(
                    imgData,
                    "PNG",
                    margin,
                    margin,
                    pdfWidth - margin * 2,
                    pageHeightActual * scale
                );

                const pageLabel = `Page ${page + 1}`;
                const labelWidth = pdf.getTextWidth(pageLabel);
                pdf.setFontSize(5);
                pdf.text(pageLabel, (pdfWidth - labelWidth) / 2, pdfHeight - 5);
            }

            pdf.save("hospital-discharge-card.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const formatDate = (
        dateString: string | null | undefined,
        format = "DD/MM/YYYY, hh:mm A"
    ) => {
        if (!dateString) return "-";
        return moment(dateString).isValid()
            ? moment(dateString).format(format)
            : dateString;
    };

    const formatTime = (
        timeString: string | null | undefined,
        format = "hh:mm A"
    ) => {
        if (!timeString) return "-";
        return moment(timeString, "HH:mm:ss").isValid()
            ? moment(timeString, "HH:mm:ss").format(format)
            : timeString;
    };

    const formatBoolean = (value: boolean | null | undefined) => {
        return value === true ? "Yes" : value === false ? "No" : "-";
    };
    return (
        <Container>
            <div className="discharge-card-container ">
                <div className="discharge-card" ref={cardRef}>
                    <header className="card-headermain">
                        <div className="logo">
                            <img src={logo} alt="Logo" className="hospital-logo" />
                        </div>
                        <div className="hospital-info">
                            <h1>I-MEDIC-X</h1>
                            <p> Surgery Clinic</p>
                            <p> 45 Wellness Blvd, Lakeview, NY 12000</p>
                            <p>Phone: (212) 555-4321 | e-mail: info@riversidemed.com</p>
                        </div>
                    </header>

                    <h2 className="discharge-title">HOSPITAL DISCHARGE CARD</h2>

                    <section className="card-section patient-info">
                        {data?.patient ? (
                            <>
                                <section>
                                    <h3>Patient Information</h3>
                                    <div className="info-grid">
                                        <div>
                                            <span className="label">Patient ID:</span>{" "}
                                            {data.patient.patientId || "-"}
                                        </div>
                                        <div>
                                            <span className="label">First Name:</span>{" "}
                                            {data.patient.firstName || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Last Name:</span>{" "}
                                            {data.patient.lastName || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Date of Birth:</span>{" "}
                                            {formatDate(data.patient.dateOfBirth, "YYYY-MM-DD")}
                                        </div>
                                        <div>
                                            <span className="label">Gender:</span>{" "}
                                            {data.patient.gender || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Age:</span>{" "}
                                            {data.patient.age || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Contact Number:</span>{" "}
                                            {data.patient.contactNumber || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Email:</span>{" "}
                                            {data.patient.email || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Address:</span>{" "}
                                            {data.patient.address || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Pin Code:</span>{" "}
                                            {data.patient.pinCode || "-"}
                                        </div>
                                        <div>
                                            <span className="label">State:</span>{" "}
                                            {data.patient.state || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Nationality:</span>{" "}
                                            {data.patient.nationality || "-"}
                                        </div>
                                        <div>
                                            <span className="label">ID Proof:</span>{" "}
                                            {data.patient.idProof || "-"}
                                        </div>
                                        <div>
                                            <span className="label">ID Number:</span>{" "}
                                            {data.patient.idNumber || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Blood Type:</span>{" "}
                                            {data.patient.bloodType || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Allergies:</span>{" "}
                                            {data.patient.allergies || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Old Prescription:</span>{" "}
                                            {data.patient.oldPrescription || "-"}
                                        </div>
                                    </div>
                                </section>
                            </>
                        ) : (
                            <></>
                        )}

                        {data?.admissions ? (
                            <>
                                <section>
                                    <h3>Admission Details</h3>
                                    <div className="info-grid">
                                        {/* <div>
                                            <span className="label">Case ID:</span>{" "}
                                            {data.admissions.caseId ?? "-"}
                                        </div> */}
                                        <div>
                                            <span className="label">Admission Date:</span>{" "}
                                            {formatDate(data.admissions.admissionDate)}
                                        </div>

                                        <div className="grid-col-span-2">
                                            <span className="label">Reason For Admission:</span>{" "}
                                            {data.admissions.reasonForAdmission || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Symptoms Type:</span>{" "}
                                            {data.admissions.symptomsType || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Symptoms Title:</span>{" "}
                                            {data.admissions.symptomsTitle || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Symptoms Description:</span>{" "}
                                            {data.admissions.symptomsDescription || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Note:</span>{" "}
                                            {data.admissions.note || "-"}
                                        </div>

                                        <div className="grid-col-span-2">
                                            <span className="label">Previous Medical Issue:</span>{" "}
                                            {data.admissions.previousMedicalIssue || "-"}
                                        </div>
                                        <div>
                                            <span className="label">Casualty:</span>{" "}
                                            {formatBoolean(data.admissions.casualty)}
                                        </div>
                                        <div>
                                            <span className="label">Old Patient:</span>{" "}
                                            {formatBoolean(data.admissions.oldPatient)}
                                        </div>

                                        <div>
                                            <span className="label">Antenatal:</span>{" "}
                                            {formatBoolean(data.admissions.antenatal)}
                                        </div>
                                        <div>
                                            <span className="label">Discharge Date:</span>{" "}
                                            {formatDate(data.admissions.dischargeDate)}
                                        </div>
                                        <div>
                                            <span className="label">Discharge Status:</span>{" "}
                                            {data.admissions.dischargeStatus || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Discharge Summary:</span>{" "}
                                            {data.admissions.dischargeSummary || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Operation Summary:</span>{" "}
                                            {data.admissions.operation || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Diagnosis Summary:</span>{" "}
                                            {data.admissions.diagnosis || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Investigation Summary:</span>{" "}
                                            {data.admissions.investigation || "-"}
                                        </div>
                                        <div className="grid-col-span-2">
                                            <span className="label">Treatment Home Advice:</span>{" "}
                                            {data.admissions.treatmentHome || "-"}
                                        </div>

                                        <div>
                                            <span className="label">Guardian Name:</span>{" "}
                                            {data.admissions.guardianName || "-"}
                                        </div>

                                        <div className="grid-col-span-2">
                                            <span className="label">Known Allergies:</span>{" "}
                                            {data.admissions.knownAllergies || "-"}
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    {data.admissions.doctor ? (
                                        <>
                                            <h3>Admitting Doctor Details:</h3>
                                            <div className="info-grid sub-section">
                                                <div>
                                                    <span className="label">Staff ID:</span>{" "}
                                                    {data.admissions.doctor.staffId || "-"}
                                                </div>
                                                <div>
                                                    <span className="label"> Name:</span>{" "}
                                                    {data.admissions.doctor.firstName || ""}{" "}
                                                    {data.admissions.doctor.lastName || ""}
                                                </div>

                                                <div>
                                                    <span className="label">Email:</span>{" "}
                                                    {data.admissions.doctor.email || "-"}
                                                </div>
                                                <div>
                                                    <span className="label">Phone:</span>{" "}
                                                    {data.admissions.doctor.phone || "-"}
                                                </div>
                                                <div>
                                                    <span className="label">Specialist:</span>{" "}
                                                    {data.admissions.doctor.specialist || "-"}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <> </>
                                    )}
                                </section>
                            </>
                        ) : (
                            <> </>
                        )}

                        {data?.prescriptions?.length > 0 ? (
                            data.prescriptions.map((pres: any, index: number) => (
                                <section>
                                    <div
                                        key={pres.prescriptionId || index}
                                        className="prescription-item"
                                    >
                                        <div className="info-grid">
                                            <div>
                                                <span className="label">Date Prescribed:</span>{" "}
                                                {formatDate(pres.datePrescribed, "YYYY-MM-DD")}
                                            </div>

                                            <div>
                                                <span className="label">Finding Category:</span>{" "}
                                                {pres.findingCategory || "-"}
                                            </div>
                                            <div className="grid-col-span-2">
                                                <span className="label">Finding:</span>{" "}
                                                {pres.finding || "-"}
                                            </div>
                                            <div className="grid-col-span-2">
                                                <span className="label">Finding Description:</span>{" "}
                                                {pres.findingDescription || "-"}
                                            </div>

                                            <div>
                                                <span className="label">Valid Until:</span>{" "}
                                                {formatDate(pres.validUntil, "YYYY-MM-DD")}
                                            </div>

                                            {pres.doctor ? (
                                                <div className="info-grid sub-section">
                                                    <div>
                                                        <span className="label">Prescribed by :</span>{" "}
                                                        {pres.doctor.firstName || ""}{" "}
                                                        {pres.doctor.lastName || ""}
                                                    </div>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>

                                        {pres.prescriptionDetails?.length > 0 && (
                                            <section>
                                                <h3>Medication Details:</h3>
                                                {pres.prescriptionDetails.map((detail: any, dIndex: number) => (
                                                    <div
                                                        key={detail.prescriptionDetailId || dIndex}
                                                        className="info-grid sub-section"
                                                    >
                                                        <div>
                                                            <span className="label">Category:</span> {detail.medicineCategory || "-"}
                                                        </div>
                                                        <div>
                                                            <span className="label">Name:</span> {detail.medicineName || "-"}
                                                        </div>
                                                        <div>
                                                            <span className="label">Dosage:</span> {detail.dosage || "-"}
                                                        </div>
                                                        <div>
                                                            <span className="label">Interval:</span> {detail.dosageInterval || "-"}
                                                        </div>
                                                        <div>
                                                            <span className="label">Duration:</span> {detail.dosageDuration || "-"}
                                                        </div>
                                                        <div className="grid-col-span-2">
                                                            <span className="label">Instruction:</span> {detail.instruction || "-"}
                                                        </div>
                                                    </div>
                                                ))}
                                            </section>
                                        )}

                                        {pres.pathologyTestDetails?.length > 0 ? (
                                            pres.pathologyTestDetails.map(
                                                (test: any, pIndex: number) => (
                                                    <section>
                                                        <>
                                                            <h3>Pathology Tests:</h3>
                                                            <div
                                                                key={test.pathologyTestId || pIndex}
                                                                className="info-grid sub-section"
                                                            >
                                                                <div>
                                                                    <span className="label">Test Name:</span>{" "}
                                                                    {test.testName || "-"}
                                                                </div>

                                                                <div>
                                                                    <span className="label">Report Days:</span>{" "}
                                                                    {test.reportDays ?? "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Report Date:</span>{" "}
                                                                    {formatDate(test.reportDate, "YYYY-MM-DD")}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Tax:</span>{" "}
                                                                    {test.tax ?? "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Amount:</span>{" "}
                                                                    {test.amount ?? "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">
                                                                        Sample Collected:
                                                                    </span>{" "}
                                                                    {test.sampleCollected || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Approved By:</span>{" "}
                                                                    {test.approvedBy || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Collected Date:</span>{" "}
                                                                    {formatDate(test.collectedDate)}
                                                                </div>
                                                                <div>
                                                                    <span className="label">
                                                                        Pathology Center:
                                                                    </span>{" "}
                                                                    {test.pathologyCenter || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Approved Date:</span>{" "}
                                                                    {formatDate(test.approvedDate)}
                                                                </div>

                                                                <div>
                                                                    <span className="label">Result:</span>{" "}
                                                                    {test.result || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Bill ID:</span>{" "}
                                                                    {test.billId || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">
                                                                        Test Parameters:
                                                                    </span>{" "}
                                                                    {test.testParameters?.length > 0
                                                                        ? JSON.stringify(test.testParameters)
                                                                        : "Empty"}
                                                                </div>
                                                            </div>
                                                        </>
                                                    </section>
                                                )
                                            )
                                        ) : (
                                            <></>
                                        )}

                                        {pres.radiologyTestDetails?.length > 0 ? (
                                            pres.radiologyTestDetails.map(
                                                (test: any, rIndex: number) => (
                                                    <section>
                                                        <>
                                                            <h3>Radiology Tests:</h3>
                                                            <div
                                                                key={test.radiologyTestId || rIndex}
                                                                className="info-grid sub-section"
                                                            >
                                                                <div>
                                                                    <span className="label">Test Name:</span>{" "}
                                                                    {test.testName || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Report Days:</span>{" "}
                                                                    {test.reportDays ?? "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Report Date:</span>{" "}
                                                                    {formatDate(test.reportDate, "YYYY-MM-DD")}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Tax:</span>{" "}
                                                                    {test.tax ?? "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Amount:</span>{" "}
                                                                    {test.amount ?? "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">
                                                                        Sample Collected:
                                                                    </span>{" "}
                                                                    {test.sampleCollected || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Approved By:</span>{" "}
                                                                    {test.approvedBy || "-"}
                                                                </div>

                                                                <div>
                                                                    <span className="label">
                                                                        Radiology Center:
                                                                    </span>{" "}
                                                                    {test.radiologyCenter || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Approved Date:</span>{" "}
                                                                    {formatDate(test.approvedDate)}
                                                                </div>

                                                                <div>
                                                                    <span className="label">Result:</span>{" "}
                                                                    {test.result || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Bill ID:</span>{" "}
                                                                    {test.billId || "-"}
                                                                </div>
                                                                <div>
                                                                    <span className="label">Test Parameters:</span>{" "}
                                                                    {test?.testParameters?.length > 0 ? (
                                                                        test.testParameters.map((param:any, index:any) => (
                                                                            <div key={index}>
                                                                                <strong>Parameter:</strong> {param.parameterName},
                                                                                <strong> Referance Range:</strong> {param.normalRange},
                                                                                <strong> Report Value:</strong> {param.reportValue},
                                                                                <strong> Unit:</strong> {param.unit}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        "Empty"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    </section>
                                                )
                                            )
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <> </>
                        )}
                        <br />
                        <br />

                        {data?.medication?.length > 0 && (
                            <section>
                                <h3>Medication Administered</h3>
                                {data.medication.map((med: any, index: number) => (
                                    <div
                                        key={med.medicationId || index}
                                        className="medication-item"
                                    >
                                        <div className="info-grid">
                                            <div>
                                                <span className="label">Medicine Name:</span> {med.medicineName || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Category:</span> {med.medicineCategory || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Date:</span> {formatDate(med.date, "YYYY-MM-DD")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {data?.operation?.length > 0 ? (
                            data.operation.map((op: any, index: number) => (
                                <>
                                    <h3>Operations</h3>
                                    <div key={op.operationId || index} className="operation-item">
                                        <div className="info-grid">
                                            <div>
                                                <span className="label">IPD ID Ref:</span>{" "}
                                                {op.ipdId || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Operation Name:</span>{" "}
                                                {op.operationName || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Operation Category:</span>{" "}
                                                {op.operationCategory || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Operation Date:</span>{" "}
                                                {formatDate(op.operationDate)}
                                            </div>
                                            <div>
                                                <span className="label">Assistant Consultant 1:</span>{" "}
                                                {op.assistantConsultant1 || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Assistant Consultant 2:</span>{" "}
                                                {op.assistantConsultant2 || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Anesthetist:</span>{" "}
                                                {op.anesthetist || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Anesthesia Type:</span>{" "}
                                                {op.anesthesiaType || "-"}
                                            </div>
                                            <div>
                                                <span className="label">OT Technician:</span>{" "}
                                                {op.otTechnician || "-"}
                                            </div>
                                            <div>
                                                <span className="label">OT Assistant:</span>{" "}
                                                {op.otAssistant || "-"}
                                            </div>
                                            <div className="grid-col-span-2">
                                                <span className="label">Remark:</span>{" "}
                                                {op.remark || "-"}
                                            </div>
                                            <div className="grid-col-span-2">
                                                <span className="label">Result:</span>{" "}
                                                {op.result || "-"}
                                            </div>

                                            <div>
                                                <span className="label">Custom Field:</span>{" "}
                                                {op.customField || "-"}
                                            </div>
                                            <div>
                                                <span className="label">Active:</span>{" "}
                                                {formatBoolean(op.isActive)}
                                            </div>
                                        </div>

                                        {op.doctor ? (
                                            <>
                                                <h3>Operating Doctor Details:</h3>
                                                <div className="info-grid sub-section">
                                                    <div>
                                                        <span className="label">Name:</span>{" "}
                                                        {op.doctor.firstName} {op.doctor.lastName}
                                                    </div>
                                                    <div>
                                                        <span className="label">Specialist:</span>{" "}
                                                        {op.doctor.specialist || "-"}
                                                    </div>
                                                    <div>
                                                        <span className="label">Designation:</span>{" "}
                                                        {op.doctor.designation || "-"}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </>
                            ))
                        ) : (
                            <></>
                        )}

                        {data?.previousObstetricHistory?.length > 0 ? (
                            <>
                                <h3>Previous Obstetric History</h3>
                                <p>
                                    Previous obstetric history data exists but display structure
                                    needs definition.
                                </p>
                            </>
                        ) : (
                            <></>
                        )}

                        {data?.postnatalHistory?.length > 0 && (
                            <>
                                <h3>Postnatal History</h3>
                                {data.postnatalHistory.map((history: any, index: number) => (
                                    <div
                                        key={history.postnatalId || index}
                                        className="postnatal-item"
                                    >
                                        <div className="info-grid">
                                            <div>
                                                <span className="label">IPD ID Ref:</span>{" "}
                                                {history.ipdId || "-"}
                                            </div>

                                            <div>
                                                <span className="label">Delivery Time:</span>{" "}
                                                {formatTime(history.deliveryTime)}
                                            </div>
                                            <div className="grid-col-span-2">
                                                <span className="label">Routine Question:</span>{" "}
                                                {history.routineQuestion || "-"}
                                            </div>
                                            <div className="grid-col-span-2">
                                                <span className="label">General Remark:</span>{" "}
                                                {history.generalRemark || "-"}
                                            </div>

                                            <div>
                                                <span className="label">Active:</span>{" "}
                                                {formatBoolean(history.active)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}


                        {data?.antenatalFindings?.length > 0 ? (
                            <>
                                <h3>Antenatal Findings</h3>
                                <p>
                                    Antenatal findings data exists but display structure needs
                                    definition.
                                </p>
                            </>
                        ) : (
                            <></>
                        )}
                    </section>
                </div>
            </div>
            <div className="row">
                <div className="col-12 d-flex justify-content-end">
                    <button
                        onClick={handleDownloadPdf}
                        className="btn btn-sm btn-primary"
                        style={{ margin: "20px", padding: "10px 15px" }}
                    >
                        Download
                    </button>
                </div>
            </div>
        </Container>
    );
};

export default DownloadDischargeSummary;
