import React, { useEffect, useRef, useState } from 'react'
import CertificateApiService from '../../helpers/services/certificate/certificate-api-service';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ErrorHandler from '../../helpers/ErrorHandler';
import { Button } from 'reactstrap';

const DownloadCertificateTemplate = (props: any) => {
    const certificateApiService: CertificateApiService = new CertificateApiService();

    const { state } = useLocation();

    const id = state?.id;

    const data = state?.data;

    const [staffData, setStaffData] = useState<any>('');

    const [templateData, setTemplateData] = useState<any>({});

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const getAllCertificateTemplate = async () => {
        try {
            let result = await certificateApiService.getCertificateTemplateById(id);
            setTemplateData(result.ResponseBody);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }
    const patientData = {
        patient_name: data?.patient?.firstName,
        patient_id: data?.patient?.patientId,
        dob: data?.patient?.dateOfBirth,
        age: data?.patient?.age,
        gender: data?.patient?.gender,
        email: data?.patient?.email,
        phone: data?.patient?.contactNumber,
        consultant_doctor: data?.doctor?.firstName,
        opd_ipd_no: data?.ipdId || data?.opdId,
        address: data?.patient?.address,
        guardian_name: data?.patient?.emergencyContacts[0]?.firstName,
    };

    // const getEmployeeById = async () => {
    //     try {
    //         let result = await employeeApiService.getEmployeeById(state?.data?.employeeId);
    //         setStaffData(result);
    //     } catch (error: any) {
    //         return ErrorHandler(error)
    //     }
    // }
    const replacePlaceholders = (html: any, data: any) => {
        if (!html) return "";
        return html
            .replace(/\[patient_name\]/g, data.patient_name || "")
            .replace(/\[patient_id\]/g, data.patient_id || "")
            .replace(/\[dob\]/g, data.dob || "")
            .replace(/\[age\]/g, data.age || "")
            .replace(/\[gender\]/g, data.gender || "")
            .replace(/\[email\]/g, data.email || "")
            .replace(/\[phone\]/g, data.phone || "")
            .replace(/\[address\]/g, data.address || "")
            .replace(/\[guardian_name\]/g, data.guardian_name || "")
            .replace(/\[consultant_doctor\]/g, data.consultant_doctor || "")
            .replace(/\[opd_ipd_no\]/g, data.opd_ipd_no || "");
    };


    useEffect(() => {
        getAllCertificateTemplate();
        // getEmployeeById();
    }, []);

    return (
        <React.Fragment>
            <div className='text-center'>
                <div ref={contentRef} className='mx-auto'
                    style={{
                        width: `${templateData?.ContentWidth}px`,
                        padding: "20px",
                        border: "2px solid black",
                        position: "relative",
                        backgroundImage: templateData?.BackgroundImage ? `url("data:image/png;base64,${templateData?.BackgroundImage}")` : "none",
                        backgroundSize: "cover",
                    }}
                >
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", height: `${templateData?.HeaderHeight}px` }}>
                        <div dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateData?.HeaderLeftText, patientData) }} />
                        <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateData?.HeaderCenterText, patientData) }} />
                        <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateData?.HeaderRightText, patientData) }} />
                    </div>

                    {/* Body */}
                    <div style={{ minHeight: "200px", padding: "20px" }} dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateData?.BodyText, patientData) }} />

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", height: `${templateData?.FooterHeight}px`, marginTop: "20px" }}>
                        <div dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateData?.FooterLeftText, patientData) }} />
                        <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateData?.FooterCenterText, patientData) }} />
                        <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateData?.FooterRightText, patientData) }} />
                    </div>

                    {/* Patient Image */}
                    {templateData?.IsActivePatientImage === "yes" && templateData?.PatientImage && (
                        <img
                            src={templateData?.PatientImage}
                            alt="Patient"
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                height: `${templateData?.PhotoHeight}px`,
                            }}
                        />
                    )}
                </div>
            </div>

            <div className='text-center py-3'>
                <Button onClick={() => reactToPrintFn()} >Print</Button>
            </div>
        </React.Fragment>
    )
}

export default DownloadCertificateTemplate