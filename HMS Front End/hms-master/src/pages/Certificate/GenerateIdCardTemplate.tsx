import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import ErrorHandler from '../../helpers/ErrorHandler';
import CertificateApiService from '../../helpers/services/certificate/certificate-api-service';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import logo from "../../assets/images/Logo f (1).png";

const GenerateIdCardTemplate = () => {
    const certificateApiService: CertificateApiService = new CertificateApiService();

    const { state } = useLocation();

    const id = state?.id;

    const data = state?.data;

    const [templateData, setTemplateData] = useState<any>({});

    const printRef = useRef<any>();

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    const printFront:any = useReactToPrint({ contentRef: frontRef });
    const printBack:any = useReactToPrint({ contentRef: backRef });

    const getAllCertificateTemplate = async () => {
        try {
            let result = await certificateApiService.getPatientIdTemplateById(id);
            setTemplateData(result.ResponseBody);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const handlePrint = () => {

        const backgroundImage = templateData?.BackgroundImage
            ? `background-image: url('data:image/png;base64,${templateData.BackgroundImage}');`
            : "";
        const printContent: any = printRef.current.innerHTML;
        const printWindow: any = window.open("", "_blank");

        printWindow.document.write(`
          <html>
            <head>
              <title>Print ID Card</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .id-card { 
                width: 100mm; 
                border: 2px solid gray; 
                border-radius: 10px; 
                box-shadow: 2px 2px 10px rgba(0,0,0,0.2); 
                overflow: hidden;
                position: relative;
                background-size: cover;
                background-position: center;
                ${backgroundImage}
              }
                .text-center { text-align: center; }
                .mb-0 { margin-bottom: 0; }
                .text-sm { font-size: 12px; }
                .text-xs { font-size: 10px; color: gray; }
              </style>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body onload="window.print(); window.close();">
              <div class="id-card">${printContent}</div>
            </body>
          </html>
        `);

        printWindow.document.close();
    };

    const cardStyle = {
        width: "85.6mm",
        height: "53.98mm",
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    useEffect(() => {
        getAllCertificateTemplate();
    }, []);

    return (
        <React.Fragment>
            <h4 className="text-center my-5">Patient ID Card</h4>
            <div className="d-flex justify-content-center  items-center gap-4">
                <div
                    ref={frontRef}
                    className="border rounded-lg shadow bg-white overflow-hidden relative"
                    style={{
                        ...cardStyle,
                        backgroundImage: `url(data:image/png;base64,${templateData?.BackgroundImage})`,
                    }}
                >
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <div>
                                <img src={`data:image/png;base64,${templateData?.Logo}`} alt="" height="50px" />
                            </div>
                        </div>
                    </div>

                    <div className="p-2 text-xs space-y-1">
                        {templateData?.PatientName && (
                            <p>
                                <strong>Name:</strong> {data.firstName}{" "}
                                {data.lastName || ""}
                            </p>
                        )}
                        {templateData?.PatientId && (
                            <p>
                                <strong>ID:</strong> {data.patientId || ""}
                            </p>
                        )}
                        {templateData?.BloodGroup && (
                            <p>
                                <strong>Blood Group:</strong> {data.bloodType}
                            </p>
                        )}
                        {templateData?.Phone && (
                            <p>
                                <strong>Phone:</strong> {data.contactNumber}
                            </p>
                        )}
                    </div>
                </div>

                <br />
                <br />

                <div
                    ref={backRef}
                    className="border rounded-lg shadow bg-white overflow-hidden relative"
                    style={{
                        ...cardStyle,
                        backgroundImage: `url(data:image/png;base64,${templateData?.BackgroundImage})`,
                    }}
                >
                    <div
                        className="text-center text-white py-1 px-2"
                        style={{ backgroundColor: templateData?.HeaderColor }}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: templateData?.HospitalName,
                            }}
                            className="text-sm font-bold"
                        />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: templateData?.HospitalAddress,
                            }}
                            className="text-xs text-gray-200"
                        />
                    </div>
                    <div className="p-3 text-xs  ">
                        {templateData?.PatientAddress && (
                            <p>
                                <strong>Address:</strong> {data.address}
                            </p>
                        )}

                        {templateData?.DateOfBirth && (
                            <p className="mb-1">
                                <strong>DOB:</strong> {data.dateOfBirth}
                            </p>
                        )}

                        <div className="row px-0">
                            {templateData?.Barcode && (
                                <div className="col-6 ps-1">
                                    <div className="flex justify-center">
                                        <Barcode
                                            value={data.patientId || "PID-01"}
                                            height={20}
                                            width={1}
                                            displayValue={false}
                                        />
                                    </div>
                                </div>
                            )}

                            {templateData?.Signature && (
                                <div className="col-6 ps-0">
                                    <div className="  right-2 text-center">
                                        <img
                                            src={`data:image/png;base64,${templateData?.Signature}`}
                                            alt="Signature"
                                            width={30}
                                        />
                                        <p className="text-[10px]">Signature</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center  gap-2 mt-2">
                <button
                    className="btn btn-primary btn-sm me-3"
                    onClick={printFront}
                >
                    Print Front
                </button>
                <button className="btn btn-secondary btn-sm" onClick={printBack}>
                    Print Back
                </button>
            </div>
            {/* <div ref={contentRef}
                className="w-[340px] h-[210px] border-2 border-gray-500 rounded-lg shadow-lg bg-white relative overflow-hidden flex flex-col"
                style={{
                    backgroundImage: `url(data:image/png;base64,${templateData?.BackgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100mm",
                    height: "70mm"
                }}
            >
                <div
                    className="text-white text-center py-1"
                    style={{ backgroundColor: templateData?.HeaderColor }}
                >
                    <h3
                        className="text-base font-bold"
                        dangerouslySetInnerHTML={{ __html: templateData?.PatientIdCardTitle }}
                    ></h3>
                </div>

                <div className="px-3 ">
                    <div className="text-center">
                        <div
                            dangerouslySetInnerHTML={{ __html: templateData?.HospitalName }}
                            className="text-sm font-semibold hospital-name"
                        ></div>
                        <div
                            dangerouslySetInnerHTML={{ __html: templateData?.HospitalAddress }}
                            className="text-xs text-gray-600 hospital-name"
                        ></div>
                    </div>

                    <div className="mt-1 text-xs grid grid-cols-2 gap-1">
                        {templateData?.PatientName && <p className='mb-0'><strong>Name:</strong> {data.firstName} {data.lastName || "John Doe"}</p>}
                        {templateData?.PatientId && <p className='mb-0'><strong>ID:</strong> {data.patientId || "PID-01"}</p>}
                        {templateData?.PatientAddress && <p className='mb-0'><strong>Address:</strong> {data.address}</p>}
                        {templateData?.Phone && <p className='mb-0'><strong>Phone:</strong> {data.contactNumber}</p>}
                        {templateData?.DateOfBirth && <p className='mb-0'><strong>DOB:</strong> {data.dateOfBirth}</p>}
                        {templateData?.BloodGroup && <p className='mb-0'><strong>Blood Group:</strong> {data.bloodType}</p>}
                    </div>

                    <div className="row">
                        <div className="col">
                            {templateData?.Barcode && (
                                <div className="mt-1 flex justify-center">
                                    <Barcode value={data.patientId || "PID-01"} height={20} />
                                </div>
                            )}
                        </div>
                        <div className="col">
                            {templateData?.Signature && (
                                <div className="absolute bottom-1 right-3 text-center">
                                    <img
                                        src={`data:image/png;base64,${templateData?.Signature}`}
                                        alt="Signature"
                                        width={29}
                                    />
                                    <p className="mb-0">Signature</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={() => reactToPrintFn()} >Print</button> */}
        </React.Fragment>
    )
}

export default GenerateIdCardTemplate