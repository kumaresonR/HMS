import React, { useEffect, useState } from 'react'
import ErrorHandler from '../../helpers/ErrorHandler';
import CertificateApiService from '../../helpers/services/certificate/certificate-api-service';
import { useLocation } from 'react-router-dom';

const GenerateCertificate = () => {
    const certificateApiService: CertificateApiService = new CertificateApiService();

    const { state } = useLocation();

    const id = state?.id;

    const data = state?.data;

    const [templateData, setTemplateData] = useState<any>({});

    const getAllCertificateTemplate = async () => {
        try {
            let result = await certificateApiService.getCertificateTemplateById(id);
            setTemplateData(result.ResponseBody);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllCertificateTemplate();
    }, []);

    return (
        <React.Fragment>
            <div
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
                    <div dangerouslySetInnerHTML={{ __html: templateData?.HeaderLeftText }} />
                    <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: templateData?.HeaderCenterText }} />
                    <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: templateData?.HeaderRightText }} />
                </div>

                {/* Body */}
                <div style={{ minHeight: "200px", padding: "20px" }} dangerouslySetInnerHTML={{ __html: templateData?.BodyText }} />

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", height: `${templateData?.FooterHeight}px`, marginTop: "20px" }}>
                    <div dangerouslySetInnerHTML={{ __html: templateData?.FooterLeftText }} />
                    <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: templateData?.FooterCenterText }} />
                    <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: templateData?.FooterRightText }} />
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
        </React.Fragment>
    )
}

export default GenerateCertificate