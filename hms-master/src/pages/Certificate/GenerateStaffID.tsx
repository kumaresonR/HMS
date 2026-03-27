import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import ErrorHandler from '../../helpers/ErrorHandler';
import CertificateApiService from '../../helpers/services/certificate/certificate-api-service';
import Barcode from 'react-barcode';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import { useReactToPrint } from 'react-to-print';
import logo from "../../assets/images/Logo f (1).png";
import user from "../../assets/images/Doctor_Img.png";

const GenerateStaffID = () => {
  const certificateApiService: CertificateApiService = new CertificateApiService();
  const employeeApiService: EmployeeApiService = new EmployeeApiService();

  const { state } = useLocation();

  const id = state?.id;

  const data = state?.data;

  const [staffData, setStaffData] = useState<any>('');

  const [templateData, setTemplateData] = useState<any>({});
  const [isFront, setIsFront] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // const printRef = useRef<any>(); // Reference for the print area

  // const handlePrint = () => {

  //   const backgroundImage = templateData?.BackgroundImage
  //     ? `background-image: url('data:image/png;base64,${templateData.BackgroundImage}');`
  //     : "";
  //   const printContent: any = printRef.current.innerHTML;
  //   const printWindow: any = window.open("", "_blank");

  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Print ID Card</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
  //           .id-card { 
  //           width: 100mm; 
  //           border: 2px solid gray; 
  //           border-radius: 10px; 
  //           box-shadow: 2px 2px 10px rgba(0,0,0,0.2); 
  //           overflow: hidden;
  //           position: relative;
  //           background-size: cover;
  //           background-position: center;
  //           ${backgroundImage}
  //         }
  //           .text-center { text-align: center; }
  //           .mb-0 { margin-bottom: 0; }
  //           .text-sm { font-size: 12px; }
  //           .text-xs { font-size: 10px; color: gray; }
  //         </style>
  //           <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  //       </head>
  //       <body onload="window.print(); window.close();">
  //         <div class="id-card">${printContent}</div>
  //       </body>
  //     </html>
  //   `);

  //   printWindow.document.close();
  // };

  const getAllCertificateTemplate = async () => {
    try {
      let result = await certificateApiService.geStaffIdTemplateById(id);
      setTemplateData(result.ResponseBody);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  const getEmployeeById = async () => {
    try {
      let result = await employeeApiService.getEmployeeById(state?.data?.employeeId);
      setStaffData(result);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }
  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      width: "340px",
      height: "500px",
      perspective: "1000px",
      margin: "0 auto",
    },
    card: {
      width: "100%",
      height: "100%",
      position: "relative",
      transition: "transform 0.6s",
      transformStyle: "preserve-3d",
      transform: isFront ? "rotateY(0deg)" : "rotateY(180deg)",
    },
    front: {
      width: "340px",
      height: "500px",
      padding: "30px",
      border: "2px solid #d1d5db",
      borderRadius: "16px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
      backgroundColor: "#ffffff",
      position: "absolute",
      top: 0,
      left: 0,
      backfaceVisibility: "hidden",
      display: "flex",
      flexDirection: "column",
      backgroundImage: templateData?.BackgroundImage
        ? `url(data:image/png;base64,${templateData?.BackgroundImage})`
        : "linear-gradient(135deg, #f9fafb 25%, #ffffff 25%, #ffffff 50%, #f9fafb 50%, #f9fafb 75%, #ffffff 75%)",
      backgroundSize: templateData?.BackgroundImage ? "cover" : "40px 40px",
      backgroundPosition: "center",
      overflow: "hidden",
    },
    back: {
      width: "340px",
      height: "500px",
      border: "2px solid #d1d5db",
      borderRadius: "16px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
      backgroundColor: "#ffffff",
      position: "absolute",
      top: 0,
      left: 0,
      padding: "30px",
      backfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      display: "flex",
      flexDirection: "column",
      backgroundImage: templateData?.BackgroundImage
        ? `url(data:image/png;base64,${templateData?.BackgroundImage})`
        : "linear-gradient(135deg, #f9fafb 25%, #ffffff 25%, #ffffff 50%, #f9fafb 50%, #f9fafb 75%, #ffffff 75%)",
      backgroundSize: templateData?.BackgroundImage ? "cover" : "40px 40px",
      backgroundPosition: "center",
      overflow: "hidden",
    },
    header: {
      backgroundColor:  "#1e40af",
      // backgroundColor: props.data.HeaderColor || "#1e40af",
      color: "#ffffff",
      textAlign: "center",
      padding: "12px",
      borderTopLeftRadius: "14px",
      borderTopRightRadius: "14px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    headerTitle: {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: "1.2",
      color: "white",
      textTransform: "uppercase",
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      margin: "0px 30px",
    },
    hospitalInfo: {
      textAlign: "center",
      marginBottom: "12px",
    },
    hospitalName: {
      fontSize: "16px",
      fontWeight: 700,
      color: "#111827",
      textTransform: "capitalize",
    },
    hospitalAddress: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "6px",
      lineHeight: "1.4",
    },
    details: {
      marginTop: "8px",
      fontSize: "13px",
      lineHeight: "1.5",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#1f2937",
      textAlign: "center",
    },
    staffName: {
      margin: "0px",
      fontWeight: "bold",
      fontSize: "20px",
      color: "#111827",
      textAlign: "center",
    },

    detailItem: {
      margin: 0,
      fontSize: "13px",
      color: "#374151",
      textAlign: "start",
      marginBottom: "10px",
    },
    barcodeContainer: {
      marginTop: "auto",
      marginBottom: "16px",
      display: "flex",
      justifyContent: "center",
    },
    signatureContainer: {
      position: "static",
      textAlign: "center",
    },
    signatureImage: {
      width: "80px",
      height: "30px",
      objectFit: "contain",
    },
    signatureText: {
      fontSize: "14px",
      color: "#6b7280",
      marginTop: "4px",
    },
    backContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    backInfo: {
      fontSize: "13px",
      color: "#111827",
    },
    backTitle: {
      fontSize: "16px",
      fontWeight: 700,
      marginBottom: "12px",
      color: "#111827",
    },
    detailRowStyle: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      fontSize: "14px",
      fontWeight: 500,
    },
    detailRowStyleBack: {
      display: "flex",
      justifyContent: "space-between",

      fontSize: "14px",
      fontWeight: 500,
    },

    labelStyle: {
      fontWeight: "500",
    },

    valueStyle: {
      textAlign: "right",
    },
    logoheader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60px",
      padding: "3px 10px",
    },
    backText: {
      fontSize: "12px",
      color: "#6b7280",
      margin: "6px 0",
      lineHeight: "1.5",
    },
    instructionText: {
      fontSize: "11px",
      color: "#9ca3af",
      marginTop: "12px",
      textAlign: "center",
    },
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    if (Math.abs(swipeDistance) > 50) {
      setIsFront((prev) => !prev);
    }
  };

  const handleClick = () => {
    setIsFront((prev) => !prev);
  };
  const handlePrint = (ref: React.RefObject<HTMLDivElement>) => {
    const content = ref.current?.innerHTML;
    if (!content) return;
  
    const win = window.open("", "_blank");
    if (!win) return;
  
    win.document.write(`
      <html>
        <head>
          <title>ID Card</title>
          <style>
            @page { margin: 0; }
  
            html, body {
              margin: 0;
              padding: 0;
              background: none !important;
            }
  
            .print-area {
              width: 340px;
              height: 500px;
              margin: 0 auto;
              position: relative;
              overflow: hidden;
            }
  
            .background {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
              background-image: url(data:image/png;base64,${templateData?.BackgroundImage});
              background-size: cover;
              background-position: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
  
            .card-content {
              position: relative;
              z-index: 2;
              padding: 30px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="print-area">
            <div class="background"></div>
            <div class="card-content">
              ${content}
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
  };


  useEffect(() => {
    getAllCertificateTemplate();
    getEmployeeById();
  }, []);

  return (
    <React.Fragment>
     <div style={styles.wrapper}>
        <div
          style={styles.card}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        >
          <div style={styles.front} ref={frontRef}>
            <div style={styles.logoheader}>
              <img
                src={`data:image/png;base64,${templateData?.Logo}`}
                height="50px"
              />
            </div> 
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "8px",
              }}
            >
              <img
               src={`data:image/png;base64,${staffData?.photo}`}
                alt="Staff Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "contain",
                  border: "3px solid #006bff",
                }}
              />
            </div>
 
            <div style={styles.content}>
              <div style={styles.details}>
                {templateData?.StaffName && (
                  <p style={styles.staffName}>
                    {staffData?.firstName} {staffData?.lastName}
                  </p>
                )}
              </div>
 
              <div style={{ marginTop: "12px" }}>
                {templateData?.StaffId && (
                  <div style={styles.detailRowStyle}>
                    <span style={styles.labelStyle}>ID:</span>
                    <span style={styles.valueStyle}>{staffData?.staffId}</span>
                  </div>
                )}
                {templateData?.Department && (
                  <div style={styles.detailRowStyle}>
                    <span style={styles.labelStyle}>Department:</span>
                    <span style={styles.valueStyle}>
                      {staffData?.departmentName}
                    </span>
                  </div>
                )}
                {templateData?.Designation && (
                  <div style={styles.detailRowStyle}>
                    <span style={styles.labelStyle}>Designation:</span>
                    <span style={styles.valueStyle}>
                      {staffData?.designation}
                    </span>
                  </div>
                )}

                {templateData?.Phone && (
                  <div style={styles.detailRowStyle}>
                    <span style={styles.labelStyle}>Phone:</span>
                    <span style={styles.valueStyle}> {staffData?.phone}</span>
                  </div>
                )}
              </div> 
              {templateData?.Barcode && (
                <div style={styles.barcodeContainer}>
                  <Barcode value={staffData?.staffId} height={20} />
                </div>
              )}
            </div>
          </div>

          <div style={styles.back} ref={backRef}>
            <div style={styles.backContent}>
              <div style={styles.backInfo}>
                {/* Grid of Details */}
                <div style={styles.detailsGrid}>
                  {templateData?.DateOfJoining && (
                    <p style={styles.detailItem}>
                      <strong>Date of Joining:</strong>{" "}
                      {staffData?.dateOfJoining}
                    </p>
                  )}
                  {templateData?.FatherName && (
                    <p style={styles.detailItem}>
                      <strong>Husband Name:</strong> {staffData?.fatherName}
                    </p>
                  )}
                  {templateData?.MotherName && (
                    <p style={styles.detailItem}>
                      <strong>Father/ Mother Name:</strong> {staffData?.motherName}
                    </p>
                  )}
                  {templateData?.CurrentAddress && (
                    <p style={styles.detailItem}>
                      <strong>Address:</strong>
                      {staffData?.currentAddress}
                    </p>
                  )}
                  {templateData?.Phone && (
                    <p style={styles.detailItem}>
                      <strong>Phone:</strong> {staffData?.phone}
                    </p>
                  )}
                  {templateData?.DateOfBirth && (
                    <p style={styles.detailItem}>
                      <strong>DOB:</strong> {staffData?.dateOfBirth}
                    </p>
                  )}
                  {templateData?.BloodGroup && (
                    <p style={styles.detailItem}>
                      <strong>Blood Group:</strong> {staffData?.bloodGroup}
                    </p>
                  )}
                </div>
              </div> 
         
              {templateData?.Signature && (
                <div style={styles.signatureContainer}>
                  <img
                  src={`data:image/png;base64,${templateData?.Signature}`}
                    alt="Signature"
                    style={styles.signatureImage}
                  />
                  <p style={styles.signatureText}>Authorized Signature</p>
                </div>
              )}
              <div className="text-center mt-1">
                <h3
                   dangerouslySetInnerHTML={{ __html: templateData?.HospitalName }}
                  className="text-sm font-semibold"
                ></h3>
                <div
                    dangerouslySetInnerHTML={{ __html: templateData?.HospitalAddress }}
                  className="text-xs "
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handlePrint(frontRef)}
          style={{ padding: "8px 16px", fontWeight: "bold" }}
        >
          Print Front
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handlePrint(backRef)}
          style={{ padding: "8px 16px", fontWeight: "bold" }}
        >
          Print Back
        </button>
      </div>
    </React.Fragment >
  )
}

export default GenerateStaffID